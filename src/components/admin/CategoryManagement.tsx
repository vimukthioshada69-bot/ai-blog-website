'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderTree, Plus, Loader2, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { Category, PostWithCategory } from '@/lib/supabase/types';
import { createCategory } from '@/app/actions/postActions';

interface CategoryManagementProps {
  initialCategories: Category[];
  initialPosts: PostWithCategory[];
}

export function CategoryManagement({ initialCategories, initialPosts }: CategoryManagementProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [posts] = useState<PostWithCategory[]>(initialPosts);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(autoSlug);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setFormError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('description', description);

    try {
      const res = await createCategory(formData);
      if (res?.success) {
        showToast('success', `Category "${name}" created successfully!`);
        setName('');
        setSlug('');
        setDescription('');
        router.refresh();
      } else {
        setFormError(res?.error || 'Failed to create category.');
        showToast('error', res?.error || 'Failed to create category.');
      }
    } catch (err: any) {
      const msg = err?.message || 'An unexpected error occurred.';
      setFormError(msg);
      showToast('error', msg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
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

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-bold mb-1 border border-indigo-100">
          <FolderTree className="w-3.5 h-3.5" />
          <span>TOPIC TAXONOMY</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Categories & Topic Horizons
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Manage core editorial sections and taxonomy for the AI publication
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Categories List Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900 font-heading">
              Active Categories ({categories.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] font-mono font-bold text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Category Name</th>
                  <th className="px-4 py-3.5">Slug</th>
                  <th className="px-4 py-3.5">Articles</th>
                  <th className="px-6 py-3.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-mono text-xs">
                      No categories found. Create a category using the form on the right.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => {
                    const count = posts.filter((p) => p.category?.slug === cat.slug || p.category_id === cat.id).length;
                    return (
                      <tr key={cat.id} className="hover:bg-slate-50/80">
                        <td className="px-6 py-4 font-bold text-slate-900 font-heading">
                          {cat.name}
                        </td>
                        <td className="px-4 py-4 font-mono text-[11px] text-indigo-600">
                          /{cat.slug}
                        </td>
                        <td className="px-4 py-4 font-mono font-bold text-slate-700">
                          {count}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs line-clamp-1 max-w-xs">
                          {cat.description || '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Category Form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900 font-heading">
              Add New Category
            </h2>
          </div>

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Error: </span>
                {formError}
              </div>
            </div>
          )}

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Quantum AI"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="quantum-ai"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Overview of this topic horizon..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-2.5 btn-ai-gradient text-white font-bold text-xs rounded-xl shadow-xs hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {creating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Category...</span>
                </>
              ) : (
                <span>Create Category</span>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
