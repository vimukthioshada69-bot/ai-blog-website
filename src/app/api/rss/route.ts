import { getPublishedPosts, getSiteSettings } from '@/lib/data/posts';
import { getSiteUrl } from '@/lib/utils';

/**
 * RSS 2.0 Feed for AI Content Discovery
 * 
 * AI answer engines (Google, Perplexity, ChatGPT) actively monitor RSS feeds
 * to discover and index fresh content faster than standard crawling.
 * 
 * Access: /api/rss or /api/rss.xml
 */
export async function GET() {
  const siteUrl = getSiteUrl();
  const [posts, settings] = await Promise.all([
    getPublishedPosts({ limit: 50 }),
    getSiteSettings(),
  ]);

  const siteName = settings?.site_title || 'SYNAPSE 2026';
  const siteDescription = settings?.site_description || 'The premier destination for 2026 artificial intelligence news, deep learning explainers, and curated free AI tools.';

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const rssItems = posts.map((post) => {
    const categorySlug = post.category?.slug || 'ai-news';
    const postUrl = `${siteUrl}/${categorySlug}/${post.slug}`;
    const pubDate = new Date(post.published_at).toUTCString();
    const excerpt = post.seo_description || post.excerpt || '';
    const coverImage = post.cover_image_url || '';

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <description><![CDATA[${excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${post.category ? `<category>${escapeXml(post.category.name)}</category>` : ''}
      ${post.author ? `<dc:creator>${escapeXml(post.author.name)}</dc:creator>` : ''}
      ${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ') || ''}
      ${coverImage ? `<media:content url="${escapeXml(coverImage)}" medium="image" />` : ''}
    </item>`;
  });

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(siteUrl)}/api/rss" rel="self" type="application/rss+xml" />
    <generator>SYNAPSE 2026 RSS Generator</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>60</ttl>
    <image>
      <url>${escapeXml(siteUrl)}/favicon.ico</url>
      <title>${escapeXml(siteName)}</title>
      <link>${escapeXml(siteUrl)}</link>
    </image>
${rssItems.join('\n')}
  </channel>
</rss>`;

  return new Response(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
