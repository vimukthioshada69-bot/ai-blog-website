'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  Edit, 
  Trash2, 
  Eye, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Loader2, 
  AlertTriangle,
  Calendar,
  Search,
  User,
  Filter,
  X,
  CheckCircle2
} from 'lucide-react';
import { PostWithCategory } from '@/lib/supabase/types';
import { formatDate } from '@/lib/utils';
import { deletePost, togglePublishPost } from '@/app/actions/postActions';

interface AdminPostsTableProps {
  initialPosts: PostWithCategory[];
}

export function AdminPostsTable({ initialPosts }: AdminPostsTableProps) {
  const [posts, setPosts] = useState<PostWithCategory[]>(initialPosts);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts' | 'scheduled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const now = new Date();

  // Filtered posts based on active tab and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Tab matching
      if (activeTab === 'published') {
        if (!post.published) return false;
      } else if (activeTab === 'drafts') {
        if (post.published) return false;
      } else if (activeTab === 'scheduled') {
        if (!post.scheduled_for || new Date(post.scheduled_for) <= now) return false;
      }

      // Search matching
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesSlug = post.slug.toLowerCase().includes(q);
        const matchesCat = post.category?.name.toLowerCase().includes(q);
        const matchesAuthor = post.author?.name.toLowerCase().includes(q);
        return matchesTitle || matchesSlug || matchesCat || matchesAuthor;
      }

      return true;
    });
  }, [posts, activeTab, searchTerm]);

  const counts = useMemo(() => {
    const published = posts.filter((p) => p.published).length;
    const drafts = posts.filter((p) => !p.published).length;
    const scheduled = posts.filter((p) => p.scheduled_for && new Date(p.scheduled_for) > now).length;
    return { all: posts.length, published, drafts, scheduled };
  }, [posts]);

  const handleTogglePublish = async (post: PostWithCategory) => {
    setLoadingId(post.id);
    try {
      const res = await togglePublishPost(post.id, post.published);
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p))
        );
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await deletePost(id);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setDeleteModalId(null);
        showToast('success', 'Article deleted successfully.');
      } else {
        showToast('error', res.error || 'Failed to delete article.');
      }
    } catch {
      showToast('error', 'An unexpected error occurred.');
    } finally {
      setLoadingId(null);
    }
  };

  const postToDelete = deleteModalId ? posts.find((p) => p.id === deleteModalId) : null;

  return (
    <div className="space-y-4">

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-1 text-current opacity-50 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      
      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'all'
                ? 'btn-ai-gradient text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('published')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'published'
                ? 'btn-ai-gradient text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Published ({counts.published})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('drafts')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'drafts'
                ? 'btn-ai-gradient text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Drafts ({counts.drafts})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scheduled')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'scheduled'
                ? 'btn-ai-gradient text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scheduled ({counts.scheduled})
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by title, slug, author..."
            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64 font-mono"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] font-mono font-bold text-slate-400">
              <tr>
                <th className="px-6 py-4">Title & Details</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Author</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Views</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-mono text-xs">
                    No articles found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => {
                  const isLoading = loadingId === post.id;
                  const categorySlug = post.category?.slug || 'ai-news';
                  const isScheduled = post.scheduled_for && new Date(post.scheduled_for) > now;

                  return (
                    <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Title & Slug */}
                      <td className="px-6 py-4 max-w-xs sm:max-w-md">
                        <div className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-indigo-600 font-heading">
                          <Link href={`/admin/articles/${post.id}/edit`}>
                            {post.title}
                          </Link>
                        </div>
                        <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5 font-mono">
                          /{categorySlug}/{post.slug}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {post.category ? (
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {post.category.name}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Author */}
                      <td className="px-4 py-4 whitespace-nowrap text-slate-700">
                        {post.author ? (
                          <span className="flex items-center gap-1.5 font-medium">
                            <User className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{post.author.name}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">SYNAPSE AI</span>
                        )}
                      </td>

                      {/* Status & Quick Toggle */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(post)}
                          disabled={isLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                            post.published
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {isLoading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : post.published ? (
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{post.published ? 'Published' : 'Draft'}</span>
                        </button>
                        {isScheduled && (
                          <span className="block text-[10px] font-mono text-purple-600 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Scheduled</span>
                          </span>
                        )}
                      </td>

                      {/* Views */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-1 font-mono font-semibold text-slate-700">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          {post.view_count.toLocaleString()}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {formatDate(post.published_at || post.created_at)}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                        {post.published && (
                          <Link
                            href={`/${categorySlug}/${post.slug}`}
                            target="_blank"
                            className="p-1.5 inline-block text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="View live article"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        <Link
                          href={`/admin/articles/${post.id}/edit`}
                          className="p-1.5 inline-block text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Edit article"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteModalId(post.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalId && postToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-100">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 border border-slate-200 shadow-2xl">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">Delete this article?</h3>
                <p className="text-xs text-slate-700 font-medium mt-1.5 line-clamp-2">
                  &ldquo;{postToDelete.title}&rdquo;
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  This cannot be undone. The post and its cover image (if not shared) will be permanently removed.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteModalId)}
                  disabled={loadingId === deleteModalId}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl disabled:opacity-50 flex items-center gap-1.5"
                >
                  {loadingId === deleteModalId ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Deleting...</>
                  ) : (
                    <><Trash2 className="w-3 h-3" /> Confirm Delete</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
