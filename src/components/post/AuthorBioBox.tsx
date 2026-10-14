import Link from 'next/link';
import Image from 'next/image';
import { User, ArrowRight } from 'lucide-react';
import { Author } from '@/lib/supabase/types';
import { TwitterIcon, LinkedinIcon, GithubIcon } from '../common/SocialIcons';

interface AuthorBioBoxProps {
  author?: Author | null;
}

export function AuthorBioBox({ author }: AuthorBioBoxProps) {
  if (!author) return null;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-100/90 shadow-2xs mt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {author.avatar_url ? (
            <Image
              src={author.avatar_url}
              alt={author.name}
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border-2 border-indigo-200">
              <User className="w-8 h-8" />
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9px] font-bold shadow-2xs">
            AUTHOR
          </span>
        </div>

        {/* Bio Details */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 block">
                Written by
              </span>
              <h3 className="text-lg font-black text-slate-900 font-heading">
                <Link href={`/author/${author.slug}`} className="hover:text-indigo-600 transition-colors">
                  {author.name}
                </Link>
              </h3>
            </div>

            {/* Author Social Links */}
            {author.social_links && (
              <div className="flex items-center gap-2">
                {author.social_links.twitter && (
                  <a
                    href={author.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:text-indigo-600 border border-slate-200 transition-colors"
                    aria-label="Author Twitter"
                  >
                    <TwitterIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {author.social_links.linkedin && (
                  <a
                    href={author.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:text-indigo-600 border border-slate-200 transition-colors"
                    aria-label="Author LinkedIn"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {author.social_links.github && (
                  <a
                    href={author.social_links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:text-indigo-600 border border-slate-200 transition-colors"
                    aria-label="Author GitHub"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {author.bio || 'AI researcher and technical contributor at SYNAPSE 2026.'}
          </p>

          <div className="pt-1">
            <Link
              href={`/author/${author.slug}`}
              className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              <span>View all articles by {author.name}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
