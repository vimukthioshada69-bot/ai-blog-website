import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Zap, 
  GraduationCap, 
  Cpu, 
  Compass, 
  Gamepad2, 
  Terminal, 
  Sparkles, 
  ArrowLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { getCategories, getCategoryBySlug, getPublishedPosts, getPageContent } from '@/lib/data/posts';
import { PostCard } from '@/components/post/PostCard';
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 60;

const categoryIcons: Record<string, any> = {
  'ai-news': Zap,
  'learn-ai': GraduationCap,
  'deep-learning': Cpu,
  'free-tools': Compass,
  'gaming-tech': Gamepad2,
  'prompt-engineering': Terminal,
};

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ tag?: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const [category, pageContent] = await Promise.all([
    getCategoryBySlug(slug),
    getPageContent(slug),
  ]);

  if (!category) {
    return {
      title: 'Category Not Found | SYNAPSE 2026',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://synapse-ai-2026.vercel.app';
  const canonicalUrl = `${baseUrl}/${category.slug}`;
  const title = pageContent?.seo_title || `${category.name} | 2026 AI Intelligence`;
  const description =
    pageContent?.seo_description ||
    category.description ||
    `Explore top articles, tutorials, and analysis in ${category.name} for 2026.`;
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
          alt: category.name,
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

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: slug } = await params;
  const { tag } = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const posts = await getPublishedPosts({
    categorySlug: slug,
    tag,
  });

  const Icon = categoryIcons[category.slug] || Sparkles;

  // Extract unique tags in this category for filtering
  const allCategoryPosts = await getPublishedPosts({ categorySlug: slug });
  const allTags = Array.from(
    new Set(allCategoryPosts.flatMap((p) => p.tags || []))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Schema.org BreadcrumbList Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: category.name, url: `/${category.slug}` },
        ]}
      />

      {/* Schema.org CollectionPage for AI answer engines */}
      <CollectionPageJsonLd
        title={category.name}
        description={category.description || `Explore top articles and tutorials in ${category.name}.`}
        url={`/${category.slug}`}
        posts={posts}
      />
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-slate-700 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-500">Categories</span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-indigo-600 font-bold">{category.name}</span>
      </nav>

      {/* Category Header Banner with Cyber Grid & Glow */}
      <div className="relative bg-ai-grid glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(99,102,241,0.06)] overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="ai-glow-blob top-0 right-0 w-80 h-80 bg-indigo-300/30 blur-3xl opacity-60" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.35)]">
            <Icon className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                TOPIC ARCHIVE
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="relative z-10 pt-6 mt-6 border-t border-slate-200/60 flex items-center flex-wrap gap-2">
            <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5" />
              Filter by tag:
            </span>
            <Link
              href={`/${category.slug}`}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                !tag
                  ? 'btn-ai-gradient font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All
            </Link>
            {allTags.map((t) => {
              const isSelected = tag?.toLowerCase() === t.toLowerCase();
              return (
                <Link
                  key={t}
                  href={`/${category.slug}?tag=${encodeURIComponent(t)}`}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                    isSelected
                      ? 'btn-ai-gradient font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  #{t}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-slate-200 space-y-3">
          <Sparkles className="w-10 h-10 text-indigo-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-heading">No articles in this topic yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {tag
              ? `No articles found matching tag "#${tag}". Try selecting "All" or browse other categories.`
              : 'Our editorial team is preparing in-depth guides for this topic.'}
          </p>
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
