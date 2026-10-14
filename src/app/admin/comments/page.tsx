import { Metadata } from 'next';
import { 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Compass,
  Sparkles 
} from 'lucide-react';
import Link from 'next/link';
import { getAllCommentsForAdmin, getCommentsStats } from '@/lib/data/comments';
import { CommentModerationTable } from '@/components/admin/CommentModerationTable';

export const metadata: Metadata = {
  title: 'Comments & Discussions Moderation | SYNAPSE Admin',
  description: 'Moderate reader feedback, approve peer reviews, and filter spam across articles.',
};

export const revalidate = 0; // Always fresh for admin dashboard

export default async function AdminCommentsPage() {
  const [comments, stats] = await Promise.all([
    getAllCommentsForAdmin('all'),
    getCommentsStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              Comment Moderation
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-700">
              2026 Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review, approve, and curate technical peer discussions across published articles.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>View Publication</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 font-heading">
              Total Comments
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {stats.total}
          </p>
          <span className="text-[11px] text-slate-400 block font-mono">
            Across all articles
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 font-heading">
              Approved
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono">
            {stats.approved}
          </p>
          <span className="text-[11px] text-slate-400 block font-mono">
            Live and visible
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 font-heading">
              Pending Review
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 font-mono">
            {stats.pending}
          </p>
          <span className="text-[11px] text-slate-400 block font-mono">
            Requires moderation
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 font-heading">
              Flagged / Spam
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 font-mono">
            {stats.spam}
          </p>
          <span className="text-[11px] text-slate-400 block font-mono">
            Blocked from public view
          </span>
        </div>
      </div>

      {/* Moderation Queue & Table */}
      <CommentModerationTable initialComments={comments} />
    </div>
  );
}
