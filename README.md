# SYNAPSE AI (2026 Edition) ⚡
### Full-Stack AI News, Explainer Guides & Free Tools Platform

A state-of-the-art, high-performance web publication built with **Next.js 15 (App Router, TypeScript)**, **Tailwind CSS (Modern Light Theme)**, and **Supabase (PostgreSQL, Row Level Security, Auth & Storage)**. Designed for 2026 artificial intelligence journalism, technical deep learning roadmaps, autonomous agent architectures, prompt engineering blueprints, and free AI tool directories.

---

## 🚀 Key Features

- **2026 AI Architecture**:
  - Next.js 15 App Router with Server Components and Server Actions.
  - Blazing-fast page load times with Incremental Static Regeneration (ISR) and static page pre-rendering.
  - Zero-flicker light theme with curated violet/indigo accents (`#6366f1` / `#4f46e5`) and modern typography.
- **Rich Article Experience**:
  - Full Markdown & GFM renderer with interactive copyable code blocks and syntax highlighting.
  - Custom callout blocks (Tips, Warnings, AI Prompts), formatted tables, and image captions.
  - Atomic read view-counter with session-based de-duplication.
  - Dynamic social sharing (X / Twitter, LinkedIn, Reddit, Copy Link).
- **Search & Discovery**:
  - Real-time instant search modal (`⌘K` / `Ctrl+K`).
  - Category archive pages (`/category/ai-news`, `/category/learn-ai`, `/category/deep-learning`, `/category/free-tools`, `/category/gaming-tech`, `/category/prompt-engineering`).
  - Interactive tag filtering.
- **Admin Control Panel (`/admin`)**:
  - Protected by Supabase Auth with server-side middleware route guards.
  - Dashboard analytics: Total Articles, Published count, Drafts, and total readership views.
  - Dual-mode Markdown post editor (Write / Split / Preview) with formatting toolbar.
  - Automatic URL slug generator with manual override lock/unlock.
  - Drag-and-drop cover image uploader directly to Supabase Storage.
  - Real-time Google Search Snippet preview with live character counters.
- **SEO & Performance (100% Score Ready)**:
  - Dynamic OpenGraph and Twitter card metadata generation via `generateMetadata`.
  - Schema.org JSON-LD structured data (`Article` & `BreadcrumbList`) for rich search snippets.
  - Auto-generated dynamic `sitemap.xml` (`app/sitemap.ts`) and `robots.txt` (`app/robots.ts`).
  - Accessible semantic HTML with proper heading hierarchies.
- **Security & Protection**:
  - Row Level Security (RLS) on all PostgreSQL tables (Public can only read published posts; Authenticated admins have full CRUD).
  - Server-side input validation and sanitization via **Zod**.
  - Built-in rate limiting on Contact form and Admin Login endpoints.
  - Strict Content Security Policy (CSP), X-Frame-Options, and security headers configured in `next.config.ts`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Actions) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 (Light Theme Palette) |
| **Database & Auth** | Supabase (PostgreSQL with RLS + GoTrue Auth) |
| **Media Storage** | Supabase Storage (`blog-images` bucket) |
| **Markdown** | `react-markdown`, `remark-gfm`, `rehype-highlight`, `rehype-slug` |
| **Validation** | `zod` |
| **Icons** | `lucide-react` |
| **Deployment** | Vercel |

---

## 📦 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note**: If you run without Supabase credentials, the application includes a rich built-in fallback dataset so you can preview all pages immediately.

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database & Auth Setup

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. In your Project Settings -> **API**, copy the **Project URL** and the **anon / public key**.

### Step 2: Run Database Migrations
1. In the Supabase Dashboard, navigate to the **SQL Editor**.
2. Open and copy the contents of `supabase/migrations/20260101000000_initial_schema.sql`.
3. Paste into the SQL Editor and click **Run**. This will create:
   - `categories` table with RLS policies
   - `posts` table with RLS policies
   - `increment_view_count` atomic RPC function
   - `blog-images` storage bucket with upload & public read policies
   - Query performance indexes

### Step 3: Populate Sample Seed Data
1. In the Supabase **SQL Editor**, open and copy the contents of `supabase/seed.sql`.
2. Paste and click **Run**. This populates high-quality sample posts and categories across all 2026 AI topics.

### Step 4: Create Your First Admin User
1. In the Supabase Dashboard, go to **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter your admin email (e.g. `admin@example.com`) and a secure password.
4. Set **Auto Confirm User?** to **Checked**.
5. Click **Create User**.
6. You can now log into your site's `/admin/login` page with these credentials!

---

## ☁️ Deploying to Vercel

Deploying your 2026 AI Blog to Vercel takes under 2 minutes:

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [https://vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
3. Import your repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-production-domain.vercel.app`
5. Click **Deploy**.

Vercel will automatically build and optimize the application with edge caching and image optimization.

---

## 📂 Project Structure

```
├── public/                     # Static assets & icons
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── actions/            # Server Actions (Auth, Posts, Contact)
│   │   ├── admin/              # Protected Admin Dashboard & Editor
│   │   ├── category/[slug]/    # Dynamic Category Archive Pages
│   │   ├── post/[slug]/        # Single Post Detail Page & Reader
│   │   ├── about/              # Editorial Mission & Standards Page
│   │   ├── contact/            # Contact Form & Direct Inquiries
│   │   ├── search/             # Keyword Search & Tag Filtering
│   │   ├── globals.css         # Global Styles & Syntax Highlighting
│   │   ├── layout.tsx          # Root Layout & Dynamic Metadata
│   │   ├── page.tsx            # Home Page with Hero Spotlight & Grid
│   │   ├── robots.ts           # Dynamic robots.txt Generator
│   │   └── sitemap.ts          # Dynamic sitemap.xml Generator
│   ├── components/
│   │   ├── admin/              # PostForm, ImageUpload, AdminPostsTable
│   │   ├── layout/             # Navbar, Footer
│   │   ├── post/               # PostCard, MarkdownRenderer, ShareButtons, ViewCounter
│   │   ├── search/             # SearchModal (⌘K)
│   │   └── seo/                # JsonLd Structured Data
│   ├── lib/
│   │   ├── data/               # Posts & Categories Data Access Layer
│   │   ├── security/           # Rate Limiter, Zod Validation Schemas
│   │   ├── supabase/           # Client, Server, Middleware, Database Types
│   │   └── utils.ts            # Formatting, Reading Time, Slugs
│   └── middleware.ts           # Route Protection & Session Refresh
├── supabase/
│   ├── migrations/             # SQL Schema & RLS Migrations
│   └── seed.sql                # Rich 2026 Sample Posts & Categories
├── .env.example                # Environment Variable Template
├── next.config.ts              # Security Headers & Image Domains
└── tailwind.config.ts          # Tailwind Configuration
```

---

## 🔒 Security Summary

- **No Stored Passwords**: Authentication is handled exclusively through Supabase Auth (bcrypt-hashed with token sessions).
- **Server Middleware Guard**: Admin endpoints (`/admin/*`) strictly verify sessions on the server before rendering.
- **Row Level Security**: Non-admin database connections cannot access unverified drafts or execute write mutations.
- **XSS & Injection Protection**: Strict input validation using Zod and sanitization.
- **Spam Defense**: Honeypot detection and rate limiting on forms.

---

## 📄 License

MIT License. Feel free to use this project as the foundation for your own AI newsroom, technology blog, or engineering publication.
