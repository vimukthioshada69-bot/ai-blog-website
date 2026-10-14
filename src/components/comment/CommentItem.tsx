'use client';

import { Pin, Reply, MessageSquare } from 'lucide-react';
import { Comment } from '@/lib/supabase/types';
import { formatDate } from '@/lib/utils';

interface CommentItemProps {
  comment: Comment;
  replies?: Comment[];
  onReply?: (commentId: string, authorName: string) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGradient(name: string): string {
  const gradients = [
    'from-indigo-600 to-violet-600',
    'from-violet-600 to-purple-600',
    'from-sky-600 to-indigo-600',
    'from-indigo-500 to-fuchsia-600',
    'from-blue-600 to-indigo-700',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function CommentItem({ comment, replies = [], onReply }: CommentItemProps) {
  const initials = getInitials(comment.author_name);
  const gradient = getGradient(comment.author_name);
  const formattedDate = formatDate(comment.created_at);

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 transition-all border ${
        comment.is_pinned
          ? 'bg-gradient-to-b from-indigo-50/50 to-white border-indigo-200/80 shadow-xs'
          : 'bg-white border-slate-200/80 shadow-xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${gradient} text-white font-bold text-xs flex items-center justify-center shadow-2xs font-mono`}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-slate-900 font-heading">
                {comment.author_name}
              </span>
              {comment.is_pinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-indigo-100 text-indigo-700 border border-indigo-200/80">
                  <Pin className="w-2.5 h-2.5" />
                  <span>Pinned Insight</span>
                </span>
              )}
            </div>
            <time
              dateTime={comment.created_at}
              className="text-[11px] text-slate-400 block mt-0.5 font-mono"
            >
              {formattedDate}
            </time>
          </div>
        </div>

        {onReply && (
          <button
            type="button"
            onClick={() => onReply(comment.id, comment.author_name)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/80 transition-colors"
            aria-label={`Reply to ${comment.author_name}`}
          >
            <Reply className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reply</span>
          </button>
        )}
      </div>

      {/* Comment Body */}
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-12">
        {comment.content}
      </p>

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="mt-4 pl-8 sm:pl-12 space-y-3 pt-3 border-t border-slate-100">
          {replies.map((reply) => {
            const replyInitials = getInitials(reply.author_name);
            const replyGradient = getGradient(reply.author_name);
            const replyDate = formatDate(reply.created_at);

            return (
              <div
                key={reply.id}
                className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${replyGradient} text-white font-bold text-[10px] flex items-center justify-center font-mono`}
                    >
                      {replyInitials}
                    </div>
                    <span className="font-bold text-xs text-slate-900 font-heading">
                      {reply.author_name}
                    </span>
                  </div>
                  <time className="text-[10px] text-slate-400 font-mono">
                    {replyDate}
                  </time>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  {reply.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
