# SYNAPSE AI Upgrade — Phase 1

This is an additive upgrade of the uploaded existing repository, not a replacement.

## New
- `/tools`: free online tools hub
- `/tools/image-compressor`: working browser-only JPEG/WebP compression with preview, quality slider and download
- New homepage call-to-action and navigation link
- SEO metadata on both tool pages

## Preserved
- Existing blog routes, Supabase integration, admin dashboard, authentication, and existing directory at `/free-tools`

## Local setup
1. Install Node.js 20.9+ (prefer current LTS).
2. `npm ci`
3. Copy `.env.example` to `.env.local` and set the original Supabase values (never commit real keys).
4. `npm run dev` and visit http://localhost:3000/tools/image-compressor
5. `npm run build` before deployment.

## Deployment
Commit changed files to the existing GitHub repository and let the existing Vercel project deploy. Keep original Vercel environment variables.

## Notes
- This tool processes files locally; it does not call a paid AI API.
- JPEG conversion replaces transparent pixels with white. WebP supports transparency.
- Some images can become larger rather than smaller.
- Browser memory use depends on image dimensions.
