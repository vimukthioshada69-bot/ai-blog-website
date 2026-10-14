-- ==============================================================================
-- SYNAPSE 2026 AI BLOG - TABLES, FUNCTIONS, RLS & SEED DATA (VALIDATED UUIDs)
-- ==============================================================================
-- Paste this entire file into your Supabase SQL Editor and click RUN:
-- https://supabase.com/dashboard/project/aajpavrznhpftunmzgvj/sql/new
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT DEFAULT 'Sparkles',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public categories viewable by everyone" ON public.categories;
CREATE POLICY "Public categories viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 2. AUTHORS
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    social_links JSONB DEFAULT '{"twitter": "", "github": "", "linkedin": "", "website": ""}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view authors" ON public.authors;
CREATE POLICY "Public can view authors"
    ON public.authors FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage authors" ON public.authors;
CREATE POLICY "Admins can manage authors"
    ON public.authors FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 3. POSTS
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
    reading_time INTEGER DEFAULT 1,
    source_name TEXT,
    source_url TEXT,
    scheduled_for TIMESTAMPTZ,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    published BOOLEAN DEFAULT false NOT NULL,
    published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    view_count INTEGER DEFAULT 0 NOT NULL
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
CREATE POLICY "Public can view published posts"
    ON public.posts FOR SELECT
    USING (published = true);

DROP POLICY IF EXISTS "Admins have full access to posts" ON public.posts;
CREATE POLICY "Admins have full access to posts"
    ON public.posts FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON public.posts (category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts (author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts (published);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_for ON public.posts (scheduled_for);

-- 4. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_title TEXT NOT NULL DEFAULT 'SYNAPSE 2026',
    site_description TEXT NOT NULL DEFAULT '2026 AI Intelligence, Technical Guides & Free Tools Directory',
    social_links JSONB DEFAULT '{"twitter": "https://twitter.com", "github": "https://github.com", "linkedin": "https://linkedin.com", "youtube": "https://youtube.com"}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 5. POST VIEWS DEDUP
CREATE TABLE IF NOT EXISTS public.post_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    visitor_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_post_views_post_hash ON public.post_views (post_id, visitor_hash, created_at DESC);

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert views" ON public.post_views;
CREATE POLICY "Public can insert views" ON public.post_views FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select views" ON public.post_views;
CREATE POLICY "Public can select views" ON public.post_views FOR SELECT USING (true);

-- 6. FUNCTIONS
CREATE OR REPLACE FUNCTION public.increment_post_view(p_post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.posts
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE id = p_post_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_view_count(post_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.posts
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE slug = post_slug;
END;
$$;

-- 7. PAGE CONTENT
CREATE TABLE IF NOT EXISTS public.page_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key TEXT UNIQUE NOT NULL,
    title TEXT,
    banner_text TEXT,
    body_content TEXT,
    seo_title TEXT,
    seo_description TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view page content" ON public.page_content;
CREATE POLICY "Public can view page content" ON public.page_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage page content" ON public.page_content;
CREATE POLICY "Admins can manage page content" ON public.page_content FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 8. SEED DATA (Valid Hexadecimal UUIDs: 0-9, a-f)
-- ==============================================================================

-- Categories (Prefix 00000000)
INSERT INTO public.categories (id, name, slug, description, icon) VALUES
('00000000-0000-0000-0000-000000000001', 'AI News', 'ai-news', 'Breaking developments, foundation model releases, and industry shifts in artificial intelligence.', 'Zap'),
('00000000-0000-0000-0000-000000000002', 'Learn AI', 'learn-ai', 'Comprehensive beginner-to-advanced guides for mastering modern artificial intelligence.', 'GraduationCap'),
('00000000-0000-0000-0000-000000000003', 'Deep Learning', 'deep-learning', 'Architecture deep dives, transformer mechanics, reinforcement learning, and neural networks.', 'Cpu'),
('00000000-0000-0000-0000-000000000004', 'Free Tools', 'free-tools', 'Handpicked directory of open-source and free AI tools, APIs, and productivity boosters.', 'Compass'),
('00000000-0000-0000-0000-000000000005', 'Gaming & Tech', 'gaming-tech', 'How AI is revolutionizing interactive gaming, neural rendering, procedural worlds, and hardware.', 'Gamepad2'),
('00000000-0000-0000-0000-000000000006', 'Prompt Engineering', 'prompt-engineering', 'Tactical patterns, structured output prompting, and metaprompt design strategies.', 'Terminal')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Authors (Prefix 10000000)
INSERT INTO public.authors (id, name, slug, avatar_url, bio, social_links) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'Dr. Elena Vance',
    'dr-elena-vance',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'Principal AI Research Scientist specializing in autonomous agent swarms, latent memory graphs, and reinforcement learning alignment.',
    '{"twitter": "https://twitter.com", "github": "https://github.com", "linkedin": "https://linkedin.com", "website": "https://synapse-ai.com/authors/dr-elena-vance"}'::jsonb
),
(
    '10000000-0000-0000-0000-000000000002',
    'Marcus Thorne',
    'marcus-thorne',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'Systems engineer and open-source advocate focusing on local LLM quantization, PyTorch inference acceleration, and developer tooling.',
    '{"twitter": "https://twitter.com", "github": "https://github.com", "linkedin": "https://linkedin.com", "website": "https://synapse-ai.com/authors/marcus-thorne"}'::jsonb
),
(
    '10000000-0000-0000-0000-000000000003',
    'Aria Chen',
    'aria-chen',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'Graphics programmer and neural rendering researcher exploring 3D Gaussian Splatting and generative AI integration in modern game engines.',
    '{"twitter": "https://twitter.com", "github": "https://github.com", "linkedin": "https://linkedin.com", "website": "https://synapse-ai.com/authors/aria-chen"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, bio = EXCLUDED.bio, avatar_url = EXCLUDED.avatar_url;

-- Site Settings (Prefix 20000000)
INSERT INTO public.site_settings (id, site_title, site_description)
VALUES (
    '20000000-0000-0000-0000-000000000001',
    'SYNAPSE 2026',
    'The premier destination for 2026 artificial intelligence news, deep learning explainers, autonomous agent architectures, prompt engineering tips, and curated free AI tools.'
)
ON CONFLICT (id) DO UPDATE SET site_title = EXCLUDED.site_title, site_description = EXCLUDED.site_description;

-- Page Content
INSERT INTO public.page_content (page_key, title, banner_text, seo_title, seo_description) VALUES
('about', 'About SYNAPSE', 'Deciphering the Intelligence Revolution for 2026', 'About SYNAPSE | 2026 AI Journalism & Research', 'Learn about our mission to provide deep, verified, reproducible artificial intelligence journalism and open-source tooling.'),
('contact', 'Get in Touch', 'Have an AI story lead, open-source tool submission, or research inquiry? We would love to hear from you.', 'Contact SYNAPSE | 2026 AI Editorial & Submissions', 'Contact the SYNAPSE editorial team for news leads, research questions, and open-source tool showcases.'),
('ai-news', 'AI News', 'Breaking developments, foundation model releases, and industry shifts in artificial intelligence.', 'AI News 2026 | SYNAPSE', 'Real-time coverage of foundation model releases, multimodal benchmarks, and open-source developments.'),
('learn-ai', 'Learn AI', 'Comprehensive beginner-to-advanced guides for mastering modern artificial intelligence.', 'Learn AI 2026 | Roadmaps & Tutorials', 'Step-by-step masterclasses and roadmaps for modern AI engineering.'),
('deep-learning', 'Deep Learning', 'Architecture deep dives, transformer mechanics, and neural networks.', 'Deep Learning 2026 | Neural Teardowns', 'Rigorous mathematical breakdowns, transformer mechanics, and inference acceleration.'),
('free-tools', 'Free AI Tools', 'Handpicked directory of open-source and free AI tools, APIs, and productivity boosters.', 'Free AI Tools Directory 2026', 'Zero-cost local LLM runtimes, web UIs, and developer utilities.'),
('gaming-tech', 'Gaming & Tech', 'How AI is revolutionizing interactive gaming, neural rendering, and hardware.', 'Gaming & Tech AI 2026 | Neural Rendering', 'Neural radiance rendering, procedural worlds, and AI hardware benchmarks.'),
('prompt-engineering', 'Prompt Engineering', 'Tactical patterns, structured output prompting, and metaprompt design strategies.', 'Prompt Engineering 2026 | Structured Output Guide', 'Metaprompt patterns, JSON schema enforcement, and chain-of-thought strategies.')
ON CONFLICT (page_key) DO UPDATE SET title = EXCLUDED.title, banner_text = EXCLUDED.banner_text;

-- Starter Articles (Prefix 30000000)
INSERT INTO public.posts (
    id, title, slug, excerpt, content, cover_image_url, category_id, author_id,
    reading_time, source_name, source_url, tags, published, published_at, view_count, seo_title, seo_description
) VALUES
(
    '30000000-0000-0000-0000-000000000001',
    'The 2026 Autonomous Agent Revolution: Beyond Simple Chatbots',
    'autonomous-agent-revolution-2026',
    'How multi-agent orchestration, self-correcting cognitive loops, and persistent memory engines redefined software engineering in 2026.',
    $body$# The 2026 Autonomous Agent Revolution: Beyond Simple Chatbots

The boundary between conversational assistants and full-cycle autonomous software agents dissolved completely this year. While 2023–2025 focused heavily on single-turn completions and fragile RAG pipelines, 2026 is defined by **multi-agent cognitive architectures** that plan, execute, verify, and self-heal in real time.

---

## 1. The Core Architecture of Modern 2026 Agents

Modern AI agents operate on three foundational pillars:

1. **Persistent Latent Memory**: Long-horizon vector index hierarchies combined with episodic knowledge graphs.
2. **Dynamic Tool Orchestration**: Dynamic reflection loops that inspect compiler errors, test failures, and network states.
3. **Multi-Perspective Consensus**: Spawning sub-agents with specialized roles (Planner, Implementer, Critic, Verifier) before applying state mutations.

```python
import asyncio
from typing import Dict, Any

async def run_agentic_loop(goal: str, max_iterations: int = 5) -> Dict[str, Any]:
    state = {"goal": goal, "iteration": 0, "status": "planning"}
    
    while state["iteration"] < max_iterations:
        state["iteration"] += 1
        plan = await generate_step_plan(state)
        execution_result = await execute_tool_chain(plan.actions)
        
        # Rigorous verification phase
        verification = await verify_deliverable(execution_result)
        if verification.is_valid:
            return {"status": "success", "artifact": execution_result.artifact}
        
        # Self-correction context injection
        state["reflection"] = verification.error_diagnostics
        print(f"[Loop {state['iteration']}] Retrying with updated reflection...")

    raise TimeoutError("Autonomous resolution exceeded max iterations.")
```

> **Key Takeaway for 2026**: High-performing AI workflows do not treat the first generation as final. The magic lies in the *verification loop*.$body$,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    5,
    'arXiv AI Systems Research 2026',
    'https://arxiv.org',
    ARRAY['AI Agents', 'Autonomous Systems', 'LLMs', 'Software Engineering'],
    true,
    now() - INTERVAL '25 minutes',
    0,
    'The 2026 Autonomous Agent Revolution | AI Insights',
    'Explore how multi-agent orchestration and self-healing cognitive loops redefined AI development in 2026.'
),
(
    '30000000-0000-0000-0000-000000000002',
    'How to Learn Deep Learning in 2026: The Complete Roadmap',
    'how-to-learn-deep-learning-2026-roadmap',
    'A curated zero-to-hero curriculum covering mathematics, PyTorch 2.x, Transformer mechanics, and inference acceleration.',
    $body$# How to Learn Deep Learning in 2026: The Complete Roadmap

Whether you are transitioning from traditional software engineering or starting fresh, mastering deep learning today requires a balanced blend of fundamental mathematical intuition and hands-on system engineering.

---

## Stage 1: Mathematical Foundations

Do not spend 6 months reading textbook theorems before writing code. Focus on the core geometric and calculus primitives:

- **Linear Algebra**: Matrix multiplications, tensor broadcasting, eigenvalues, SVD.
- **Multivariate Calculus**: Gradients, Jacobians, chain rule, automatic differentiation.
- **Probability & Information Theory**: Cross-entropy loss, KL divergence, Bayesian reasoning.

---

## Stage 2: Modern PyTorch & Hardware Awareness

In 2026, writing naive loops is not enough. You must understand hardware acceleration:

```python
import torch
import torch.nn as nn

class ModernAttentionBlock(nn.Module):
    def __init__(self, dim: int, num_heads: int):
        super().__init__()
        self.num_heads = num_heads
        self.head_dim = dim // num_heads
        self.qkv = nn.Linear(dim, dim * 3, bias=False)
        self.proj = nn.Linear(dim, dim)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, N, C = x.shape
        qkv = self.qkv(x).reshape(B, N, 3, self.num_heads, self.head_dim).permute(2, 0, 3, 1, 4)
        q, k, v = qkv[0], qkv[1], qkv[2]
        
        # Hardware-accelerated Flash Attention 3 kernel
        out = torch.nn.functional.scaled_dot_product_attention(q, k, v, is_causal=True)
        out = out.transpose(1, 2).reshape(B, N, C)
        return self.proj(out)
```$body$,
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80',
    '00000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    8,
    'DeepLearning.AI 2026 Curriculum',
    'https://deeplearning.ai',
    ARRAY['Deep Learning', 'PyTorch', 'Transformers', 'Roadmap'],
    true,
    now() - INTERVAL '2 hours',
    0,
    'How to Learn Deep Learning in 2026: The Complete Roadmap',
    'A complete zero-to-hero guide to modern deep learning in 2026.'
),
(
    '30000000-0000-0000-0000-000000000003',
    'Top 10 Free and Open-Source AI Tools You Should Use in 2026',
    'top-10-free-open-source-ai-tools-2026',
    'Supercharge your engineering workflow with zero-cost local LLM runners, vector search engines, and prompt visualizers.',
    $body$# Top 10 Free and Open-Source AI Tools You Should Use in 2026

Building production-grade AI systems does not require thousands of dollars in monthly SaaS subscriptions. In 2026, the open-source ecosystem provides world-class local inference engines, vector databases, and evaluation frameworks that rival proprietary alternatives.

---

## 1. Ollama 2.0 (Local Model Orchestration)
Runs state-of-the-art quantized 4-bit and 8-bit weights directly on Apple Silicon or NVIDIA GPUs with zero configuration.

## 2. vLLM (High-Throughput PagedAttention Server)
Delivers 10x-20x higher token throughput compared to naive Hugging Face pipelines via continuous batching.

## 3. Qdrant & Chroma (Open-Source Vector Stores)
Optimized vector indexing for sub-millisecond similarity search across millions of embedding vectors.$body$,
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    '00000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000002',
    6,
    'Open Source AI Index 2026',
    'https://github.com',
    ARRAY['Free Tools', 'Open Source', 'Local LLMs', 'Productivity'],
    true,
    now() - INTERVAL '6 hours',
    0,
    'Top 10 Free & Open-Source AI Tools in 2026',
    'Essential free AI tools for developers in 2026.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content;
