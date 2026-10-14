'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, Copy, Check, Sparkles, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { uploadCoverImage } from '@/app/actions/postActions';

interface MediaBrowserProps {
  initialImages: string[];
}

export function MediaBrowser({ initialImages }: MediaBrowserProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadCoverImage(formData);
      if (res.success && res.data?.publicUrl) {
        setImages((prev) => [res.data.publicUrl, ...prev]);
      } else {
        setError(res.error || 'Failed to upload image to Supabase Storage.');
      }
    } catch {
      setError('An error occurred during image upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Upload Zone */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-colors text-center">
        <label className="cursor-pointer flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-sm text-slate-900 font-heading block">
              {uploading ? 'Uploading to Supabase Storage...' : 'Upload New Media Asset'}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              PNG, JPG, WebP, AVIF up to 5MB
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {error && (
          <div className="text-xs font-mono text-rose-600 mt-3">
            {error}
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-bold text-sm text-slate-900 font-heading">
            Asset Gallery ({images.length} images)
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Click &ldquo;Copy URL&rdquo; to use in articles
          </span>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-mono text-xs">
            No media assets found in gallery. Upload your first image above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((url, idx) => {
              const isCopied = copiedUrl === url;

              return (
                <div
                  key={idx}
                  className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="Media asset"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-3 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400 truncate flex-1">
                      {url.split('/').pop()}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                        isCopied
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
