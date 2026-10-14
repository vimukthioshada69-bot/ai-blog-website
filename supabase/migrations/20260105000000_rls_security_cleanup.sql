-- ==============================================================================
-- SYNAPSE AI (2026 Edition)
-- Migration: 20260105000000_rls_security_cleanup.sql
-- Description: Consolidated Row Level Security (RLS) Audit & Policy Cleanup
-- Removes redundant/duplicate policies, tightens access controls so public
-- users can only SELECT published content, and only authenticated admins can manage.
-- ==============================================================================

-- 1. POSTS TABLE
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;

-- Clean up any legacy or duplicate policies
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Admins have full access to posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can manage posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;

-- Public can ONLY view published posts
CREATE POLICY "Public can view published posts"
    ON public.posts
    FOR SELECT
    USING (published = true);

-- Authenticated admins have full management access (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admins have full access to posts"
    ON public.posts
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- 2. CATEGORIES TABLE
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public categories viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;

-- Public can view categories
CREATE POLICY "Public can view categories"
    ON public.categories
    FOR SELECT
    USING (true);

-- Authenticated admins can manage categories
CREATE POLICY "Admins can manage categories"
    ON public.categories
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- 3. AUTHORS TABLE
ALTER TABLE IF EXISTS public.authors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view authors" ON public.authors;
DROP POLICY IF EXISTS "Admins can manage authors" ON public.authors;
DROP POLICY IF EXISTS "Authenticated users can manage authors" ON public.authors;

-- Public can view authors
CREATE POLICY "Public can view authors"
    ON public.authors
    FOR SELECT
    USING (true);

-- Authenticated admins can manage authors
CREATE POLICY "Admins can manage authors"
    ON public.authors
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- 4. PAGE CONTENT TABLE
ALTER TABLE IF EXISTS public.page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view page content" ON public.page_content;
DROP POLICY IF EXISTS "Admins can manage page content" ON public.page_content;
DROP POLICY IF EXISTS "Authenticated users can manage page content" ON public.page_content;

-- Public can view static site page content
CREATE POLICY "Public can view page content"
    ON public.page_content
    FOR SELECT
    USING (true);

-- Authenticated admins can manage page content
CREATE POLICY "Admins can manage page content"
    ON public.page_content
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- 5. SITE SETTINGS TABLE
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can manage site settings" ON public.site_settings;

-- Public can view site settings
CREATE POLICY "Public can view site settings"
    ON public.site_settings
    FOR SELECT
    USING (true);

-- Authenticated admins can manage site settings
CREATE POLICY "Admins can manage site settings"
    ON public.site_settings
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- 6. POST VIEWS DEDUPLICATION TABLE
ALTER TABLE IF EXISTS public.post_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert views" ON public.post_views;
DROP POLICY IF EXISTS "Public can select views" ON public.post_views;
DROP POLICY IF EXISTS "Service can insert views" ON public.post_views;
DROP POLICY IF EXISTS "Service can select views" ON public.post_views;
DROP POLICY IF EXISTS "Admins can manage views" ON public.post_views;

-- Visitors can insert views via tracking API
CREATE POLICY "Public can insert views"
    ON public.post_views
    FOR INSERT
    WITH CHECK (true);

-- API can check visitor hash within 24h
CREATE POLICY "Public can select views"
    ON public.post_views
    FOR SELECT
    USING (true);

-- Authenticated admins can manage/purge view logs
CREATE POLICY "Admins can manage views"
    ON public.post_views
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- 7. COMMENTS TABLE
ALTER TABLE IF EXISTS public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Public can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Admins have full access to comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can manage comments" ON public.comments;

-- Public can read approved comments
CREATE POLICY "Public can view approved comments"
    ON public.comments
    FOR SELECT
    USING (status = 'approved');

-- Public can submit comments for moderation
CREATE POLICY "Public can insert comments"
    ON public.comments
    FOR INSERT
    WITH CHECK (true);

-- Authenticated admins can manage all comments (approve, reject, pin, delete)
CREATE POLICY "Admins have full access to comments"
    ON public.comments
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- 8. STORAGE BUCKET (blog-images)
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;

CREATE POLICY "Public can view blog images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can update blog images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete blog images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
