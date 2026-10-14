import { NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  const siteUrl = getSiteUrl();

  const pluginManifest = {
    schema_version: 'v1',
    name_for_model: 'synapse_ai_blog',
    name_for_human: 'SYNAPSE 2026 AI Intelligence',
    description_for_model:
      'Access verified 2026 artificial intelligence news, deep learning research, model benchmarks, prompt engineering guides, and curated free AI tools from SYNAPSE.',
    description_for_human:
      'Discover verified AI news, technical guides, tutorials, and free AI tools directory.',
    auth: {
      type: 'none',
    },
    api: {
      type: 'openapi',
      url: `${siteUrl}/api/rss`,
    },
    logo_url: `${siteUrl}/favicon.ico`,
    contact_email: 'editorial@synapse-ai.com',
    legal_info_url: `${siteUrl}/privacy`,
  };

  return NextResponse.json(pluginManifest, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
