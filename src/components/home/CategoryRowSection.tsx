import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, GraduationCap, Cpu, Compass, Gamepad2, Terminal } from 'lucide-react';
import { Category, PostWithCategory } from '@/lib/supabase/types';
import { PostCard } from '../post/PostCard';

const categoryIcons: Record<string, any> = {
  'ai-news': Zap,
  'learn-ai': GraduationCap,
  'deep-learning': Cpu,
  'free-tools': Compass,
  'gaming-tech': Gamepad2,
  'prompt-engineering': Terminal,
};

interface CategoryRowSectionProps {
  category: Category;
  posts: PostWithCategory[];
  isSecondary?: boolean;
}

export function CategoryRowSection({ category, posts, isSecondary = false }: CategoryRowSectionProps) {
  if (!posts || posts.length === 0) return null;

  const Icon = categoryIcons[category.slug] || Sparkles;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/80 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-50 to-violet-50 text-indigo-600 flex items-center justify-center border border-indigo-100/80 shadow-2xs flex-shrink-0">
            <Icon className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading truncate">
                {category.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold flex-shrink-0">
                {posts.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1 hidden sm:block">
              {category.description}
            </p>
          </div>
        </div>

        <Link
          href={`/${category.slug}`}
          className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:translate-x-0.5 transition-all flex-shrink-0"
        >
          <span className="hidden sm:inline">View All</span>
          <span className="sm:hidden">All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Posts Grid */}
      {isSecondary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.slice(0, 4).map((post) => (
            <PostCard key={post.id} post={post} compact={true} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
