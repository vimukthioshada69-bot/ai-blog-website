# SYNAPSE AI — SEO Upgrade Phase 3

## Changes
- Removed homepage canonical from root layout (prevents it being inherited by pages without their own canonical).
- Kept explicit page/article canonical metadata.
- Internal search results now use `noindex, follow`; removed `/search` from sitemap.
- Added `/tools` and `/tools/image-compressor` to sitemap.
- Removed artificial daily `lastModified` timestamps from static pages.
- Removed site-wide `X-Robots-Tag: index` response header, which could override page-level noindex.
- Simplified robots rules and retained sitemap discovery.
- Fixed fallback site URL to the supplied production domain.
- Removed unverified blanket `human-authored` declaration.

## Vercel configuration
Set `NEXT_PUBLIC_SITE_URL=https://ai-blog-website-beta.vercel.app` in Production environment. If you later connect a custom domain, update this variable and redeploy. Keep existing Supabase and CRON_SECRET settings.

## Verify after deploy
1. Visit `/robots.txt` and `/sitemap.xml` and check they use the correct production domain.
2. Inspect HTML source on `/`, `/news-feed`, `/tools`, `/tools/image-compressor`, a category page, and an article page. Confirm each indexable page has one self-referencing canonical.
3. Inspect `/search?q=test` and verify `noindex, follow`.
4. Check Google Search Console Pages indexing and Core Web Vitals reports; submit the sitemap URL.
5. Check article accuracy, source attribution, internal linking and genuinely useful original content. Feed-only aggregation does not guarantee SEO visibility.

## Limits
Static code review only; no production build or Search Console crawl completed here. Additional performance and content SEO issues may remain.
