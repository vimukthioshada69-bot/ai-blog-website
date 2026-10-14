import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ChevronRight, 
  Sparkles,
  ShieldCheck,
  BookOpen,
  ExternalLink,
  RefreshCw,
  User,
  Eye
} from 'lucide-react';
import { getPostBySlug, getRelatedPosts, getAllPostSlugs } from '@/lib/data/posts';
import { getApprovedCommentsByPostId } from '@/lib/data/comments';
import { MarkdownRenderer } from '@/components/post/MarkdownRenderer';
import { ShareButtons } from '@/components/post/ShareButtons';
import { ViewTracker } from '@/components/post/ViewTracker';
import { AuthorBioBox } from '@/components/post/AuthorBioBox';
import { ArticleJsonLd, FAQJsonLd } from '@/components/seo/JsonLd';
import { PostCard } from '@/components/post/PostCard';
import { CommentsSection } from '@/components/comment/CommentsSection';
import { calculateReadingTime, formatDate, getSiteUrl } from '@/lib/utils';

export const revalidate = 60;

/**
 * Extract FAQ items from markdown content.
 * Looks for patterns like:
 * - ## FAQ / ## Frequently Asked Questions sections
 * - **Q:** / **A:** patterns
 * - ### Question? followed by answer paragraph
 */
function extractFAQFromContent(content: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  if (!content) return faqs;

  // Pattern 1: Markdown headings that end with '?' followed by content
  const headingPattern = /^#{2,4}\s+(.+\?)\s*\n+((?:(?!^#{1,4}\s).+\n?)*)/gm;
  let match;
  while ((match = headingPattern.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim().replace(/\n+/g, ' ').replace(/[*_`#]/g, '').slice(0, 500);
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  // Pattern 2: **Q:** ... **A:** ... patterns
  const qaPattern = /\*\*Q[:.:]\*\*\s*(.+?)\n+\*\*A[:.:]\*\*\s*((?:(?!\*\*Q[:.:]\*\*).+\n?)*)/gi;
  while ((match = qaPattern.exec(content)) !== null) {
    const question = match[1].trim().replace(/[*_`#]/g, '');
    const answer = match[2].trim().replace(/\n+/g, ' ').replace(/[*_`#]/g, '').slice(0, 500);
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

interface ArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((p) => ({
    category: p.categorySlug,
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | SYNAPSE 2026',
    };
  }

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt;
  const coverImage = post.cover_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  const baseUrl = getSiteUrl();
  const categorySlug = post.category?.slug || 'ai-news';
  const canonicalUrl = `${baseUrl}/${categorySlug}/${post.slug}`;

  // Calculate word count for AI metadata
  const wordCount = post.content ? post.content.split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMinutes = post.reading_time || Math.ceil(wordCount / 200);

  return {
    title: `${title} | SYNAPSE AI`,
    description,
    keywords: post.tags,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | SYNAPSE AI`,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      section: post.category?.name || 'Artificial Intelligence',
      tags: post.tags || [],
      authors: post.author?.name ? [post.author.name] : ['SYNAPSE AI Editorial'],
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverImage],
    },
    other: {
      // AI-specific meta tags for better extraction
      'article:published_time': post.published_at,
      ...(post.updated_at && { 'article:modified_time': post.updated_at }),
      'article:section': post.category?.name || 'Artificial Intelligence',
      'article:author': post.author?.name || 'SYNAPSE AI Editorial',
      'reading-time': `${readingTimeMinutes} minutes`,
      'word-count': String(wordCount),
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category: categorySlug, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category_id, 3);
  const comments = await getApprovedCommentsByPostId(post.id);
  const readingTime = post.reading_time ? `${post.reading_time} min read` : calculateReadingTime(post.content);
  const formattedPublishedDate = formatDate(post.published_at);
  const formattedUpdatedDate = formatDate(post.updated_at);
  
  // Show updated date only if updated_at differs meaningfully from published_at (e.g. > 10 minutes)
  const isUpdated = Boolean(
    post.updated_at && 
    Math.abs(new Date(post.updated_at).getTime() - new Date(post.published_at).getTime()) > 10 * 60 * 1000
  );

  const coverImage = post.cover_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

  // Extract FAQ items from post content for FAQPage schema
  const faqItems = extractFAQFromContent(post.content);

  return (
    <>
      {/* Schema.org Structured Data */}
      <ArticleJsonLd post={post} />
      
      {/* FAQ Schema — only rendered when Q&A patterns are found in article */}
      {faqItems.length > 0 && <FAQJsonLd items={faqItems} />}

      {/* Silent view tracker — fires once per visitor per post per 24h, skips admins */}
      <ViewTracker postId={post.id} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap">
          <Link href="/" className="hover:text-slate-700 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          {post.category && (
            <>
              <Link
                href={`/${post.category.slug}`}
                className="hover:text-indigo-600 transition-colors"
              >
                {post.category.name}
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
            </>
          )}
          <span className="text-slate-600 truncate max-w-[200px] sm:max-w-md font-sans font-medium">
            {post.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4">
          {post.category && (
            <Link
              href={`/${post.category.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold badge-ai-gradient hover:scale-105 transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{post.category.name}</span>
            </Link>
          )}

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.18] font-heading">
            {post.title}
          </h1>

          {/* data-speakable marks this for AI voice/answer extraction via SpeakableSpecification */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal excerpt" data-speakable="true">
            {post.excerpt}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-slate-200/70 py-3">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-slate-500">
              
              {/* Author Avatar & Name */}
              {post.author ? (
                <Link
                  href={`/author/${post.author.slug}`}
                  className="flex items-center gap-2 text-slate-800 hover:text-indigo-600 font-sans font-bold transition-colors"
                >
                  {post.author.avatar_url ? (
                    <Image
                      src={post.author.avatar_url}
                      alt={post.author.name}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover border border-indigo-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <span>{post.author.name}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-[10px]">
                    SY
                  </div>
                  <span className="font-sans font-bold text-slate-800">SYNAPSE AI Staff</span>
                </div>
              )}

              <span>•</span>

              {/* Published Date */}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <time dateTime={post.published_at}>{formattedPublishedDate}</time>
              </span>

              {/* Updated Date (if differs from published) */}
              {isUpdated && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold" title={`Updated on ${formattedUpdatedDate}`}>
                    <RefreshCw className="w-3 h-3" />
                    <time dateTime={post.updated_at || post.published_at}>Updated: {formattedUpdatedDate}</time>
                  </span>
                </>
              )}

              <span>•</span>

              {/* Reading Time */}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{readingTime}</span>
              </span>

              <span>•</span>

              {/* View count */}
              <span className="flex items-center gap-1 text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.view_count.toLocaleString()} views</span>
              </span>
            </div>

            {/* Social Share Buttons */}
            <ShareButtons title={post.title} slug={post.slug} categorySlug={categorySlug} />
          </div>
        </header>

        {/* Featured Image with Caption */}
        <figure className="space-y-2">
          <div className="relative w-full h-72 sm:h-96 lg:h-[460px] rounded-3xl overflow-hidden shadow-lg bg-slate-100 border border-slate-200">
            <Image
              src={coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>
          <figcaption className="text-center text-xs font-mono text-slate-400">
            Featured visual representation for: {post.title}
          </figcaption>
        </figure>

        {/* Main Markdown Article Content */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-sm space-y-6">
          <MarkdownRenderer content={post.content} />

          {/* Reference / Source Citation Section */}
          {(post.source_name || post.source_url) && (
            <div className="pt-6 mt-8 border-t border-slate-200/70">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="text-xs">
                  <span className="font-mono font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Original Source & Research Reference
                  </span>
                  <span className="font-semibold text-slate-800">
                    {post.source_name || 'Primary Technical Research'}
                  </span>
                </div>
                {post.source_url && (
                  <a
                    href={post.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 font-mono text-xs font-bold shadow-2xs hover:shadow-xs transition-all"
                  >
                    <span>View Reference</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Clickable Tags Pills */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 mt-6 border-t border-slate-200/70">
              <div className="flex items-center gap-2 flex-wrap font-mono">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
                  Topics:
                </span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/70 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 2026 AI Ethics Disclosure */}
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-violet-50/80 border border-indigo-100 flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 font-heading">SYNAPSE 2026 AI Verification Promise: </span>
              All code snippets, system prompts, and architectural recommendations published on this platform are validated in reproducible test environments.
            </div>
          </div>
        </div>

        {/* Author Bio Box */}
        <AuthorBioBox author={post.author} />

        {/* Social Share Bar Bottom */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900 font-heading">Found this analysis valuable?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Share with your engineering and research network.</p>
          </div>
          <ShareButtons title={post.title} slug={post.slug} categorySlug={categorySlug} />
        </div>

        {/* Technical Discussion & Comments */}
        <CommentsSection
          postId={post.id}
          postSlug={post.slug}
          initialComments={comments}
        />

        {/* Related Posts (3 posts from same category) */}
        {relatedPosts.length > 0 && (
          <section className="pt-8 space-y-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
                Related AI Articles
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <PostCard key={rPost.id} post={rPost} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
