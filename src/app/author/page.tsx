import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, User, BookOpen, ArrowUpRight, Sparkles, Users } from 'lucide-react';
import { getAuthors, getPublishedPosts } from '@/lib/data/posts';
import { TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/common/SocialIcons';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://synapse-ai-2026.vercel.app';
  const canonicalUrl = `${baseUrl}/author`;
  const title = 'Editorial Team & AI Researchers | SYNAPSE 2026';
  const description = 'Meet the AI researchers, deep learning engineers, and technical journalists behind SYNAPSE 2026.';
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
          alt: 'SYNAPSE Editorial Team',
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

export default async function AuthorsIndexPage() {
  const [authors, allPosts] = await Promise.all([
    getAuthors(),
    getPublishedPosts(),
  ]);

  // Compute post count for each author
  const authorsWithCounts = authors.map((author) => {
    const postCount = allPosts.filter((p) => p.author?.slug === author.slug).length;
    return {
      ...author,
      postCount,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Schema.org BreadcrumbList Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Authors', url: '/author' },
        ]}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-slate-700 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-indigo-600 font-bold">Authors</span>
      </nav>

      {/* Header Banner */}
      <div className="relative bg-ai-grid glass-panel rounded-3xl p-6 sm:p-10 border border-indigo-100/90 shadow-[0_4px_24px_-4px_rgba(99,102,241,0.06)] overflow-hidden">
        <div className="ai-glow-blob top-0 right-0 w-80 h-80 bg-indigo-300/30 blur-3xl opacity-60 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.35)]">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                EDITORIAL ROSTER
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {authors.length} Contributors
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              Our AI Researchers & Authors
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Explore insights, research papers, and technical implementation roadmaps from our multidisciplinary team of AI engineers and domain experts.
            </p>
          </div>
        </div>
      </div>

      {/* Authors Grid */}
      {authorsWithCounts.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-200 space-y-2">
          <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No authors found</h3>
          <p className="text-xs text-slate-500">Check back soon as our team expands.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {authorsWithCounts.map((author) => {
            const authorUrl = `/author/${author.slug}`;

            return (
              <article
                key={author.id}
                className="group flex flex-col glass-card rounded-3xl border border-slate-200/80 p-6 sm:p-7 justify-between hover:border-indigo-300 transition-all duration-300"
              >
                <div>
                  {/* Top Avatar & Count */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <Link href={authorUrl} className="relative block flex-shrink-0">
                      {author.avatar_url ? (
                        <Image
                          src={author.avatar_url}
                          alt={author.name}
                          width={80}
                          height={80}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-100 group-hover:border-indigo-300 group-hover:scale-105 transition-all shadow-xs"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border-2 border-indigo-100 group-hover:scale-105 transition-transform">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </Link>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/70 text-[11px] font-mono text-slate-600">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-semibold">{author.postCount} {author.postCount === 1 ? 'Article' : 'Articles'}</span>
                    </div>
                  </div>

                  {/* Author Name */}
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading group-hover:text-indigo-600 transition-colors">
                    <Link href={authorUrl}>
                      {author.name}
                    </Link>
                  </h2>

                  {/* Bio */}
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {author.bio || 'AI Researcher and contributing writer at SYNAPSE 2026.'}
                  </p>
                </div>

                {/* Bottom Socials & Link */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {author.social_links?.twitter && (
                      <a
                        href={author.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200/60 transition-colors"
                        aria-label="Twitter"
                      >
                        <TwitterIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {author.social_links?.linkedin && (
                      <a
                        href={author.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200/60 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <LinkedinIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {author.social_links?.github && (
                      <a
                        href={author.social_links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200/60 transition-colors"
                        aria-label="GitHub"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <Link
                    href={authorUrl}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 font-sans group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
