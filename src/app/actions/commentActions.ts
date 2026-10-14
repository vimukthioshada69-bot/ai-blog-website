'use server';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { CommentFormSchema, ModerateCommentSchema } from '@/lib/security/validation';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { revalidatePath } from 'next/cache';
import { CommentStatus } from '@/lib/supabase/types';

export interface CommentActionResponse {
  success?: boolean;
  message?: string;
  error?: string;
  comment?: any;
}

export async function createComment(
  prevState: CommentActionResponse | null,
  formData: FormData
): Promise<CommentActionResponse> {
  const post_id = (formData.get('post_id') as string) || '';
  const author_name = (formData.get('author_name') as string) || '';
  const author_email = (formData.get('author_email') as string) || '';
  const content = (formData.get('content') as string) || '';
  const parent_id = (formData.get('parent_id') as string) || '';
  const honeypot = (formData.get('honeypot') as string) || '';

  // 1. Anti-spam honeypot detection
  if (honeypot && honeypot.length > 0) {
    return { error: 'Automated spam submission detected.' };
  }

  // 2. Rate limiting (max 5 comments per 10 minutes per identifier)
  const rateLimitKey = `comment:${author_email || author_name.toLowerCase().replace(/\s+/g, '')}`;
  const rateLimit = checkRateLimit(rateLimitKey, 5, 10 * 60 * 1000);
  if (!rateLimit.success) {
    return {
      error: 'You have submitted multiple comments recently. Please pause for a moment before posting again.',
    };
  }

  // 3. Zod validation
  const validation = CommentFormSchema.safeParse({
    post_id,
    author_name,
    author_email: author_email || undefined,
    content,
    parent_id: parent_id || undefined,
    honeypot,
  });

  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || 'Invalid comment data.',
    };
  }

  // 4. Persistence
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: 'Your comment has been posted! (Demo mode: Connect Supabase in .env.local to persist permanently).',
    };
  }

  try {
    const supabase = await createClient();

    const insertData: any = {
      post_id: validation.data.post_id,
      author_name: validation.data.author_name,
      content: validation.data.content,
      status: 'approved', // Live immediately for active discussion
      is_pinned: false,
    };

    if (validation.data.author_email) {
      insertData.author_email = validation.data.author_email;
    }

    if (validation.data.parent_id) {
      insertData.parent_id = validation.data.parent_id;
    }

    const { data, error } = await (supabase.from('comments') as any)
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { error: `Database error: ${error.message}` };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/comments');

    return {
      success: true,
      message: 'Your comment has been published to the discussion.',
      comment: data,
    };
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred while posting your comment.' };
  }
}

export async function moderateComment(
  commentId: string,
  newStatus: CommentStatus
): Promise<CommentActionResponse> {
  const validation = ModerateCommentSchema.safeParse({
    id: commentId,
    status: newStatus,
  });

  if (!validation.success) {
    return { error: 'Invalid moderation parameters.' };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: `Comment status updated to "${newStatus}" (Demo mode).`,
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && process.env.NODE_ENV === 'production') {
      return { error: 'Unauthorized. Admin credentials required.' };
    }

    const { error } = await (supabase.from('comments') as any)
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', commentId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/comments');

    return {
      success: true,
      message: `Comment status successfully set to ${newStatus}.`,
    };
  } catch (err: any) {
    return { error: err.message || 'Failed to update comment status.' };
  }
}

export async function deleteComment(commentId: string): Promise<CommentActionResponse> {
  if (!commentId) {
    return { error: 'Comment ID is required.' };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: 'Comment deleted successfully (Demo mode).',
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && process.env.NODE_ENV === 'production') {
      return { error: 'Unauthorized. Admin credentials required.' };
    }

    const { error } = await (supabase.from('comments') as any)
      .delete()
      .eq('id', commentId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/comments');

    return {
      success: true,
      message: 'Comment removed from publication.',
    };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete comment.' };
  }
}

export async function togglePinComment(
  commentId: string,
  isPinned: boolean
): Promise<CommentActionResponse> {
  if (!commentId) {
    return { error: 'Comment ID is required.' };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: `Comment ${isPinned ? 'pinned' : 'unpinned'} (Demo mode).`,
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && process.env.NODE_ENV === 'production') {
      return { error: 'Unauthorized. Admin credentials required.' };
    }

    const { error } = await (supabase.from('comments') as any)
      .update({ is_pinned: isPinned, updated_at: new Date().toISOString() })
      .eq('id', commentId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/comments');

    return {
      success: true,
      message: isPinned ? 'Comment pinned to the top.' : 'Comment unpinned.',
    };
  } catch (err: any) {
    return { error: err.message || 'Failed to toggle pin state.' };
  }
}
