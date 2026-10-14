'use client';

import { useState } from 'react';
import { Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { subscribeNewsletter } from '@/app/actions/contactActions';

export function NewsletterSection() {
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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-100/90 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden bg-ai-grid">
        
        {/* Ambient Glow */}
        <div className="ai-glow-blob top-0 right-0 w-80 h-80 bg-indigo-300/30 blur-3xl opacity-60" />

        <div className="relative z-10 max-w-xl text-center lg:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-ai-gradient text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weekly AI Research & Tools Dispatch</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
            Stay Ahead of the 2026 AI Frontier
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Get our curated weekly digest of breaking foundation models, open-source benchmarks, and tactical prompt architectures. Zero spam, unsubscribe anytime.
          </p>
        </div>

        <div className="relative z-10 w-full lg:w-auto flex-1 max-w-md">
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs font-mono text-xs"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-xs font-bold text-white btn-ai-gradient rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
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
    </section>
  );
}
