'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  Code, 
  Quote, 
  List, 
  Link as LinkIcon, 
  Table as TableIcon,
  Sparkles, 
  Eye, 
  Edit3, 
  Save, 
  Lock, 
  Unlock, 
  AlertCircle, 
  CheckCircle2, 
  Columns, 
  Clock, 
  User, 
  Calendar, 
  ExternalLink,
  Tag as TagIcon,
  X,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Author, Category, PostWithCategory } from '@/lib/supabase/types';
import { slugify } from '@/lib/utils';
import { ImageUpload } from './ImageUpload';
import { MarkdownRenderer } from '../post/MarkdownRenderer';
import { createPost, updatePost } from '@/app/actions/postActions';

interface PostFormProps {
  initialPost?: PostWithCategory | null;
  categories: Category[];
  authors?: Author[];
}

export function PostForm({ initialPost, categories, authors = [] }: PostFormProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialPost));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.cover_image_url || '');
  const [categoryId, setCategoryId] = useState(initialPost?.category_id || (categories[0]?.id || ''));
  const [authorId, setAuthorId] = useState(initialPost?.author_id || (authors[0]?.id || ''));
  const [sourceName, setSourceName] = useState(initialPost?.source_name || '');
  const [sourceUrl, setSourceUrl] = useState(initialPost?.source_url || '');
  const [scheduledFor, setScheduledFor] = useState(
    initialPost?.scheduled_for ? new Date(initialPost.scheduled_for).toISOString().slice(0, 16) : ''
  );
  const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [published, setPublished] = useState(initialPost?.published || false);
  const [seoTitle, setSeoTitle] = useState(initialPost?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialPost?.seo_description || '');

  const [editorTab, setEditorTab] = useState<'write' | 'preview' | 'split'>('split');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Auto-calculated reading time
  const autoReadingTime = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [content]);

  // Auto-generate slug when title changes unless locked
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
  };

  // Add tag
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/^#/, '');
      if (cleaned && !tags.includes(cleaned) && tags.length < 10) {
        setTags([...tags, cleaned]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Markdown formatting shortcuts
  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          start + prefix.length,
          start + prefix.length + (selected.length || 4)
        );
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('excerpt', excerpt);
    formData.append('content', content);
    formData.append('cover_image_url', coverImageUrl);
    formData.append('category_id', categoryId);
    formData.append('author_id', authorId);
    formData.append('reading_time', autoReadingTime.toString());
    formData.append('source_name', sourceName);
    formData.append('source_url', sourceUrl);
    formData.append('scheduled_for', scheduledFor);
    formData.append('tags', tags.join(','));
    formData.append('published', String(published));
    formData.append('seo_title', seoTitle);
    formData.append('seo_description', seoDescription);

    try {
      let res;
      if (initialPost) {
        res = await updatePost(initialPost.id, formData);
      } else {
        res = await createPost(formData);
      }

      if (res?.success) {
        showToast('success', initialPost ? 'Article updated successfully!' : 'Article published successfully!');
        router.push('/admin/articles');
        router.refresh();
      } else {
        const errorMsg = res?.error || 'Failed to save article. Please check all fields.';
        setError(errorMsg);
        showToast('error', errorMsg);
        setLoading(false);
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'An unexpected error occurred while saving the article.';
      setError(errorMsg);
      showToast('error', errorMsg);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      
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
          <button type="button" onClick={() => setToast(null)} className="ml-1 text-current opacity-50 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Form Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            {initialPost ? 'Edit Article' : 'Create New Article'}
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Full Markdown support • Real-time reading preview • Auto slug generation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 btn-ai-gradient text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Article...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{initialPost ? 'Update Article' : 'Publish Article'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start justify-between gap-3 text-rose-700 text-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error saving article: </span>
              {error}
            </div>
          </div>
          <button type="button" onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Left Column Editor, Right Column Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Title, Excerpt, Markdown Editor */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Article Title */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. The 2026 Autonomous Agent Architecture Masterclass"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-heading font-bold text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Slug Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  URL Slug *
                </label>
                <button
                  type="button"
                  onClick={() => setIsSlugManual(!isSlugManual)}
                  className="text-[11px] font-mono text-indigo-600 flex items-center gap-1 hover:underline"
                >
                  {isSlugManual ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  <span>{isSlugManual ? 'Slug Unlocked (Manual)' : 'Slug Locked (Auto)'}</span>
                </button>
              </div>
              <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono text-slate-600">
                <span className="text-slate-400">/{categories.find(c => c.id === categoryId)?.slug || 'category'}/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  disabled={!isSlugManual}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className="flex-1 bg-transparent border-none outline-none font-bold text-slate-900 ml-1"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Short Summary / Excerpt *
              </label>
              <textarea
                required
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A compelling 1-2 sentence overview of the article..."
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Markdown Content Editor */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            
            {/* Editor Toolbar & View Switcher */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              {/* Toolbar Buttons */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-200 transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-200 transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('## ')}
                  className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-200 transition-colors"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('### ')}
                  className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-200 transition-colors"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('```python\n', '\n```')}
                  className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-200 transition-colors"
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('> ')}
                  className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-200 transition-colors"
                  title="Callout / Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-200 transition-colors"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('[Link Text](', ')')}
                  className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-200 transition-colors"
                  title="Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('| Header 1 | Header 2 |\n|---|---|\n| Cell 1 | Cell 2 |\n')}
                  className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-200 transition-colors"
                  title="Markdown Table"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setEditorTab('write')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    editorTab === 'write' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('split')}
                  className={`px-2.5 py-1 rounded-lg transition-colors hidden sm:inline-flex items-center ${
                    editorTab === 'split' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5 inline mr-1" />
                  Split
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('preview')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    editorTab === 'preview' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  Preview
                </button>
              </div>
            </div>

            {/* Editor Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              
              {/* Textarea */}
              {(editorTab === 'write' || editorTab === 'split') && (
                <div className={`${editorTab === 'split' ? 'lg:col-span-6 border-r border-slate-200' : 'lg:col-span-12'} p-4`}>
                  <textarea
                    ref={textareaRef}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write article body in full GitHub-flavored markdown..."
                    className="w-full h-full min-h-[480px] p-2 bg-transparent border-none outline-none font-mono text-sm leading-relaxed resize-y text-slate-800"
                  />
                </div>
              )}

              {/* Live Preview */}
              {(editorTab === 'preview' || editorTab === 'split') && (
                <div className={`${editorTab === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} p-6 bg-slate-50/70 overflow-y-auto max-h-[600px]`}>
                  {content ? (
                    <MarkdownRenderer content={content} />
                  ) : (
                    <div className="text-center py-20 text-slate-400 font-mono text-xs">
                      Live Markdown preview will appear here...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Word Count & Auto Reading Time Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>{content.trim().split(/\s+/).filter(Boolean).length} words</span>
              <span className="flex items-center gap-1 text-indigo-600 font-bold">
                <Clock className="w-3.5 h-3.5" />
                Auto-calculated Reading Time: {autoReadingTime} min read
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Publication Status & Scheduling */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Publishing Controls
            </h3>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-xs text-slate-900 block font-heading">
                  {published ? 'Published (Live)' : 'Draft (Hidden)'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {published ? 'Visible to public readers' : 'Only visible in admin'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Scheduled For Date-Time */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Schedule Publish (Optional)</span>
              </label>
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400 font-mono mt-1">
                Post remains hidden until scheduled date-time arrives.
              </p>
            </div>
          </div>

          {/* Author Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500" />
              <span>Article Author</span>
            </h3>

            {authors.length > 0 ? (
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-xs text-slate-500">
                No authors configured. Defaulting to SYNAPSE Editorial.
              </div>
            )}
          </div>

          {/* Category Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Primary Category *
            </h3>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Source & Reference Citation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
              <span>Original Reference / Source</span>
            </h3>

            <div>
              <label className="block text-[11px] font-mono text-slate-600 mb-1">
                Source Name (e.g. arXiv, PyTorch Org)
              </label>
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="arXiv AI Research"
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-600 mb-1">
                Source URL
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://arxiv.org/abs/..."
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Featured Cover Image
            </h3>
            <ImageUpload
              value={coverImageUrl}
              onChange={(url) => setCoverImageUrl(url)}
            />
          </div>

          {/* Tags Manager */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TagIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Tags (Press Enter)</span>
            </h3>

            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="e.g. PyTorch, Agents, LLM..."
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-rose-600 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO & Meta Settings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Search Engine Optimization (SEO)
            </h3>

            <div>
              <label className="block text-[11px] font-mono text-slate-600 mb-1">
                Custom SEO Title ({seoTitle.length}/70 chars)
              </label>
              <input
                type="text"
                maxLength={70}
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || 'Auto-fallback to article title'}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-600 mb-1">
                SEO Meta Description ({seoDescription.length}/160 chars)
              </label>
              <textarea
                rows={2}
                maxLength={160}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={excerpt || 'Auto-fallback to excerpt'}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Google Search Snippet Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                Google SERP Snippet Preview
              </span>
              <div className="text-indigo-800 font-sans font-medium text-xs truncate">
                {seoTitle || title || 'Your Article Title'}
              </div>
              <div className="text-[10px] text-emerald-700 font-mono truncate">
                https://synapse-ai-2026.vercel.app/{categories.find(c => c.id === categoryId)?.slug || 'ai-news'}/{slug || 'post-slug'}
              </div>
              <div className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                {seoDescription || excerpt || 'Your article summary will display here on search engine result pages.'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
