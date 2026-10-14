'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Trash2, 
  Pin, 
  ShieldAlert, 
  ExternalLink, 
  Clock, 
  AlertCircle,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { CommentStatus, CommentWithPost } from '@/lib/supabase/types';
import { formatDate } from '@/lib/utils';
import { moderateComment, deleteComment, togglePinComment } from '@/app/actions/commentActions';

interface CommentModerationTableProps {
  initialComments: CommentWithPost[];
}

export function CommentModerationTable({ initialComments }: CommentModerationTableProps) {
  const [comments, setComments] = useState<CommentWithPost[]>(initialComments);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (commentId: string, newStatus: CommentStatus) => {
    setLoadingId(commentId);
    setFeedback(null);

    startTransition(async () => {
      const res = await moderateComment(commentId, newStatus);
      setLoadingId(null);
      if (res.success) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, status: newStatus } : c))
        );
        setFeedback({ type: 'success', message: res.message || 'Status updated.' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update status.' });
      }
    });
  };

  const handleTogglePin = (commentId: string, currentPin: boolean) => {
    setLoadingId(commentId);
    setFeedback(null);

    startTransition(async () => {
      const res = await togglePinComment(commentId, !currentPin);
      setLoadingId(null);
      if (res.success) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, is_pinned: !currentPin } : c))
        );
        setFeedback({ type: 'success', message: res.message || 'Pin state updated.' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to toggle pin.' });
      }
    });
  };

  const handleDelete = (commentId: string) => {
    if (!confirm('Are you sure you want to permanently delete this comment?')) {
      return;
    }

    setLoadingId(commentId);
    setFeedback(null);

    startTransition(async () => {
      const res = await deleteComment(commentId);
      setLoadingId(null);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        setFeedback({ type: 'success', message: res.message || 'Comment deleted.' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to delete comment.' });
      }
    });
  };

  const filteredComments = comments.filter((c) => {
    const matchesFilter = activeFilter === 'all' ? true : c.status === activeFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      c.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.post?.title && c.post.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Toast Feedback */}
      {feedback && (
        <div
          role="status"
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between gap-3 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'approved', label: 'Approved' },
            { id: 'pending', label: 'Pending' },
            { id: 'spam', label: 'Spam' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search author, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 hover:bg-white transition-all"
          />
        </div>
      </div>

      {/* Moderation Items */}
      {filteredComments.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-heading">
              No comments found
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {searchQuery
                ? 'No comments match your search criteria.'
                : 'There are currently no comments in this moderation queue.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComments.map((comment) => {
            const isLoading = loadingId === comment.id;
            const postCategorySlug = comment.post?.category?.slug || 'ai-news';
            const postSlug = comment.post?.slug;

            return (
              <div
                key={comment.id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-2xs ${
                  comment.is_pinned
                    ? 'border-indigo-200 bg-indigo-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Author, Post Title & Content */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 font-heading">
                        {comment.author_name}
                      </span>
                      {comment.author_email && (
                        <span className="text-[11px] font-mono text-slate-400">
                          ({comment.author_email})
                        </span>
                      )}

                      {/* Status Badges */}
                      {comment.status === 'approved' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Approved
                        </span>
                      )}
                      {comment.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-100 text-amber-700 border border-amber-200">
                          Pending Review
                        </span>
                      )}
                      {comment.status === 'spam' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-100 text-rose-700 border border-rose-200">
                          Flagged as Spam
                        </span>
                      )}
                      {comment.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200">
                          Rejected
                        </span>
                      )}

                      {comment.is_pinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-indigo-100 text-indigo-700 border border-indigo-200">
                          <Pin className="w-2.5 h-2.5" />
                          <span>Pinned</span>
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400 font-mono">
                        • {formatDate(comment.created_at)}
                      </span>
                    </div>

                    {/* Associated Post Reference */}
                    {comment.post && (
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span className="font-medium text-slate-600">On article:</span>
                        {postSlug ? (
                          <Link
                            href={`/${postCategorySlug}/${postSlug}`}
                            target="_blank"
                            className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1"
                          >
                            <span>{comment.post.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="font-semibold text-slate-800">
                            {comment.post.title}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Content Text */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>

                  {/* Right Column: Moderation Actions */}
                  <div className="flex items-center gap-1.5 self-end md:self-start flex-shrink-0 pt-2 md:pt-0">
                    {/* Approve Button */}
                    {comment.status !== 'approved' && (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleStatusChange(comment.id, 'approved')}
                        title="Approve comment"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Approve</span>
                      </button>
                    )}

                    {/* Pending / Flag Button */}
                    {comment.status !== 'pending' && (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleStatusChange(comment.id, 'pending')}
                        title="Move to pending"
                        className="p-1.5 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    )}

                    {/* Spam Button */}
                    {comment.status !== 'spam' && (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleStatusChange(comment.id, 'spam')}
                        title="Mark as spam"
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    )}

                    {/* Pin / Unpin Button */}
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleTogglePin(comment.id, comment.is_pinned)}
                      title={comment.is_pinned ? 'Unpin comment' : 'Pin comment to top'}
                      className={`p-1.5 rounded-xl transition-colors disabled:opacity-50 ${
                        comment.is_pinned
                          ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                          : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
                      }`}
                    >
                      <Pin className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleDelete(comment.id)}
                      title="Permanently delete comment"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
