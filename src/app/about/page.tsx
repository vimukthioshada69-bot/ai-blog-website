import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Compass, 
  Gamepad2, 
  Zap, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

import { getPageContent } from '@/lib/data/posts';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('about');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://synapse-ai-2026.vercel.app';
  const canonicalUrl = `${baseUrl}/about`;
  const title = content?.seo_title || content?.title || 'About SYNAPSE | 2026 AI Journalism & Research';
  const description = content?.seo_description || content?.banner_text || 'Learn about our mission to provide deep, verified, reproducible artificial intelligence journalism and open-source tooling.';
  const ogImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'SYNAPSE 2026',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function AboutPage() {
  const pillars = [
    {
      icon: Cpu,
      title: 'Deep Technical Rigor',
      desc: 'We unpack the actual mathematical foundations, tensor dynamics, and inference mechanics behind modern neural architectures.',
    },
    {
      icon: ShieldCheck,
      title: 'Reproducible Benchmarks',
      desc: 'No vague marketing hype. Every prompt pattern, API invocation, and local model benchmark is tested on live clusters.',
    },
    {
      icon: Compass,
      title: 'Democratizing Free Tools',
      desc: 'We tirelessly curate free and open-source models, CLI utilities, and UI tools to make AI accessible without expensive paywalls.',
    },
    {
      icon: Terminal,
      title: 'Pragmatic Engineering',
      desc: 'Actionable code snippets, production deployment roadmaps, and reliable multi-agent architectures ready for production.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Schema.org BreadcrumbList Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ]}
      />
      
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EDITORIAL MISSION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Deciphering the Intelligence Revolution for 2026
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          SYNAPSE was founded to bridge the gap between bleeding-edge machine learning research and practical software engineering.
        </p>
      </section>

      {/* Narrative Section */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6 text-slate-700 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Why 2026 Demands a New Standard in AI Media
        </h2>
        <p>
          In the early waves of generative AI (2022–2024), simple prompt tricks and shallow API wrappers dominated the conversation. In 2026, artificial intelligence has evolved into autonomous multi-agent cognitive loops, real-time neural radiance rendering in video games, and local open-source models executing high-throughput inference on personal workstations.
        </p>
        <p>
          Developers, researchers, and tech leaders need more than generic summaries. They need rigorous architectural teardowns, production-ready PyTorch implementations, verified prompt optimization frameworks, and zero-cost tooling catalogs.
        </p>
      </section>

      {/* Core Editorial Pillars */}
      <section className="space-y-6" id="standards">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900">Our Core Publishing Pillars</h2>
          <p className="text-xs text-slate-500 mt-1">How we ensure exceptional quality across all articles.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{pillar.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Topics Covered */}
      <section className="bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/60 rounded-3xl p-8 sm:p-12 border border-indigo-100 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Coverage Horizons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <span><strong>Autonomous Agents:</strong> Multi-agent orchestration loops and tool synthesis.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <span><strong>Deep Learning Tutorials:</strong> Zero-to-hero roadmaps and PyTorch pipelines.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <span><strong>Free Tools Directory:</strong> Zero-cost local LLM runtimes and web interfaces.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <span><strong>Neural Gaming & Rendering:</strong> Real-time Gaussian splatting and SLM game NPCs.</span>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600"
          >
            Explore Latest Articles →
          </Link>
        </div>
      </section>

    </div>
  );
}
