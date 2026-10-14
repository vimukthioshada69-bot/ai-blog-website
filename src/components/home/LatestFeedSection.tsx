import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { PostWithCategory } from '@/lib/supabase/types';
import { PostCard } from '../post/PostCard';

interface LatestFeedSectionProps {
  posts: PostWithCategory[];
}

export function LatestFeedSection({ posts }: LatestFeedSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Latest AI Dispatches
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Chronological feed with real-time updates
            </p>
          </div>
        </div>
        <Link
          href="/search"
          className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:translate-x-0.5 transition-all"
        >
          <span>View Archive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
