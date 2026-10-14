import Link from 'next/link';
import { Compass, ArrowRight, ExternalLink } from 'lucide-react';
import { PostWithCategory } from '@/lib/supabase/types';

interface FreeToolsSectionProps {
  posts?: PostWithCategory[];
}

export function FreeToolsSection({ posts = [] }: FreeToolsSectionProps) {
  const curatedTools = [
    {
      name: 'Ollama 2026',
      category: 'Local Model Engine',
      desc: 'Run Llama 3.3, Mistral, and DeepSeek locally on Apple Silicon or NVIDIA GPUs with zero setup.',
      badge: '100% Free & Open Source',
      url: '/free-tools',
    },
    {
      name: 'ComfyUI Flux',
      category: 'Diffusion Pipeline',
      desc: 'Modular visual graph runner for photorealistic image and video synthesis.',
      badge: 'Open Source',
      url: '/free-tools',
    },
    {
      name: 'Open WebUI',
      category: 'Full Chat & RAG Stack',
      desc: 'Self-hosted ChatGPT alternative featuring built-in web search and voice mode.',
      badge: 'Self-Hosted',
      url: '/free-tools',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden border border-indigo-900/40">
        
        {/* Subtle Ambient Glowing mesh inside banner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold border border-indigo-400/20">
              <Compass className="w-3.5 h-3.5" />
              <span>2026 FREE AI DIRECTORY</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              Curated Free AI Tools & Open-Source Repositories
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Save hundreds per month on SaaS fees. Explore verified local model engines, neural rendering pipelines, and developer copilot tools that cost $0.
            </p>
            <div className="pt-2">
              <Link
                href="/free-tools"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-ai-gradient font-bold text-xs shadow-md hover:scale-105 transition-all"
              >
                <span>Explore Free Tools Directory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {curatedTools.map((tool) => (
              <div
                key={tool.name}
                className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-indigo-400/50 hover:bg-white/15 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 block mb-1">
                    {tool.badge}
                  </span>
                  <h4 className="text-base font-bold text-white mb-1 font-heading">
                    {tool.name}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-indigo-200 text-[11px]">{tool.category}</span>
                  <Link
                    href={tool.url}
                    className="text-white hover:text-indigo-300 font-sans font-bold flex items-center gap-1"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
