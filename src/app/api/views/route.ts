import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient, createPublicClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, reason: 'no-supabase' }, { status: 200 });
  }

  try {
    const body = await req.json();
    const postId: string | undefined = body?.post_id;

    if (!postId || typeof postId !== 'string') {
      return NextResponse.json({ ok: false, reason: 'missing-post-id' }, { status: 400 });
    }

    // --- 1. Skip if admin is authenticated ---
    try {
      const supabaseAuth = await createClient();
      const { data: { user } } = await supabaseAuth.auth.getUser();
      if (user) {
        // Admin is logged in — don't count this view
        return NextResponse.json({ ok: false, reason: 'admin-skip' }, { status: 200 });
      }
    } catch {
      // If auth check fails, continue — public visitor
    }

    // --- 2. Build visitor fingerprint (server-side only, never exposed) ---
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const ua = req.headers.get('user-agent') || 'unknown';

    const fingerprint = createHash('sha256')
      .update(`${ip}::${ua}::${postId}`)
      .digest('hex');

    // --- 3. Dedup check: has this fingerprint viewed this post in last 24h? ---
    const supabase = createPublicClient();
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: existing, error: selectError } = await (supabase as any)
      .from('post_views')
      .select('id')
      .eq('post_id', postId)
      .eq('visitor_hash', fingerprint)
      .gte('created_at', cutoff)
      .limit(1)
      .maybeSingle();

    if (selectError) {
      console.error('[views] dedup select error:', selectError.message);
      return NextResponse.json({ ok: false, reason: 'db-error' }, { status: 200 });
    }

    if (existing) {
      // Already counted within 24h
      return NextResponse.json({ ok: true, reason: 'already-counted' }, { status: 200 });
    }

    // --- 4. Insert view log row ---
    const { error: insertError } = await (supabase as any)
      .from('post_views')
      .insert({ post_id: postId, visitor_hash: fingerprint });

    if (insertError) {
      console.error('[views] insert error:', insertError.message);
      return NextResponse.json({ ok: false, reason: 'insert-error' }, { status: 200 });
    }

    // --- 5. Atomically increment view_count ---
    const { error: rpcError } = await (supabase as any).rpc('increment_post_view', {
      p_post_id: postId,
    });

    if (rpcError) {
      console.error('[views] rpc error:', rpcError.message);
      // Non-fatal: view was logged, increment just failed
    }

    return NextResponse.json({ ok: true, reason: 'counted' }, { status: 200 });
  } catch (err: any) {
    console.error('[views] unexpected error:', err.message);
    return NextResponse.json({ ok: false, reason: 'server-error' }, { status: 200 });
  }
}
