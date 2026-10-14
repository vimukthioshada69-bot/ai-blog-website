import Link from 'next/link';
import { Flame, Eye, Clock, ArrowUpRight } from 'lucide-react';
import { PostWithCategory } from '@/lib/supabase/types';
import { formatRelativeDate, calculateReadingTime } from '@/lib/utils';

interface TrendingSectionProps {
  posts: PostWithCategory[];
}

export function TrendingSection({ posts }: TrendingSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                Trending Articles
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-100">
                Most Viewed This Week
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Ranked by community readership and citations
            </p>
          </div>
        </div>
      </div>

      {/* Trending Grid: Top 1 large spotlight + 4 ranked list items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ranked List of Top 4 */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.slice(0, 6).map((post, idx) => {
            const categorySlug = post.category?.slug || 'ai-news';
            const readingTime = post.reading_time ? `${post.reading_time} min read` : calculateReadingTime(post.content);

            return (
              <div
                key={post.id}
                className="group glass-card p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 flex items-start gap-4"
              >
                {/* Ranking index */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-700 flex items-center justify-center font-mono font-black text-sm flex-shrink-0 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  0{idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mb-1">
                    {post.category && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                        {post.category.name}
                      </span>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-indigo-500" />
                      {post.view_count.toLocaleString()} reads
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 font-heading line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
                    <Link href={`/${categorySlug}/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-slate-400">
                    <span>{readingTime}</span>
                    <Link
                      href={`/${categorySlug}/${post.slug}`}
                      className="font-sans font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                    >
                      <span>Read</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
