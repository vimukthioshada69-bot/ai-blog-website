# SYNAPSE AI — Auto News Feed (Phase 2)

This upgrade extends the existing Phase 1 project. Blog posts, admin pages, Supabase schema and routes are preserved.

## Setup
1. In Supabase SQL Editor run `supabase/migrations/20261109000000_external_news.sql` once. Do not run the full schema again.
2. In Vercel Project Settings → Environment Variables set `SUPABASE_SERVICE_ROLE_KEY` to the **service_role** secret from your own Supabase project, and `CRON_SECRET` to a long random string. Keep both server-only; never prefix `NEXT_PUBLIC_`, expose in client code, or commit real secrets.
3. Keep the existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` settings.
4. Deploy the updated repository. The scheduled GET `/api/cron/news` uses `Authorization: Bearer <CRON_SECRET>`; Vercel Cron sends this automatically when CRON_SECRET is set.
5. To test manually, send an authenticated GET to `https://YOUR-DOMAIN/api/cron/news` using an API client with the Authorization header. Never paste secrets into URL query strings.
6. Visit `/news-feed` after the first successful run. The navigation includes a link.

## Scheduling caveat
`vercel.json` sets `0 */6 * * *` (UTC). Vercel plan limits may restrict cron schedules; if deployment rejects this schedule, use an allowed schedule or GitHub Actions with a repository secret and authenticated curl request. Cron triggers are best-effort, not guaranteed to run at exact minute.

## Copyright and safety
Only headlines, dates, publisher names and links are stored; no article body, thumbnails, or scraped full text. The feed is not an endorsement of third-party content. Confirm each feed publisher's terms and headline redistribution permissions before enabling it. Disable sources whose terms do not allow this use. No AI-generated article text, copied images, or third-party HTML is published. Publisher URLs are constrained to each configured feed host and HTTPS. RLS grants public read only, while writes require server-side service role. Duplicate canonicalized URLs are prevented by a unique constraint. RSS and Atom parser is intentionally lightweight; individual source failures appear in authenticated cron JSON and do not block others. If feed formats change, adjust parser or replace it with a maintained XML parser.

## Troubleshooting
- `Unauthorized`: missing/wrong CRON_SECRET.
- `News refresh failed`: check server env vars and Supabase migration.
- `No compatible RSS/Atom items`: feed URL or XML format changed; inspect authenticated cron status.
- `No news items`: run cron manually, inspect source statuses and check permissions.
- Existing blog is unaffected by empty external news.

## Test
Run `npm ci`, `npx tsc --noEmit`, and `npm run build` with your existing Supabase environment configured. Full production deployment still needs verification on your Vercel account.
