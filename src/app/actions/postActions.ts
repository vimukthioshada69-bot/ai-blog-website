'use server';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { 
  PostFormSchema, 
  AuthorFormSchema, 
  CategoryFormSchema, 
  SiteSettingsFormSchema 
} from '@/lib/security/validation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ActionResponse {
  success?: boolean;
  error?: string;
  data?: any;
}

export async function createPost(formData: FormData): Promise<ActionResponse> {
  const rawTags = (formData.get('tags') as string) || '';
  const parsedTags = rawTags
    ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const rawReadingTime = formData.get('reading_time');
  const readingTime = rawReadingTime ? parseInt(rawReadingTime as string, 10) : 1;

  const rawData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    cover_image_url: (formData.get('cover_image_url') as string) || '',
    category_id: (formData.get('category_id') as string) || '',
    author_id: (formData.get('author_id') as string) || '',
    reading_time: isNaN(readingTime) ? 1 : readingTime,
    source_name: (formData.get('source_name') as string) || '',
    source_url: (formData.get('source_url') as string) || '',
    scheduled_for: (formData.get('scheduled_for') as string) || '',
    tags: parsedTags,
    published: formData.get('published') === 'true',
    seo_title: (formData.get('seo_title') as string) || '',
    seo_description: (formData.get('seo_description') as string) || '',
  };

  const validation = PostFormSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      error: 'Supabase is not configured. Please add your credentials to .env.local to save posts to database.',
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && process.env.NODE_ENV === 'production') {
      return { error: 'Unauthorized. You must be logged in as an admin.' };
    }

    const { error } = await (supabase.from('posts') as any).insert({
      title: validation.data.title,
      slug: validation.data.slug,
      excerpt: validation.data.excerpt,
      content: validation.data.content,
      cover_image_url: validation.data.cover_image_url || null,
      category_id: validation.data.category_id || null,
      author_id: validation.data.author_id || null,
      reading_time: validation.data.reading_time || 1,
      source_name: validation.data.source_name || null,
      source_url: validation.data.source_url || null,
      scheduled_for: validation.data.scheduled_for ? new Date(validation.data.scheduled_for).toISOString() : null,
      tags: validation.data.tags,
      published: validation.data.published,
      published_at: validation.data.published ? new Date().toISOString() : new Date().toISOString(),
      seo_title: validation.data.seo_title || null,
      seo_description: validation.data.seo_description || null,
    });

    if (error) {
      if (error.code === '23505') {
        return { error: 'A post with this slug already exists. Please choose a unique slug.' };
      }
      return { error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin');
    revalidatePath('/admin/articles');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to create post.' };
  }
}

export async function updatePost(id: string, formData: FormData): Promise<ActionResponse> {
  const rawTags = (formData.get('tags') as string) || '';
  const parsedTags = rawTags
    ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const rawReadingTime = formData.get('reading_time');
  const readingTime = rawReadingTime ? parseInt(rawReadingTime as string, 10) : 1;

  const rawData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    cover_image_url: (formData.get('cover_image_url') as string) || '',
    category_id: (formData.get('category_id') as string) || '',
    author_id: (formData.get('author_id') as string) || '',
    reading_time: isNaN(readingTime) ? 1 : readingTime,
    source_name: (formData.get('source_name') as string) || '',
    source_url: (formData.get('source_url') as string) || '',
    scheduled_for: (formData.get('scheduled_for') as string) || '',
    tags: parsedTags,
    published: formData.get('published') === 'true',
    seo_title: (formData.get('seo_title') as string) || '',
    seo_description: (formData.get('seo_description') as string) || '',
  };

  const validation = PostFormSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      error: 'Supabase is not configured. Please add your credentials to .env.local.',
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && process.env.NODE_ENV === 'production') {
      return { error: 'Unauthorized. You must be logged in as an admin.' };
    }

    const { error } = await (supabase.from('posts') as any)
      .update({
        title: validation.data.title,
        slug: validation.data.slug,
        excerpt: validation.data.excerpt,
        content: validation.data.content,
        cover_image_url: validation.data.cover_image_url || null,
        category_id: validation.data.category_id || null,
        author_id: validation.data.author_id || null,
        reading_time: validation.data.reading_time || 1,
        source_name: validation.data.source_name || null,
        source_url: validation.data.source_url || null,
        scheduled_for: validation.data.scheduled_for ? new Date(validation.data.scheduled_for).toISOString() : null,
        tags: validation.data.tags,
        published: validation.data.published,
        seo_title: validation.data.seo_title || null,
        seo_description: validation.data.seo_description || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      if (error.code === '23505') {
        return { error: 'A post with this slug already exists. Please choose a unique slug.' };
      }
      return { error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin');
    revalidatePath('/admin/articles');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to update post.' };
  }
}

export async function deletePost(id: string): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase not configured.' };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && process.env.NODE_ENV === 'production') {
      return { error: 'Unauthorized — admin login required.' };
    }

    // Fetch the post first so we can clean up its cover image
    const { data: post, error: fetchError } = await (supabase.from('posts') as any)
      .select('id, cover_image_url')
      .eq('id', id)
      .single();

    if (fetchError || !post) {
      return { error: fetchError?.message || 'Post not found.' };
    }

    // Delete the post row (post_views rows cascade automatically)
    const { error: deleteError } = await supabase.from('posts').delete().eq('id', id);
    if (deleteError) {
      return { error: deleteError.message };
    }

    // Clean up Supabase Storage cover image if it's ours and not shared
    const coverUrl: string = post.cover_image_url || '';
    if (coverUrl.includes('/blog-images/')) {
      // Extract storage path (everything after "/blog-images/")
      const pathMatch = coverUrl.match(/\/blog-images\/(.+)$/);
      if (pathMatch) {
        const filePath = pathMatch[1];
        // Check if any other post still uses this URL
        const { count } = await (supabase.from('posts') as any)
          .select('id', { count: 'exact', head: true })
          .eq('cover_image_url', coverUrl);
        if (!count || count === 0) {
          // Safe to delete from storage
          await supabase.storage.from('blog-images').remove([filePath]);
        }
      }
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin');
    revalidatePath('/admin/articles');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete post' };
  }
}

export async function togglePublishPost(id: string, currentPublished: boolean): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase not configured.' };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && process.env.NODE_ENV === 'production') {
      return { error: 'Unauthorized' };
    }

    const { error } = await (supabase.from('posts') as any)
      .update({
        published: !currentPublished,
        published_at: !currentPublished ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin');
    revalidatePath('/admin/articles');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function incrementPostView(slug: string) {
  if (!isSupabaseConfigured()) {
    return;
  }

  try {
    const supabase = await createClient();
    await (supabase as any).rpc('increment_view_count', { post_slug: slug });
  } catch (err) {
    console.error('Error incrementing post view count:', err);
  }
}

export async function uploadCoverImage(formData: FormData): Promise<ActionResponse> {
  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided' };
  }

  if (!file.type.startsWith('image/')) {
    return { error: 'Only image files (JPEG, PNG, WebP, AVIF) are allowed' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: 'Image size exceeds maximum limit of 5MB' };
  }

  if (!isSupabaseConfigured()) {
    return { error: 'Supabase not configured for image uploads.' };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && process.env.NODE_ENV === 'production') {
      return { error: 'Unauthorized. Admin login required.' };
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('blog-images').getPublicUrl(filePath);

    return {
      success: true,
      data: { publicUrl },
    };
  } catch (err: any) {
    return { error: err.message || 'Image upload failed' };
  }
}

// ----------------- Authors Management -----------------
export async function createAuthor(formData: FormData): Promise<ActionResponse> {
  const rawData = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    avatar_url: (formData.get('avatar_url') as string) || '',
    bio: (formData.get('bio') as string) || '',
    twitter: (formData.get('twitter') as string) || '',
    github: (formData.get('github') as string) || '',
    linkedin: (formData.get('linkedin') as string) || '',
    website: (formData.get('website') as string) || '',
  };

  const validation = AuthorFormSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  if (!isSupabaseConfigured()) {
    return { error: 'Supabase not configured.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && process.env.NODE_ENV === 'production') return { error: 'Unauthorized' };

    const { error } = await (supabase.from('authors') as any).insert({
      name: validation.data.name,
      slug: validation.data.slug,
      avatar_url: validation.data.avatar_url || null,
      bio: validation.data.bio || null,
      social_links: {
        twitter: validation.data.twitter || '',
        github: validation.data.github || '',
        linkedin: validation.data.linkedin || '',
        website: validation.data.website || '',
      },
    });

    if (error) return { error: error.message };

    revalidatePath('/admin/authors');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteAuthor(id: string): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured.' };

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && process.env.NODE_ENV === 'production') return { error: 'Unauthorized' };

    const { error } = await supabase.from('authors').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/admin/authors');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

// ----------------- Categories Management -----------------
export async function createCategory(formData: FormData): Promise<ActionResponse> {
  const rawData = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: (formData.get('description') as string) || '',
  };

  const validation = CategoryFormSchema.safeParse(rawData);
  if (!validation.success) return { error: validation.error.issues[0].message };

  if (!isSupabaseConfigured()) return { error: 'Supabase not configured.' };

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && process.env.NODE_ENV === 'production') return { error: 'Unauthorized' };

    const { error } = await (supabase.from('categories') as any).insert({
      name: validation.data.name,
      slug: validation.data.slug,
      description: validation.data.description || null,
    });

    if (error) return { error: error.message };

    revalidatePath('/admin/categories');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteCategory(id: string): Promise<ActionResponse> {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured.' };

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

// ----------------- Site Settings Management -----------------
export async function updateSiteSettings(formData: FormData): Promise<ActionResponse> {
  const rawData = {
    site_title: formData.get('site_title') as string,
    site_description: formData.get('site_description') as string,
    twitter: (formData.get('twitter') as string) || '',
    github: (formData.get('github') as string) || '',
    linkedin: (formData.get('linkedin') as string) || '',
    youtube: (formData.get('youtube') as string) || '',
  };

  const validation = SiteSettingsFormSchema.safeParse(rawData);
  if (!validation.success) return { error: validation.error.issues[0].message };

  if (!isSupabaseConfigured()) {
    return { success: true, data: { message: 'Settings saved (Local memory mode).' } };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await (supabase.from('site_settings') as any).upsert({
      id: 's0000000-0000-0000-0000-000000000001',
      site_title: validation.data.site_title,
      site_description: validation.data.site_description,
      social_links: {
        twitter: validation.data.twitter || '',
        github: validation.data.github || '',
        linkedin: validation.data.linkedin || '',
        youtube: validation.data.youtube || '',
      },
      updated_at: new Date().toISOString(),
    });

    if (error) return { error: error.message };

    revalidatePath('/admin/settings');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
