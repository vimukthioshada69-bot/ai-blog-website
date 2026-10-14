-- ==============================================================================
-- SYNAPSE AI (2026 Edition)
-- Migration: 20260104000000_comments_system.sql
-- Description: Interactive Article Comments System with Nested Replies & Admin Moderation
-- ==============================================================================

-- 1. Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected', 'spam')),
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON public.comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_approved ON public.comments(post_id, created_at DESC) WHERE status = 'approved';

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Public can read approved comments
CREATE POLICY "Public can view approved comments"
    ON public.comments
    FOR SELECT
    USING (status = 'approved');

-- Public can submit new comments
CREATE POLICY "Public can insert comments"
    ON public.comments
    FOR INSERT
    WITH CHECK (true);

-- Authenticated admins have full management access (Read, Update, Delete)
CREATE POLICY "Admins have full access to comments"
    ON public.comments
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Seed initial discussion comments
INSERT INTO public.comments (id, post_id, author_name, author_email, content, status, is_pinned, created_at)
VALUES
(
    '40000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Kavinda Perera',
    'kavinda@example.com',
    'The breakdown of multi-perspective consensus loops is spot on. We implemented a supervisor-critic agent architecture in our LangGraph pipeline last month and saw hallucination rates drop by over 68% in production.',
    'approved',
    true,
    now() - INTERVAL '1 day'
),
(
    '40000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000001',
    'Sarah Jenkins',
    'sarah.j@techcorp.io',
    'How are you handling state rollback when the automated verifier triggers a retry loop on non-deterministic tool outputs? Would love to see a follow-up article on checkpoint serialization.',
    'approved',
    false,
    now() - INTERVAL '18 hours'
),
(
    '40000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000002',
    'Alexandre Dubois',
    'alex@deepresearch.org',
    'FlashAttention-4 and AWQ quantization transformed how we serve 70B parameter models on consumer workstations. Excellent and accessible guide!',
    'approved',
    false,
    now() - INTERVAL '12 hours'
)
ON CONFLICT (id) DO NOTHING;
