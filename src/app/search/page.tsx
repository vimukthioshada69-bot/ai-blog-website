import { Metadata } from 'next';
import { Search, Sparkles, Filter, ArrowUpDown } from 'lucide-react';
import { getPublishedPosts, getCategories } from '@/lib/data/posts';
import { PostCard } from '@/components/post/PostCard';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://synapse-ai-2026.vercel.app';
  const canonicalUrl = `${baseUrl}/search`;
  const title = q ? `Search results for "${q}" | SYNAPSE 2026` : 'Search AI Articles & Guides | SYNAPSE 2026';
  const description = 'Search across 2026 AI news, deep learning explainers, free tools directory, and prompt engineering tactics.';

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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, category, sort } = await searchParams;
  const query = q || '';
  const sortBy = (sort as 'latest' | 'views' | 'relevance') || 'latest';

  const [allPosts, categories] = await Promise.all([
    getPublishedPosts({
      searchQuery: query,
      categorySlug: category,
      sortBy: sortBy,
    }),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Schema.org BreadcrumbList Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Search', url: '/search' },
        ]}
      />
      
      {/* Header Banner */}
      <div className="relative bg-ai-grid glass-panel rounded-3xl p-8 sm:p-12 border border-indigo-100/90 shadow-[0_4px_24px_-4px_rgba(99,102,241,0.06)] overflow-hidden text-center">
        <div className="ai-glow-blob top-0 right-0 w-80 h-80 bg-indigo-300/30 blur-3xl opacity-60" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-ai-gradient text-xs font-mono font-bold">
            <Search className="w-3.5 h-3.5" />
            <span>SYNAPSE FULL-TEXT INDEX</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            Explore the 2026 AI Archive
          </h1>
          <p className="text-sm text-slate-600">
            Search foundation models, multi-agent frameworks, local LLM tooling, and deep learning roadmaps.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative z-10 max-w-2xl mx-auto mt-6">
          <form method="GET" action="/search" className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search: 'agents', 'pytorch', 'free tools', 'prompts'..."
              className="w-full pl-12 pr-32 py-3.5 bg-white rounded-2xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs font-mono text-xs"
            />
            {category && <input type="hidden" name="category" value={category} />}
            {sort && <input type="hidden" name="sort" value={sort} />}
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 btn-ai-gradient rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Search
            </button>
          </form>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center mt-4 text-xs font-mono">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" />
              Category:
            </span>
            <Link
              href={`/search${query ? `?q=${encodeURIComponent(query)}` : ''}${sort ? `&sort=${sort}` : ''}`}
              className={`px-3 py-1 rounded-full transition-all ${
                !category
                  ? 'btn-ai-gradient font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All
            </Link>
            {categories.map((cat) => {
              const isSelected = category === cat.slug;
              const href = `/search?category=${cat.slug}${query ? `&q=${encodeURIComponent(query)}` : ''}${sort ? `&sort=${sort}` : ''}`;
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={`px-3 py-1 rounded-full transition-all ${
                    isSelected
                      ? 'btn-ai-gradient font-bold shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Sort Chips */}
          <div className="flex items-center gap-1.5 justify-center mt-3 text-xs font-mono">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <ArrowUpDown className="w-3 h-3" />
              Sort:
            </span>
            <Link
              href={`/search?sort=latest${query ? `&q=${encodeURIComponent(query)}` : ''}${category ? `&category=${category}` : ''}`}
              className={`px-2.5 py-0.5 rounded-md transition-all ${
                sortBy === 'latest'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Latest Date
            </Link>
            <Link
              href={`/search?sort=views${query ? `&q=${encodeURIComponent(query)}` : ''}${category ? `&category=${category}` : ''}`}
              className={`px-2.5 py-0.5 rounded-md transition-all ${
                sortBy === 'views'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Most Viewed
            </Link>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pt-2 border-b border-slate-200/80 pb-3">
        <p className="text-xs sm:text-sm font-mono text-slate-500">
          Showing <span className="font-bold text-slate-900">{allPosts.length}</span> {allPosts.length === 1 ? 'article' : 'articles'}
          {query && <span> for &ldquo;<span className="text-indigo-600 font-bold">{query}</span>&rdquo;</span>}
          {category && <span> in <span className="text-indigo-600 font-bold">{category}</span></span>}
        </p>
      </div>

      {/* Results Grid */}
      {allPosts.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-slate-200 space-y-3">
          <Sparkles className="w-10 h-10 text-indigo-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-heading">No matching articles found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try checking for typos or searching for broader terms like &ldquo;agents&rdquo;, &ldquo;pytorch&rdquo;, or &ldquo;tools&rdquo;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {allPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
