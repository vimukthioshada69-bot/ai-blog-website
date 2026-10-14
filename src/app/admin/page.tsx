import Link from 'next/link';
import { 
  FileText, 
  Eye, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  Sparkles, 
  TrendingUp, 
  Calendar,
  Users,
  FolderTree
} from 'lucide-react';
import { getAllPostsForAdmin, getCategories, getAuthors } from '@/lib/data/posts';
import { AdminPostsTable } from '@/components/admin/AdminPostsTable';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [posts, categories, authors] = await Promise.all([
    getAllPostsForAdmin(),
    getCategories(),
    getAuthors(),
  ]);

  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.published);
  const draftPosts = posts.filter((p) => !p.published);
  const scheduledPosts = posts.filter((p) => p.scheduled_for && new Date(p.scheduled_for) > new Date());
  const totalViews = posts.reduce((sum, p) => sum + (p.view_count || 0), 0);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-bold mb-1 border border-indigo-100">
            <Sparkles className="w-3 h-3" />
            <span>SYNAPSE 2026 EDITORIAL SUITE</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            Executive Overview
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Real-time analytics, editorial pipeline, and publication metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles/new"
            className="px-5 py-2.5 btn-ai-gradient text-white rounded-xl text-xs font-bold shadow-xs hover:scale-105 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Articles */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-500">Total Articles</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading">
            {totalPosts}
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            Across {categories.length} categories
          </p>
        </div>

        {/* Total Views */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-500">Total Views</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading">
            {totalViews.toLocaleString()}
          </div>
          <p className="text-[11px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
            Active readership
          </p>
        </div>

        {/* Published */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-500">Published Live</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading">
            {publishedPosts.length}
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            Publicly visible
          </p>
        </div>

        {/* Drafts */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-500">Drafts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading">
            {draftPosts.length}
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            Work in progress
          </p>
        </div>

        {/* Scheduled */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-500">Scheduled</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading">
            {scheduledPosts.length}
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            Auto-publishing
          </p>
        </div>

      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/articles"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-2xs flex items-center justify-between group transition-all"
        >
          <div>
            <span className="font-bold text-sm text-slate-900 font-heading group-hover:text-indigo-600 block">
              Manage Articles →
            </span>
            <span className="text-xs text-slate-500 font-mono">
              View all {totalPosts} articles, drafts & scheduled posts
            </span>
          </div>
          <FileText className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </Link>

        <Link
          href="/admin/authors"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-2xs flex items-center justify-between group transition-all"
        >
          <div>
            <span className="font-bold text-sm text-slate-900 font-heading group-hover:text-indigo-600 block">
              Manage Authors →
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {authors.length} active researchers & contributors
            </span>
          </div>
          <Users className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </Link>

        <Link
          href="/admin/categories"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-2xs flex items-center justify-between group transition-all"
        >
          <div>
            <span className="font-bold text-sm text-slate-900 font-heading group-hover:text-indigo-600 block">
              Manage Categories →
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {categories.length} core AI topic horizons
            </span>
          </div>
          <FolderTree className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </Link>
      </div>

      {/* Recent Articles Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 font-heading">
            Recent Editorial Queue
          </h2>
          <Link
            href="/admin/articles"
            className="text-xs font-mono font-bold text-indigo-600 hover:underline"
          >
            View Full List ({totalPosts})
          </Link>
        </div>
        <AdminPostsTable initialPosts={posts.slice(0, 8)} />
      </div>

    </div>
  );
}
