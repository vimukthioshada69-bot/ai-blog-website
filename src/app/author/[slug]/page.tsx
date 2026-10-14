import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, User, Sparkles, BookOpen } from 'lucide-react';
import { getAuthors, getAuthorBySlug, getPublishedPosts } from '@/lib/data/posts';
import { PostCard } from '@/components/post/PostCard';
import { TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/common/SocialIcons';
import { PersonJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 60;

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return {
      title: 'Author Not Found | SYNAPSE 2026',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://synapse-ai-2026.vercel.app';
  const canonicalUrl = `${baseUrl}/author/${author.slug}`;
  const title = `${author.name} | AI Author & Researcher`;
  const description = author.bio || `Articles, research papers, and tutorials published by ${author.name} on SYNAPSE 2026.`;
  const avatarImage = author.avatar_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

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
      type: 'profile',
      images: [
        {
          url: avatarImage,
          width: 800,
          height: 800,
          alt: author.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [avatarImage],
    },
  };
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const posts = await getPublishedPosts({ authorSlug: slug });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Schema.org Person Structured Data */}
      <PersonJsonLd author={author} />
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-slate-700 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-500">Authors</span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-indigo-600 font-bold">{author.name}</span>
      </nav>

      {/* Author Profile Banner */}
      <div className="relative bg-ai-grid glass-panel rounded-3xl p-6 sm:p-10 border border-indigo-100/90 shadow-[0_4px_24px_-4px_rgba(99,102,241,0.06)] overflow-hidden">
        <div className="ai-glow-blob top-0 right-0 w-80 h-80 bg-indigo-300/30 blur-3xl opacity-60" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {author.avatar_url ? (
              <Image
                src={author.avatar_url}
                alt={author.name}
                width={112}
                height={112}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-indigo-50 text-indigo-700 flex items-center justify-center border-4 border-white shadow-md">
                <User className="w-12 h-12" />
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-indigo-600 text-white font-mono text-[10px] font-bold shadow-xs">
              AUTHOR
            </span>
          </div>

          {/* Details */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  CONTRIBUTOR PROFILE
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">
                  {author.name}
                </h1>
              </div>

              {/* Social links */}
              {author.social_links && (
                <div className="flex items-center gap-2">
                  {author.social_links.twitter && (
                    <a
                      href={author.social_links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 shadow-2xs transition-all"
                      aria-label="Twitter"
                    >
                      <TwitterIcon className="w-4 h-4" />
                    </a>
                  )}
                  {author.social_links.linkedin && (
                    <a
                      href={author.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 shadow-2xs transition-all"
                      aria-label="LinkedIn"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  )}
                  {author.social_links.github && (
                    <a
                      href={author.social_links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 shadow-2xs transition-all"
                      aria-label="GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {author.bio || 'AI Research Scientist & Contributing Writer at SYNAPSE 2026.'}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                {posts.length} {posts.length === 1 ? 'Article Published' : 'Articles Published'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Posts Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 font-heading tracking-tight">
          Articles by {author.name}
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border border-slate-200 space-y-2">
            <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No articles published yet</h3>
            <p className="text-xs text-slate-500">Check back soon for new research by {author.name}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
