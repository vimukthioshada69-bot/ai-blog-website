import Link from 'next/link';
import { PlusCircle, Sparkles } from 'lucide-react';
import { getAllPostsForAdmin } from '@/lib/data/posts';
import { AdminPostsTable } from '@/components/admin/AdminPostsTable';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-bold mb-1 border border-indigo-100">
            <Sparkles className="w-3 h-3" />
            <span>CONTENT ARCHIVE</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            Articles Management
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Filter, search, toggle publish status, and edit all articles across the publication
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="px-5 py-2.5 btn-ai-gradient text-white rounded-xl text-xs font-bold shadow-xs hover:scale-105 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Filterable Table */}
      <AdminPostsTable initialPosts={posts} />
    </div>
  );
}
