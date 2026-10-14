'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Send, CheckCircle2, Shield, Rss } from 'lucide-react';
import { TwitterIcon, LinkedinIcon, GithubIcon } from '../common/SocialIcons';
import { subscribeNewsletter } from '@/app/actions/contactActions';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('email', email);

    try {
      const res = await subscribeNewsletter(null, formData);
      setStatus(res);
      if (res.success) {
        setEmail('');
      }
    } catch {
      setStatus({ error: 'Failed to subscribe. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { label: 'AI News', href: '/ai-news' },
    { label: 'Learn AI', href: '/learn-ai' },
    { label: 'Deep Learning', href: '/deep-learning' },
    { label: 'Free AI Tools', href: '/free-tools' },
    { label: 'Gaming & Tech AI', href: '/gaming-tech' },
    { label: 'Prompt Engineering', href: '/prompt-engineering' },
  ];

  const quickLinks = [
    { label: 'About Synapse', href: '/about' },
    { label: 'Editorial Standards', href: '/about#standards' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Search Archives', href: '/search' },
    { label: 'Admin Portal', href: '/admin' },
  ];

  return (
    <footer className="bg-slate-50/80 border-t border-slate-200/80 text-slate-600 mt-auto relative overflow-hidden">
      
      {/* Background AI grid texture */}
      <div className="absolute inset-0 bg-ai-grid opacity-30 pointer-events-none" />

      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 border-b border-slate-200/60 relative z-10">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-100/90 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="max-w-xl text-center lg:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-ai-gradient text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Weekly AI Research & Tools Dispatch</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
              Stay ahead of the 2026 AI Frontier
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Curated weekly digest of breaking foundation models, open-source benchmarks, and tactical prompt architectures.
            </p>
          </div>

          <div className="w-full lg:w-auto flex-1 max-w-md">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email (e.g. name@company.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 text-sm bg-white rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs font-mono text-xs"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 text-xs font-bold text-white btn-ai-gradient rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {status?.success && (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 mt-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{status.message}</span>
              </div>
            )}
            {status?.error && (
              <div className="text-xs font-medium text-rose-600 mt-2.5">
                {status.error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
                SYNAPSE <span className="text-indigo-600">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              The premier destination for 2026 AI news, technical deep learning explainers, free tool discoveries, and autonomous software architecture guides.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-2xs transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-2xs transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-2xs transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <Link
                href="/sitemap.xml"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-2xs transition-colors"
                aria-label="Sitemap XML"
                title="Sitemap XML"
              >
                <Rss className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Categories Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Coverage Topics
            </h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Editorial & Legal
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 2026 AI Ethics badge */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Standards
            </h4>
            <div className="p-4 rounded-2xl glass-card border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-heading">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Verified 2026 Standards</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                All benchmark code, prompt strategies, and technical roadmaps are rigorously tested on production clusters before publication.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>© 2026 SYNAPSE AI Publication. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Next.js 15 • Tailwind • Supabase</span>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-indigo-600">
              Admin Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
