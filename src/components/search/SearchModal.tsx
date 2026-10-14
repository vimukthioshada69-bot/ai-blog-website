'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Sparkles, BookOpen, Tag } from 'lucide-react';
import { PostWithCategory } from '@/lib/supabase/types';
import Link from 'next/link';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: PostWithCategory[];
}

export function SearchModal({ isOpen, onClose, posts }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPosts = query.trim()
    ? posts.filter((post) => {
        const q = query.toLowerCase();
        return (
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.category?.name.toLowerCase().includes(q) ||
          post.tags?.some((t) => t.toLowerCase().includes(q))
        );
      })
    : posts.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search AI articles, roadmaps, free tools, prompts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-base text-slate-800 placeholder-slate-400 bg-transparent outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium text-slate-400 bg-slate-100 rounded hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {query.trim() ? `Found ${filteredPosts.length} results` : 'Suggested & Trending'}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-60" />
              <p className="font-medium text-slate-700">No matching articles found</p>
              <p className="text-sm text-slate-400 mt-1">Try searching for keywords like "deep learning", "agents", or "tools"</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                onClick={onClose}
                className="group flex items-start gap-3 p-3 rounded-xl hover:bg-indigo-50/60 transition-colors border border-transparent hover:border-indigo-100"
              >
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700">
                      {post.category?.name || 'Article'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1 mt-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {post.excerpt}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all self-center" />
              </Link>
            ))
          )}
        </div>

        {/* Footer Quick Links */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700">Popular:</span>
            <button
              onClick={() => setQuery('agents')}
              className="hover:text-indigo-600 underline underline-offset-2"
            >
              Agents
            </button>
            <span>•</span>
            <button
              onClick={() => setQuery('deep learning')}
              className="hover:text-indigo-600 underline underline-offset-2"
            >
              Deep Learning
            </button>
            <span>•</span>
            <button
              onClick={() => setQuery('free tools')}
              className="hover:text-indigo-600 underline underline-offset-2"
            >
              Free Tools
            </button>
          </div>
          <Link
            href="/search"
            onClick={onClose}
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            Advanced search <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
