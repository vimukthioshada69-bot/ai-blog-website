import { NextRequest, NextResponse } from 'next/server';

/**
 * IndexNow API Route
 * 
 * Instantly notifies Bing, Yandex, and other IndexNow-compatible search engines
 * about new or updated content. This dramatically reduces the time it takes
 * for AI answer engines to discover and index new articles.
 * 
 * Usage: POST /api/indexnow
 * Body: { "urls": ["https://example.com/ai-news/my-article"] }
 * 
 * To generate your IndexNow key:
 * 1. Visit https://www.bing.com/indexnow
 * 2. Generate a key
 * 3. Set INDEXNOW_KEY in your .env.local
 * 4. Place a verification file at public/{key}.txt containing just the key
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const urls: string[] = body.urls;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid "urls" array in request body' },
        { status: 400 }
      );
    }

    const indexNowKey = process.env.INDEXNOW_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://synapse-ai-2026.vercel.app';

    if (!indexNowKey) {
      return NextResponse.json(
        { error: 'INDEXNOW_KEY not configured. Set it in .env.local' },
        { status: 500 }
      );
    }

    // Submit to IndexNow API (Bing, Yandex, Seznam, Naver)
    const indexNowResponse = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: new URL(siteUrl).hostname,
        key: indexNowKey,
        keyLocation: `${siteUrl}/${indexNowKey}.txt`,
        urlList: urls,
      }),
    });

    if (indexNowResponse.ok || indexNowResponse.status === 202) {
      return NextResponse.json({
        success: true,
        message: `Successfully submitted ${urls.length} URL(s) to IndexNow`,
        urls,
      });
    }

    const errorText = await indexNowResponse.text();
    return NextResponse.json(
      {
        error: 'IndexNow API returned an error',
        status: indexNowResponse.status,
        details: errorText,
      },
      { status: indexNowResponse.status }
    );
  } catch (error) {
    console.error('IndexNow submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error during IndexNow submission' },
      { status: 500 }
    );
  }
}
