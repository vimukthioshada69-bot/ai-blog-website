import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { NEWS_SOURCES } from './sources';

type NewsItem = { source: string; title: string; original_url: string; published_at: string | null };
function decodeEntities(value: string): string {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&(?:amp|lt|gt|quot|apos|#39|#x([0-9a-f]+)|#(\d+));/gi, (match, hex: string, dec: string) => {
    const names: Record<string,string> = {'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&#39;':"'"};
    if (hex || dec) { const cp = parseInt(hex || dec, hex ? 16 : 10); return cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ''; }
    return names[match.toLowerCase()] ?? match;
  }).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}
function field(xml: string, name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = xml.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'));
  return match ? decodeEntities(match[1]) : '';
}
function safeUrl(raw: string): string | null {
  try { const u = new URL(raw.trim()); if (u.protocol !== 'https:') return null; u.hash = ''; for (const k of [...u.searchParams.keys()]) if (/^(utm_|fbclid|gclid)/i.test(k)) u.searchParams.delete(k); return u.toString(); } catch { return null; }
}
function parseFeed(xml: string, source: string, feedUrl: string): NewsItem[] {
  const items = [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)].slice(0, 35);
  const host = new URL(feedUrl).hostname;
  return items.flatMap((match) => {
    const body = match[2];
    const atomLink = body.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\/?>/i)?.[1];
    const url = safeUrl(atomLink || field(body, 'link'));
    if (!url || ![host, host.replace(/^www\./, ''), 'www.' + host.replace(/^www\./, '')].includes(new URL(url).hostname)) return [];
    const title = field(body, 'title');
    if (title.length < 5 || title.length > 350) return [];
    const dateRaw = field(body, 'pubDate') || field(body, 'published') || field(body, 'updated');
    const date = dateRaw ? new Date(dateRaw) : null;
    return [{source, title, original_url: url, published_at: date && !Number.isNaN(date.getTime()) ? date.toISOString() : null}];
  });
}
export async function refreshNews(): Promise<{ inserted: number; sources: Record<string,string> }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase URL or server-only service role key');
  const db = createClient(url, key, {auth: {persistSession: false}});
  let inserted = 0;
  const sources: Record<string,string> = {};
  for (const source of NEWS_SOURCES) {
    try {
      const response = await fetch(source.url, {signal: AbortSignal.timeout(9000), headers: {'User-Agent': 'SynapseAI-NewsAggregator/1.0 (+https://ai-blog-website-beta.vercel.app/)', 'Accept':'application/rss+xml, application/atom+xml, application/xml, text/xml'}});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const xml = await response.text();
      if (xml.length > 2_000_000) throw new Error('Feed too large');
      const items = parseFeed(xml, source.name, source.url);
      if (!items.length) throw new Error('No compatible RSS/Atom items found');
      const {data, error} = await db.from('external_news').upsert(items, {onConflict: 'original_url', ignoreDuplicates: true}).select('id');
      if (error) throw error;
      inserted += data?.length ?? 0;
      sources[source.name] = `ok (${items.length} items)`;
    } catch (error) { sources[source.name] = `error: ${error instanceof Error ? error.message : 'unknown'}`; }
  }
  return {inserted, sources};
}
