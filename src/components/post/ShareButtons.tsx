'use client';

import { useState } from 'react';
import { Link as LinkIcon, Check } from 'lucide-react';
import { TwitterIcon, LinkedinIcon, RedditIcon, WhatsAppIcon } from '../common/SocialIcons';

interface ShareButtonsProps {
  title: string;
  slug: string;
  categorySlug?: string;
}

export function ShareButtons({ title, slug, categorySlug = 'ai-news' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${categorySlug}/${slug}`;
    }
    return `https://synapse-ai-2026.vercel.app/${categorySlug}/${slug}`;
  };

  const shareUrl = encodeURIComponent(getUrl());
  const shareText = encodeURIComponent(`"${title}" via SYNAPSE 2026 AI:`);

  const handleCopy = () => {
    navigator.clipboard.writeText(getUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
        Share:
      </span>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-2xs hover:shadow-xs transition-all"
        title="Share on X"
        aria-label="Share on X"
      >
        <TwitterIcon className="w-4 h-4" />
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-2xs hover:shadow-xs transition-all"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <LinkedinIcon className="w-4 h-4" />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 shadow-2xs hover:shadow-xs transition-all"
        title="Share on WhatsApp"
        aria-label="Share on WhatsApp"
      >
        <WhatsAppIcon className="w-4 h-4" />
      </a>

      {/* Reddit */}
      <a
        href={`https://reddit.com/submit?url=${shareUrl}&title=${shareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-2xs hover:shadow-xs transition-all hidden sm:inline-flex"
        title="Share on Reddit"
        aria-label="Share on Reddit"
      >
        <RedditIcon className="w-4 h-4" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-2xs hover:shadow-xs transition-all text-xs font-mono font-medium"
        title="Copy article link"
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600 font-bold">Copied!</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
