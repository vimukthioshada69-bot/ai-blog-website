import type { Metadata } from 'next';
import Link from 'next/link';
import { createPublicClient, isSupabaseConfigured } from '@/lib/supabase/server';
export const revalidate = 900;
export const metadata: Metadata = {title: 'AI & Technology News Feed', description: 'Latest AI and technology announcements, linked to their original publishers.', alternates: {canonical: '/news-feed'}};
type Item = {id: number; title: string; source: string; original_url: string; published_at: string | null};
export default async function NewsFeedPage() {
  let items: Item[] = [];
  let unavailable = false;
  if (isSupabaseConfigured()) {
    const {data, error} = await createPublicClient().from('external_news').select('id,title,source,original_url,published_at').order('published_at', {ascending:false, nullsFirst:false}).limit(60);
    if (error) unavailable = true;
    else items = (data || []) as Item[];
  } else unavailable = true;
  return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-5xl px-5 py-14">
    <Link href="/" className="text-sm font-semibold text-indigo-600">← SYNAPSE AI</Link>
    <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900">AI & Tech News Feed</h1>
    <p className="mt-3 max-w-2xl text-slate-600">Fresh headlines from original publishers, checked every six hours. We link to their reporting rather than republishing copyrighted articles.</p>
    <p className="mt-2 text-xs text-slate-500">External links lead to third-party websites. Headlines and availability are controlled by their publishers.</p>
    {unavailable ? <p className="mt-10 rounded-xl bg-amber-50 p-6 text-amber-900">News feed is not configured yet. See NEWS_SETUP.md to set up the database and cron job.</p> : items.length === 0 ? <p className="mt-10 rounded-xl bg-white p-6 text-slate-700">No news items yet. The feed will populate after the first successful scheduled refresh.</p> :
    <div className="mt-10 grid gap-4 md:grid-cols-2">{items.map(item => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-600"><span>{item.source}</span><span className="text-slate-300">•</span><time className="text-slate-500">{item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', {year:'numeric',month:'short',day:'numeric', timeZone:'UTC'}) : 'Date unavailable'}</time></div>
      <h2 className="mt-3 text-lg font-bold leading-snug text-slate-900">{item.title}</h2>
      <a href={item.original_url} target="_blank" rel="noopener noreferrer nofollow" className="mt-5 inline-flex text-sm font-bold text-indigo-600 hover:underline">Read at original source ↗</a>
    </article>)}</div>}
  </div></main>;
}
