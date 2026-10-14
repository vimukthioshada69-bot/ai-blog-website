import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Tag as TagIcon, Sparkles } from 'lucide-react';
import { getPublishedPosts, getAllTags } from '@/lib/data/posts';
import { PostCard } from '@/components/post/PostCard';
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedTag = decodeURIComponent(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://synapse-ai-2026.vercel.app';
  const canonicalUrl = `${baseUrl}/tag/${encodeURIComponent(slug.toLowerCase())}`;
  const title = `#${decodedTag} | 2026 AI Topic Tag`;
  const description = `Articles, roadmaps, and technical tutorials tagged with #${decodedTag} on SYNAPSE 2026.`;
  const ogImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'SYNAPSE 2026',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `#${decodedTag}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function TagArchivePage({ params }: TagPageProps) {
  const { slug } = await params;
  const decodedTag = decodeURIComponent(slug);

  const [posts, allTags] = await Promise.all([
    getPublishedPosts({ tag: decodedTag }),
    getAllTags(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Schema.org BreadcrumbList Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tags', url: '/search' },
          { name: `#${decodedTag}`, url: `/tag/${encodeURIComponent(slug.toLowerCase())}` },
        ]}
      />

      {/* Schema.org CollectionPage for AI answer engines */}
      <CollectionPageJsonLd
        title={`#${decodedTag} — AI Topic Tag`}
        description={`Articles, roadmaps, and technical tutorials tagged with #${decodedTag} on SYNAPSE 2026.`}
        url={`/tag/${encodeURIComponent(slug.toLowerCase())}`}
        posts={posts}
      />
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-slate-700 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-500">Tags</span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-indigo-600 font-bold">#{decodedTag}</span>
      </nav>

      {/* Tag Header Banner */}
      <div className="relative bg-ai-grid glass-panel rounded-3xl p-6 sm:p-10 border border-indigo-100/90 shadow-[0_4px_24px_-4px_rgba(99,102,241,0.06)] overflow-hidden">
        <div className="ai-glow-blob top-0 right-0 w-80 h-80 bg-indigo-300/30 blur-3xl opacity-60" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.35)]">
            <TagIcon className="w-8 h-8" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                TAG ARCHIVE
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
              #{decodedTag}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Curated collection of AI research, implementation roadmaps, and tools under the #{decodedTag} tag.
            </p>
          </div>
        </div>

        {/* Related Tags Pill Bar */}
        {allTags.length > 1 && (
          <div className="relative z-10 pt-6 mt-6 border-t border-slate-200/60 flex items-center flex-wrap gap-2">
            <span className="text-xs font-mono font-semibold text-slate-400 mr-2">
              Popular Tags:
            </span>
            {allTags.slice(0, 8).map(({ tag, count }) => {
              const isSelected = tag.toLowerCase() === decodedTag.toLowerCase();
              return (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                    isSelected
                      ? 'btn-ai-gradient font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  #{tag} ({count})
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Tag Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-slate-200 space-y-3">
          <Sparkles className="w-10 h-10 text-indigo-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-heading">No articles with tag #{decodedTag}</h3>
          <p className="text-sm text-slate-500">Explore other topics from our main archive.</p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
