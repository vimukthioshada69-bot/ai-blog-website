import { NextRequest, NextResponse } from 'next/server';
import { refreshNews } from '@/lib/news/feed';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }
  try {
    const result = await refreshNews();
    return NextResponse.json({ok: true, ...result}, {headers: {'Cache-Control': 'no-store'}});
  } catch (error) {
    console.error('News refresh failed', error);
    return NextResponse.json({error: 'News refresh failed'}, {status: 500});
  }
}
