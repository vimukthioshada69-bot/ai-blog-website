# SYNAPSE AI — Remove auto news and admin responsive fixes

## Changes
- Removed auto-news RSS ingestion, database queries, cron route, navigation item, sitemap entry, Vercel cron config, and news migration file.
- Kept original blog, tools, Supabase database, and SEO features.
- Added mobile admin navigation drawer and scroll-safe admin layout; login screen no longer renders admin sidebar or logout.
- Removed insecure demo login and sample email; restricts admin access to explicit ADMIN_EMAILS allowlist.

## Required Vercel environment setting
Set `ADMIN_EMAILS=your-real-admin-email@example.com` in Vercel Project Settings > Environment Variables, then redeploy. This must match an existing Supabase Auth user email. Set the same value in `.env.local` for local testing. Do not prefix with NEXT_PUBLIC_. Multiple admin emails can be comma-separated.

## Deployment
`npm ci` then `npm run build`; push updated source to existing repository. No news migration needs to be executed. Existing external_news database table (if created) is left untouched to avoid deleting data. You may remove it manually after confirming it is unused.

## Verification
Test `/admin/login` signed out; admin sign-in with authorized account; non-admin rejection; sign-out; mobile menu at 375px; article editor, categories, media, and table scrolling. Live Supabase auth and Vercel deployment require your environment and have not been verified here.
