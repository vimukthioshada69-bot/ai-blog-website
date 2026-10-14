'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Send, AlertCircle, CheckCircle2, CornerDownRight, X, Sparkles, Shield } from 'lucide-react';
import { createComment, CommentActionResponse } from '@/app/actions/commentActions';

interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  parentAuthorName?: string | null;
  onCancelReply?: () => void;
  onSuccess?: () => void;
}

export function CommentForm({
  postId,
  parentId = null,
  parentAuthorName = null,
  onCancelReply,
  onSuccess,
}: CommentFormProps) {
  const [state, formAction, isPending] = useActionState<CommentActionResponse | null, FormData>(
    createComment,
    null
  );

  const [content, setContent] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      setContent('');
      formRef.current?.reset();
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [state, onSuccess]);

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      {/* Reply Banner */}
      {parentId && parentAuthorName && (
        <div className="mb-4 flex items-center justify-between gap-3 p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <CornerDownRight className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>
              Replying to <strong className="font-semibold">{parentAuthorName}</strong>
            </span>
          </div>
          {onCancelReply && (
            <button
              type="button"
              onClick={onCancelReply}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              aria-label="Cancel reply"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Success Banner */}
      {state?.success && state.message && (
        <div
          role="status"
          className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fadeIn"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="font-medium">{state.message}</p>
        </div>
      )}

      {/* Error Banner */}
      {state?.error && (
        <div
          role="alert"
          className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="font-medium">{state.error}</p>
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-4">
        <input type="hidden" name="post_id" value={postId} />
        {parentId && <input type="hidden" name="parent_id" value={parentId} />}
        
        {/* Anti-spam Honeypot field (hidden from real users) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="hp_comment_field">Leave this empty</label>
          <input
            id="hp_comment_field"
            type="text"
            name="honeypot"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="comment_author_name"
              className="block text-xs font-semibold text-slate-700 mb-1.5 font-heading"
            >
              Your Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="comment_author_name"
              type="text"
              name="author_name"
              required
              maxLength={60}
              placeholder="e.g. Dr. Alex Vance"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-slate-50/50 hover:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="comment_author_email"
              className="block text-xs font-semibold text-slate-700 mb-1.5 font-heading"
            >
              Email <span className="text-slate-400 font-normal">(Never shown publicly)</span>
            </label>
            <input
              id="comment_author_email"
              type="email"
              name="author_email"
              maxLength={120}
              placeholder="e.g. alex@university.edu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-slate-50/50 hover:bg-white"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="comment_content"
              className="block text-xs font-semibold text-slate-700 font-heading"
            >
              Insight or Question <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                content.length > 1400 ? 'text-amber-600 font-bold' : 'text-slate-400'
              }`}
            >
              {content.length}/1500
            </span>
          </div>
          <textarea
            id="comment_content"
            name="content"
            required
            rows={3}
            maxLength={1500}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your perspective, benchmark experience, or technical question..."
            className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-slate-50/50 hover:bg-white resize-y"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-indigo-500/70" />
            <span>Spam filtered • Constructive technical dialogue encouraged</span>
          </div>

          <button
            type="submit"
            disabled={isPending || content.trim().length === 0}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold font-heading shadow-xs hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.98] w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <span>Post Comment</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
