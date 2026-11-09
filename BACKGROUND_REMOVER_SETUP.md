# SYNAPSE AI — Background Remover

Added `/tools/background-remover`, a new Tools Hub card, and a sitemap entry.

## Setup

1. Run `npm install` to install `@imgly/background-removal` and generate a new lockfile. The original lockfile was removed because dependency resolution was unavailable during packaging.
2. Run `npm run dev` and visit `/tools/background-remover`.
3. Test on desktop and mobile; the model downloads on first use and needs memory.
4. Commit the generated `package-lock.json` together with the changes before deploying to Vercel.

## Important

- The library and its model assets have their own license conditions; verify current IMG.LY licensing before commercial use.
- No images are sent to the SYNAPSE AI backend by this tool. Model files are fetched from the library's configured distribution endpoint.
- Original blog, Supabase, admin and SEO routes were not removed.
