-- Supabase Migration: 2026 AI Blog Schema Extension
-- Adds authors, site settings, and extended post attributes

-- 1. Create authors table
create table if not exists public.authors (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    avatar_url text,
    bio text,
    social_links jsonb default '{"twitter": "", "github": "", "linkedin": "", "website": ""}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS on authors
alter table public.authors enable row level security;

drop policy if exists "Public can view authors" on public.authors;
create policy "Public can view authors"
    on public.authors for select
    using (true);

drop policy if exists "Admins can manage authors" on public.authors;
create policy "Admins can manage authors"
    on public.authors for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- 3. Extend posts table
alter table public.posts
    add column if not exists author_id uuid references public.authors(id) on delete set null,
    add column if not exists reading_time integer default 1,
    add column if not exists source_name text,
    add column if not exists source_url text,
    add column if not exists scheduled_for timestamp with time zone;

-- Update posts index for performance
create index if not exists idx_posts_author_id on public.posts (author_id);
create index if not exists idx_posts_scheduled_for on public.posts (scheduled_for);

-- 4. Create site_settings table (single-row configuration)
create table if not exists public.site_settings (
    id uuid primary key default gen_random_uuid(),
    site_title text not null default 'SYNAPSE 2026',
    site_description text not null default '2026 AI Intelligence, Technical Guides & Free Tools Directory',
    social_links jsonb default '{"twitter": "https://twitter.com", "github": "https://github.com", "linkedin": "https://linkedin.com", "youtube": "https://youtube.com"}'::jsonb,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on site_settings
alter table public.site_settings enable row level security;

drop policy if exists "Public can view site settings" on public.site_settings;
create policy "Public can view site settings"
    on public.site_settings for select
    using (true);

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
    on public.site_settings for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Insert default single site settings row if not exists
insert into public.site_settings (id, site_title, site_description)
values ('s0000000-0000-0000-0000-000000000001', 'SYNAPSE 2026', 'The premier destination for 2026 artificial intelligence news, deep learning explainers, autonomous agent architectures, prompt engineering tips, and curated free AI tools.')
on conflict (id) do nothing;

-- 5. Insert default author profiles
insert into public.authors (id, name, slug, avatar_url, bio, social_links) values
(
    'a0000000-0000-0000-0000-000000000001',
    'Dr. Elena Vance',
    'dr-elena-vance',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'Principal AI Research Scientist specializing in autonomous agent swarms, latent memory graphs, and reinforcement learning alignment.',
    '{"twitter": "https://twitter.com", "github": "https://github.com", "linkedin": "https://linkedin.com"}'::jsonb
),
(
    'a0000000-0000-0000-0000-000000000002',
    'Marcus Thorne',
    'marcus-thorne',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'Systems engineer and open-source advocate focusing on local LLM quantization, PyTorch inference acceleration, and developer tooling.',
    '{"twitter": "https://twitter.com", "github": "https://github.com", "linkedin": "https://linkedin.com"}'::jsonb
),
(
    'a0000000-0000-0000-0000-000000000003',
    'Aria Chen',
    'aria-chen',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'Graphics programmer and neural rendering researcher exploring 3D Gaussian Splatting and generative AI integration in modern game engines.',
    '{"twitter": "https://twitter.com", "github": "https://github.com", "linkedin": "https://linkedin.com"}'::jsonb
)
on conflict (slug) do nothing;
