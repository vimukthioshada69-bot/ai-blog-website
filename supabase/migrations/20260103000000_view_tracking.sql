-- Migration: Real view tracking system
-- Run: supabase db push OR paste into Supabase SQL Editor

-- 1. Reset all existing view counts to 0 (remove seeded/fake data)
UPDATE posts SET view_count = 0;

-- 2. Create post_views table for deduplication log
CREATE TABLE IF NOT EXISTS post_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  visitor_hash TEXT NOT NULL,       -- sha256(ip + user_agent + post_id)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast dedup lookups: find hash for a post within 24h
CREATE INDEX IF NOT EXISTS idx_post_views_post_hash
  ON post_views (post_id, visitor_hash, created_at DESC);

-- 3. Row-level security: only service-role can insert/read
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- Allow the API route (using anon/service key) to insert
CREATE POLICY "Service can insert views"
  ON post_views FOR INSERT
  WITH CHECK (true);

-- Allow service to select (for dedup check)
CREATE POLICY "Service can select views"
  ON post_views FOR SELECT
  USING (true);

-- 4. Safe atomic increment function (avoids race conditions)
CREATE OR REPLACE FUNCTION increment_post_view(p_post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = p_post_id;
END;
$$;
