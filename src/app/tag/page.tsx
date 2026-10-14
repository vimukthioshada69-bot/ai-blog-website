import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Tag as TagIcon, Sparkles, Hash, ArrowUpRight } from 'lucide-react';
import { getAllTags, getPublishedPosts } from '@/lib/data/posts';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'All Topics & Tags | SYNAPSE 2026',
  description: 'Browse all AI topics, tags, technical categories, and research themes covered on SYNAPSE 2026.',
  openGraph: {
    title: 'All Topics & Tags | SYNAPSE 2026',
    description: 'Browse all AI topics, tags, technical categories, and research themes covered on SYNAPSE 2026.',
  },
};

export default async function TagsIndexPage() {
  const [tags, allPosts] = await Promise.all([
    getAllTags(),
    getPublishedPosts(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-slate-700 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-indigo-600 font-bold">Tags</span>
      </nav>

      {/* Header Banner */}
      <div className="relative bg-ai-grid glass-panel rounded-3xl p-6 sm:p-10 border border-indigo-100/90 shadow-[0_4px_24px_-4px_rgba(99,102,241,0.06)] overflow-hidden">
        <div className="ai-glow-blob top-0 right-0 w-80 h-80 bg-indigo-300/30 blur-3xl opacity-60 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.35)]">
            <TagIcon className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                TOPIC DIRECTORY
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {tags.length} Topics
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              Explore All AI Topics & Tags
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Find articles, step-by-step guides, code repositories, and benchmarks grouped by technical specialty.
            </p>
          </div>
        </div>
      </div>

      {/* Tags Grid */}
      {tags.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-200 space-y-2">
          <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No tags found</h3>
          <p className="text-xs text-slate-500">Tags will appear as new articles are published.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tags.map(({ tag, count }) => {
            const tagUrl = `/tag/${encodeURIComponent(tag.toLowerCase())}`;

            return (
              <Link
                key={tag}
                href={tagUrl}
                className="group flex flex-col justify-between p-4 rounded-2xl glass-card border border-slate-200/80 hover:border-indigo-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Hash className="w-3.5 h-3.5" />
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading group-hover:text-indigo-600 transition-colors truncate">
                    {tag}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">
                    {count} {count === 1 ? 'article' : 'articles'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
