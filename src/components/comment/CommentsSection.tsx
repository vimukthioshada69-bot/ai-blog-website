'use client';

import { useState } from 'react';
import { MessageSquare, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { Comment } from '@/lib/supabase/types';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';

interface CommentsSectionProps {
  postId: string;
  postSlug: string;
  initialComments: Comment[];
}

export function CommentsSection({
  postId,
  postSlug,
  initialComments,
}: CommentsSectionProps) {
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);

  // Group top-level comments and their replies
  const topLevelComments = initialComments.filter((c) => !c.parent_id);
  const repliesByParent = initialComments.reduce<Record<string, Comment[]>>((acc, comment) => {
    if (comment.parent_id) {
      if (!acc[comment.parent_id]) {
        acc[comment.parent_id] = [];
      }
      acc[comment.parent_id].push(comment);
    }
    return acc;
  }, {});

  const handleReply = (commentId: string, authorName: string) => {
    setReplyingTo({ id: commentId, name: authorName });
    // Smooth scroll to form
    const formElement = document.getElementById('comment-form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <section id="discussion" className="pt-10 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
                Technical Discussion
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100/70 text-indigo-700">
                {initialComments.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Peer review, implementation notes, and architecture insights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Moderated AI Community</span>
        </div>
      </div>

      {/* Comment Submission Form */}
      <div id="comment-form-container">
        <CommentForm
          postId={postId}
          parentId={replyingTo?.id || null}
          parentAuthorName={replyingTo?.name || null}
          onCancelReply={handleCancelReply}
          onSuccess={handleCancelReply}
        />
      </div>

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {topLevelComments.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center mx-auto text-slate-400">
              <MessageCircleQuestion className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h4 className="text-sm font-bold text-slate-800 font-heading">
                No discussion yet
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Be the first research engineer or reader to share feedback, questions, or benchmarks on this article.
              </p>
            </div>
          </div>
        ) : (
          topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={repliesByParent[comment.id] || []}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </section>
  );
}
