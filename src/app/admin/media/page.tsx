import { Image as ImageIcon, Sparkles, Upload } from 'lucide-react';
import { getAllPostsForAdmin } from '@/lib/data/posts';
import { MediaBrowser } from '@/components/admin/MediaBrowser';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const posts = await getAllPostsForAdmin();
  
  // Collect all unique cover image URLs from existing posts
  const coverImages = Array.from(
    new Set(posts.map((p) => p.cover_image_url).filter(Boolean) as string[])
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-bold mb-1 border border-indigo-100">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>STORAGE BUCKET: blog-images</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Media & Asset Library
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Upload and manage high-resolution cover photos, neural renders, and article diagrams
        </p>
      </div>

      {/* Interactive Media Browser & Uploader */}
      <MediaBrowser initialImages={coverImages} />
    </div>
  );
}
