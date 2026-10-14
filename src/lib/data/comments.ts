import { createClient, createPublicClient, isSupabaseConfigured } from '../supabase/server';
import { Comment, CommentWithPost } from '../supabase/types';
import { FALLBACK_COMMENTS } from './fallback-data';

export async function getApprovedCommentsByPostId(postId: string): Promise<Comment[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_COMMENTS.filter(
      (c) => c.post_id === postId && c.status === 'approved'
    ).sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('comments')
      .select('id, post_id, parent_id, author_name, content, status, is_pinned, created_at, updated_at')
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !data) {
      return FALLBACK_COMMENTS.filter(
        (c) => c.post_id === postId && c.status === 'approved'
      );
    }

    return data as Comment[];
  } catch {
    return FALLBACK_COMMENTS.filter(
      (c) => c.post_id === postId && c.status === 'approved'
    );
  }
}

export async function getAllCommentsForAdmin(
  statusFilter?: string
): Promise<CommentWithPost[]> {
  if (!isSupabaseConfigured()) {
    let results = [...FALLBACK_COMMENTS];
    if (statusFilter && statusFilter !== 'all') {
      results = results.filter((c) => c.status === statusFilter);
    }
    return results.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from('comments')
      .select(`
        id,
        post_id,
        parent_id,
        author_name,
        author_email,
        content,
        status,
        is_pinned,
        created_at,
        updated_at,
        post:posts (
          id,
          title,
          slug,
          category:categories (
            slug
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error || !data) {
      return FALLBACK_COMMENTS;
    }

    return data as unknown as CommentWithPost[];
  } catch {
    return FALLBACK_COMMENTS;
  }
}

export async function getCommentsStats(): Promise<{
  total: number;
  approved: number;
  pending: number;
  spam: number;
}> {
  if (!isSupabaseConfigured()) {
    const total = FALLBACK_COMMENTS.length;
    const approved = FALLBACK_COMMENTS.filter((c) => c.status === 'approved').length;
    const pending = FALLBACK_COMMENTS.filter((c) => c.status === 'pending').length;
    const spam = FALLBACK_COMMENTS.filter((c) => c.status === 'spam' || c.status === 'rejected').length;
    return { total, approved, pending, spam };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('comments').select('status');

    if (error || !data) {
      return { total: 0, approved: 0, pending: 0, spam: 0 };
    }

    const total = data.length;
    const approved = data.filter((c: any) => c.status === 'approved').length;
    const pending = data.filter((c: any) => c.status === 'pending').length;
    const spam = data.filter((c: any) => c.status === 'spam' || c.status === 'rejected').length;

    return { total, approved, pending, spam };
  } catch {
    return { total: 0, approved: 0, pending: 0, spam: 0 };
  }
}
