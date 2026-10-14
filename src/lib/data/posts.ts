import { createClient, createPublicClient, isSupabaseConfigured } from '../supabase/server';
import { Author, Category, PageContent, Post, PostWithCategory, SiteSettings } from '../supabase/types';
import { FALLBACK_AUTHORS, FALLBACK_CATEGORIES, FALLBACK_PAGE_CONTENT, FALLBACK_POSTS, FALLBACK_SETTINGS } from './fallback-data';

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_SETTINGS;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return FALLBACK_SETTINGS;
    }
    return data as SiteSettings;
  } catch {
    return FALLBACK_SETTINGS;
  }
}

export async function getAuthors(): Promise<Author[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_AUTHORS;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_AUTHORS;
    }
    return data as Author[];
  } catch {
    return FALLBACK_AUTHORS;
  }
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const authors = await getAuthors();
  return authors.find((a) => a.slug === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_CATEGORIES;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CATEGORIES;
    }
    return data as Category[];
  } catch (err) {
    console.error('Error fetching categories from Supabase:', err);
    return FALLBACK_CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function getPublishedPosts(options?: {
  categorySlug?: string;
  tag?: string;
  authorSlug?: string;
  searchQuery?: string;
  sortBy?: 'latest' | 'views' | 'relevance';
  limit?: number;
}): Promise<PostWithCategory[]> {
  const { categorySlug, tag, authorSlug, searchQuery, sortBy = 'latest', limit } = options || {};

  if (!isSupabaseConfigured()) {
    let posts = [...FALLBACK_POSTS].filter((p) => p.published);

    // Filter out future scheduled posts
    const now = new Date().toISOString();
    posts = posts.filter((p) => !p.scheduled_for || p.scheduled_for <= now);

    if (categorySlug) {
      posts = posts.filter((p) => p.category?.slug === categorySlug);
    }

    if (authorSlug) {
      posts = posts.filter((p) => p.author?.slug === authorSlug);
    }

    if (tag) {
      posts = posts.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'views') {
      posts.sort((a, b) => b.view_count - a.view_count);
    } else {
      posts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }

    if (limit && limit > 0) {
      posts = posts.slice(0, limit);
    }

    return posts;
  }

  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*)
      `)
      .eq('published', true);

    if (sortBy === 'views') {
      query = query.order('view_count', { ascending: false });
    } else {
      query = query.order('published_at', { ascending: false });
    }

    if (categorySlug) {
      const category = await getCategoryBySlug(categorySlug);
      if (category) {
        query = query.eq('category_id', category.id);
      }
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return FALLBACK_POSTS.filter((p) => p.published);
    }

    let results = data as PostWithCategory[];

    if (authorSlug) {
      results = results.filter((p) => p.author?.slug === authorSlug);
    }

    if (tag) {
      results = results.filter((p) =>
        p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }

    return results;
  } catch (err) {
    console.error('Error fetching published posts from Supabase:', err);
    return FALLBACK_POSTS.filter((p) => p.published);
  }
}

export async function getTrendingPosts(limit = 5): Promise<PostWithCategory[]> {
  return getPublishedPosts({ sortBy: 'views', limit });
}

export async function getCategoryPreviewPosts(categorySlug: string, limit = 4): Promise<PostWithCategory[]> {
  return getPublishedPosts({ categorySlug, limit });
}

export async function getPostBySlug(slug: string): Promise<PostWithCategory | null> {
  if (!isSupabaseConfigured()) {
    const post = FALLBACK_POSTS.find((p) => p.slug === slug);
    return post || null;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*)
      `)
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return FALLBACK_POSTS.find((p) => p.slug === slug) || null;
    }

    return data as PostWithCategory;
  } catch (err) {
    console.error('Error fetching post by slug:', err);
    return FALLBACK_POSTS.find((p) => p.slug === slug) || null;
  }
}

export async function getRelatedPosts(
  postId: string,
  categoryId: string | null,
  limit = 3
): Promise<PostWithCategory[]> {
  const allPosts = await getPublishedPosts();
  return allPosts
    .filter((p) => p.id !== postId && (categoryId ? p.category_id === categoryId : true))
    .slice(0, limit);
}

export async function getAllPostSlugs(): Promise<{ slug: string; categorySlug: string }[]> {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({
    slug: p.slug,
    categorySlug: p.category?.slug || 'general',
  }));
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPublishedPosts();
  const tagCountMap: Record<string, number> = {};

  posts.forEach((p) => {
    p.tags?.forEach((t) => {
      tagCountMap[t] = (tagCountMap[t] || 0) + 1;
    });
  });

  return Object.entries(tagCountMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getAllPostsForAdmin(): Promise<PostWithCategory[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_POSTS;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return FALLBACK_POSTS;
    }

    return data as PostWithCategory[];
  } catch (err) {
    console.error('Error fetching admin posts:', err);
    return FALLBACK_POSTS;
  }
}

export async function getPostById(id: string): Promise<PostWithCategory | null> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_POSTS.find((p) => p.id === id) || null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return FALLBACK_POSTS.find((p) => p.id === id) || null;
    }

    return data as PostWithCategory;
  } catch (err) {
    console.error('Error fetching post by id:', err);
    return FALLBACK_POSTS.find((p) => p.id === id) || null;
  }
}

export async function getPageContent(pageKey: string): Promise<PageContent | null> {
  const fallback = FALLBACK_PAGE_CONTENT[pageKey] || null;

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_key', pageKey)
      .single();

    if (error || !data) {
      return fallback;
    }

    return data as PageContent;
  } catch {
    return fallback;
  }
}

export async function getAllStaticPages(): Promise<PageContent[]> {
  const fallbackList = Object.values(FALLBACK_PAGE_CONTENT);

  if (!isSupabaseConfigured()) {
    return fallbackList;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .order('page_key', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackList;
    }

    return data as PageContent[];
  } catch {
    return fallbackList;
  }
}

