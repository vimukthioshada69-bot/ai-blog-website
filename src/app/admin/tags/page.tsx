import Link from 'next/link';
import { Tag as TagIcon, ArrowUpRight, Sparkles } from 'lucide-react';
import { getAllTags } from '@/lib/data/posts';

export const dynamic = 'force-dynamic';

export default async function AdminTagsPage() {
  const tags = await getAllTags();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-bold mb-1 border border-indigo-100">
          <TagIcon className="w-3.5 h-3.5" />
          <span>INDEXED TAGS</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Tags & Topic Taxonomy
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Overview of all {tags.length} indexed topic tags and their citation frequencies
        </p>
      </div>

      {/* Tags Cloud / Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-bold text-sm text-slate-900 font-heading">
            Indexed Tags Directory ({tags.length})
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Sorted by article frequency
          </span>
        </div>

        {tags.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-mono text-xs">
            No tags found. Add tags when writing articles.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map(({ tag, count }) => (
              <div
                key={tag}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-white flex items-center justify-between transition-all group"
              >
                <div>
                  <Link
                    href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
                    target="_blank"
                    className="font-bold text-xs text-slate-900 font-heading group-hover:text-indigo-600 flex items-center gap-1"
                  >
                    <span>#{tag}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <span className="text-[10px] font-mono text-slate-400">
                    {count} {count === 1 ? 'Article' : 'Articles'}
                  </span>
                </div>

                <Link
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] font-mono hover:text-indigo-600 hover:border-indigo-200"
                >
                  Search
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
