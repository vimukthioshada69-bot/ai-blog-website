-- External links only. Never copy third-party article bodies or images.
create table if not exists public.external_news (
 id bigint generated always as identity primary key,
 source text not null,
 title text not null check (char_length(title) between 5 and 350),
 original_url text not null unique,
 published_at timestamptz,
 fetched_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
create index if not exists external_news_published_idx on public.external_news (published_at desc nulls last);
alter table public.external_news enable row level security;
revoke all on public.external_news from anon, authenticated;
grant select on public.external_news to anon, authenticated;
drop policy if exists "External news public read" on public.external_news;
create policy "External news public read" on public.external_news for select to anon, authenticated using (true);
-- INSERT / UPDATE are performed only via service-role server-side client.
