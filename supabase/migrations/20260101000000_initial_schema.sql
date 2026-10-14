-- Supabase Migration: 2026 AI Blog Schema
-- Created for: 2026 AI Blog & News Platform

-- 1. Create categories table
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    icon text default 'Sparkles',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create posts table
create table if not exists public.posts (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    excerpt text not null,
    content text not null,
    cover_image_url text,
    category_id uuid references public.categories(id) on delete set null,
    tags text[] default array[]::text[],
    published boolean default false not null,
    published_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    seo_title text,
    seo_description text,
    view_count integer default 0 not null
);

-- 3. Enable Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.posts enable row level security;

-- 4. RLS Policies for Categories
-- Anyone can view categories
drop policy if exists "Public categories viewable by everyone" on public.categories;
create policy "Public categories viewable by everyone"
    on public.categories
    for select
    using (true);

-- Authenticated admins can insert/update/delete categories
drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
    on public.categories
    for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- 5. RLS Policies for Posts
-- Public can ONLY view published posts
drop policy if exists "Public can view published posts" on public.posts;
create policy "Public can view published posts"
    on public.posts
    for select
    using (published = true);

-- Authenticated admins can view, insert, update, and delete all posts (including drafts)
drop policy if exists "Admins have full access to posts" on public.posts;
create policy "Admins have full access to posts"
    on public.posts
    for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- 6. Atomic RPC function for post view count increment
create or replace function public.increment_view_count(post_slug text)
returns void
language plpgsql
security definer
as $$
begin
  update public.posts
  set view_count = view_count + 1
  where slug = post_slug;
end;
$$;

-- 7. Setup Storage Bucket for blog images
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = true;

-- Storage RLS Policies: Public read, authenticated admin write
drop policy if exists "Public can view blog images" on storage.objects;
create policy "Public can view blog images"
    on storage.objects for select
    using (bucket_id = 'blog-images');

drop policy if exists "Admins can upload blog images" on storage.objects;
create policy "Admins can upload blog images"
    on storage.objects for insert
    with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

drop policy if exists "Admins can update blog images" on storage.objects;
create policy "Admins can update blog images"
    on storage.objects for update
    using (bucket_id = 'blog-images' and auth.role() = 'authenticated');

drop policy if exists "Admins can delete blog images" on storage.objects;
create policy "Admins can delete blog images"
    on storage.objects for delete
    using (bucket_id = 'blog-images' and auth.role() = 'authenticated');

-- 8. Useful indexes for high performance querying
create index if not exists idx_posts_slug on public.posts (slug);
create index if not exists idx_posts_category_id on public.posts (category_id);
create index if not exists idx_posts_published on public.posts (published);
create index if not exists idx_posts_published_at on public.posts (published_at desc);
