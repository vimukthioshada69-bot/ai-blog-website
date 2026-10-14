import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Calendar, ArrowUpRight, Sparkles, User } from 'lucide-react';
import { PostWithCategory } from '@/lib/supabase/types';
import { calculateReadingTime, formatRelativeDate } from '@/lib/utils';

interface PostCardProps {
  post: PostWithCategory;
  featured?: boolean;
  compact?: boolean;
  priority?: boolean;
}

export function PostCard({ post, featured = false, compact = false, priority = false }: PostCardProps) {
  const readingTime = post.reading_time ? `${post.reading_time} min read` : calculateReadingTime(post.content);
  const relativeTime = formatRelativeDate(post.published_at);
  const categorySlug = post.category?.slug || 'ai-news';
  const postUrl = `/${categorySlug}/${post.slug}`;
  const coverImage = post.cover_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

  if (featured) {
    return (
      <article className="group relative glass-panel rounded-3xl border border-indigo-100/90 overflow-hidden shadow-[0_8px_30px_-4px_rgba(99,102,241,0.08)] hover:shadow-[0_20px_40px_-6px_rgba(99,102,241,0.18)] hover:border-indigo-300 transition-all duration-300 flex flex-col lg:grid lg:grid-cols-12 gap-0">
        
        {/* Cover Image — explicit height on all breakpoints so Next.js fill always has a parent dimension */}
        <div className="relative lg:col-span-7 w-full h-56 sm:h-72 lg:h-auto lg:min-h-[420px] flex-shrink-0 bg-slate-200">
          <Image
            src={coverImage}
            alt={post.title}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle bottom gradient on mobile so text readable if overlaid */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent lg:hidden pointer-events-none" />
          
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold bg-white/95 text-indigo-700 shadow-md backdrop-blur-md border border-indigo-100">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 animate-pulse" />
              <span>2026 FEATURED SPOTLIGHT</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-5 p-5 sm:p-7 lg:p-10 flex flex-col justify-between bg-gradient-to-b from-white/90 to-slate-50/60 min-h-0">
          <div>
            {/* Category & Relative Date */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold text-slate-500 mb-3 flex-wrap">
              {post.category && (
                <Link
                  href={`/${categorySlug}`}
                  className="px-3 py-1 rounded-lg badge-ai-gradient font-bold hover:scale-105 transition-transform"
                >
                  {post.category.name}
                </Link>
              )}
              <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5" />
                {relativeTime}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug font-heading group-hover:text-indigo-600 transition-colors">
              <Link href={postUrl}>
                {post.title}
              </Link>
            </h2>

            {/* Excerpt */}
            <p className="text-slate-600 text-sm sm:text-base mt-2 sm:mt-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author mini preview */}
            {post.author && (
              <div className="flex items-center gap-2.5 mt-3 sm:mt-4 pt-3 border-t border-slate-100">
                {post.author.avatar_url ? (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full object-cover border border-indigo-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    <User className="w-3 h-3" />
                  </div>
                )}
                <Link
                  href={`/author/${post.author.slug}`}
                  className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors truncate"
                >
                  {post.author.name}
                </Link>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
                    className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-200/70 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                {readingTime}
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                {post.view_count.toLocaleString()}
              </span>
            </div>

            <Link
              href={postUrl}
              className="inline-flex items-center gap-1 font-sans font-bold text-xs text-indigo-600 hover:text-indigo-800 transition-colors group-hover:translate-x-1 whitespace-nowrap"
            >
              <span>Read article</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (compact) {
    return (
      <article className="group flex items-start gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300">
        <Link href={postUrl} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 block">
          <Image
            src={coverImage}
            alt={post.title}
            fill
            sizes="120px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between h-24 sm:h-28">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mb-1">
              {post.category && (
                <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                  {post.category.name}
                </span>
              )}
              <span>{relativeTime}</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 font-heading leading-snug">
              <Link href={postUrl}>
                {post.title}
              </Link>
            </h4>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{readingTime}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-indigo-400" />
              {post.view_count}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col glass-card rounded-3xl border border-slate-200/80 overflow-hidden">
      
      {/* Cover Image */}
      <Link href={postUrl} className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 block">
        <Image
          src={coverImage}
          alt={post.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {post.category && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/95 text-indigo-700 shadow-sm backdrop-blur-xs border border-indigo-100">
              {post.category.name}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Reading time */}
          <div className="flex items-center gap-2.5 text-[11px] font-mono text-slate-400 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {relativeTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {readingTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug font-heading group-hover:text-indigo-600 transition-colors line-clamp-2">
            <Link href={postUrl}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-slate-600 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author */}
          {post.author && (
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
              {post.author.avatar_url ? (
                <Image
                  src={post.author.avatar_url}
                  alt={post.author.name}
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">
                  <User className="w-3 h-3" />
                </div>
              )}
              <Link
                href={`/author/${post.author.slug}`}
                className="text-xs text-slate-600 hover:text-indigo-600 font-medium"
              >
                {post.author.name}
              </Link>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.slice(0, 2).map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
                  className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs font-mono">
          <span className="flex items-center gap-1 text-slate-400">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            {post.view_count.toLocaleString()}
          </span>

          <Link
            href={postUrl}
            className="font-sans font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Read</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
