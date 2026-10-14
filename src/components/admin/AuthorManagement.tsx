'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Plus, User, Trash2, Loader2, CheckCircle2, AlertTriangle, AlertCircle, X, ExternalLink } from 'lucide-react';
import { Author, PostWithCategory } from '@/lib/supabase/types';
import { createAuthor, deleteAuthor } from '@/app/actions/postActions';

interface AuthorManagementProps {
  initialAuthors: Author[];
  initialPosts: PostWithCategory[];
}

export function AuthorManagement({ initialAuthors, initialPosts }: AuthorManagementProps) {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [posts, setPosts] = useState<PostWithCategory[]>(initialPosts);

  // Creation form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Deletion modal state
  const [deleteModalAuthor, setDeleteModalAuthor] = useState<Author | null>(null);
  const [replacementAuthorId, setReplacementAuthorId] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

  // Toast notification
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
    formData.append('avatar_url', avatarUrl);
    formData.append('bio', bio);
    formData.append('twitter', twitter);
    formData.append('github', github);
    formData.append('linkedin', linkedin);
    formData.append('website', website);

    try {
      const res = await createAuthor(formData);
      if (res?.success) {
        showToast('success', `Author "${name}" created successfully!`);
        setName('');
        setSlug('');
        setAvatarUrl('');
        setBio('');
        setTwitter('');
        setGithub('');
        setLinkedin('');
        setWebsite('');
        router.refresh();
      } else {
        setFormError(res?.error || 'Failed to create author profile.');
        showToast('error', res?.error || 'Failed to create author.');
      }
    } catch (err: any) {
      const msg = err?.message || 'An unexpected error occurred.';
      setFormError(msg);
      showToast('error', msg);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAuthor = async () => {
    if (!deleteModalAuthor) return;
    setDeleting(true);

    try {
      const res = await deleteAuthor(deleteModalAuthor.id);
      if (res?.success) {
        setAuthors((prev) => prev.filter((a) => a.id !== deleteModalAuthor.id));
        showToast('success', `Author "${deleteModalAuthor.name}" deleted.`);
        setDeleteModalAuthor(null);
        router.refresh();
      } else {
        showToast('error', res?.error || 'Failed to delete author.');
      }
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to delete author.');
    } finally {
      setDeleting(false);
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
          <Users className="w-3.5 h-3.5" />
          <span>CONTRIBUTOR ROSTER</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Authors & Researchers
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Manage AI research contributors, credentials, biographies, and social handles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Authors List */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="font-bold text-sm text-slate-900 font-heading">
            Active Contributors ({authors.length})
          </h2>

          <div className="space-y-3">
            {authors.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 font-mono text-xs">
                No authors found. Create the first author profile using the form.
              </div>
            ) : (
              authors.map((author) => {
                const count = posts.filter((p) => p.author?.slug === author.slug || p.author_id === author.id).length;

                return (
                  <div
                    key={author.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      {author.avatar_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={author.avatar_url}
                          alt={author.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">
                          <User className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 font-heading">
                            {author.name}
                          </h3>
                          <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            /author/{author.slug}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 max-w-md">
                          {author.bio || 'AI contributor and researcher at SYNAPSE 2026.'}
                        </p>
                        <div className="text-[11px] font-mono text-slate-400 pt-1">
                          {count} {count === 1 ? 'Article published' : 'Articles published'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        href={`/author/${author.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setDeleteModalAuthor(author);
                          const others = authors.filter((a) => a.id !== author.id);
                          if (others.length > 0) setReplacementAuthorId(others[0].id);
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Author"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Create Author Form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900 font-heading">
              Add Author Profile
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

          <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Dr. Maya Patel"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dr-maya-patel"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio & research areas..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block font-mono text-[10px] uppercase text-slate-500 mb-0.5">
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase text-slate-500 mb-0.5">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase text-slate-500 mb-0.5">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/..."
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase text-slate-500 mb-0.5">
                  Website URL
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-2.5 mt-2 btn-ai-gradient text-white font-bold text-xs rounded-xl shadow-xs hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {creating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Author Profile...</span>
                </>
              ) : (
                <span>Create Author</span>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalAuthor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 border border-slate-200 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Delete author profile?
              </h3>
              <p className="text-xs text-slate-700 font-medium mt-1.5">
                &ldquo;{deleteModalAuthor.name}&rdquo;
              </p>
              <p className="text-xs text-slate-500 mt-1">
                This will remove the author from the contributor roster.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalAuthor(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAuthor}
                disabled={deleting}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3 h-3" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
