import { PostWithCategory } from '@/lib/supabase/types';
import { PostCard } from '../post/PostCard';
import { Activity, Compass, Cpu } from 'lucide-react';

interface HeroSectionProps {
  post: PostWithCategory | null;
}

export function HeroSection({ post }: HeroSectionProps) {
  if (!post) return null;

  return (
    <section className="relative pt-8 sm:pt-14 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-ai-grid rounded-3xl mt-2 sm:mt-4 border border-slate-200/50 overflow-hidden">
      {/* Soft Multi-color AI Glow Blobs */}
      <div className="ai-glow-blob top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-indigo-300/40 via-violet-300/30 to-pink-300/30 blur-3xl opacity-70" />
      <div className="ai-glow-blob top-10 left-10 w-72 h-72 bg-blue-200/40 blur-3xl opacity-50" />
      <div className="ai-glow-blob bottom-10 right-10 w-80 h-80 bg-purple-200/40 blur-3xl opacity-50" />

      {/* Hero Header Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 sm:space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-indigo-200/80 text-indigo-700 text-xs font-bold font-mono tracking-wide shadow-[0_2px_12px_rgba(99,102,241,0.15)] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span>2026 ARTIFICIAL INTELLIGENCE FRONTIER</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] font-heading">
          Intelligence for the{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600">
            Next Era of AI
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
          Autonomous agent frameworks, deep learning implementation roadmaps, prompt engineering masterclasses, and the definitive directory of free AI software.
        </p>

        {/* Live AI Pulse Metrics */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 text-xs font-mono font-semibold text-slate-500">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-lg border border-slate-200/70 shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            <span>Multi-Agent Swarms</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-lg border border-slate-200/70 shadow-2xs">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>PyTorch 2.x Deep Dives</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-lg border border-slate-200/70 shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>Free Local LLMs</span>
          </div>
        </div>
      </div>

      {/* Featured Spotlight Card */}
      <div className="relative z-10 mt-10 sm:mt-14">
        <PostCard post={post} featured={true} priority={true} />
      </div>
    </section>
  );
}
