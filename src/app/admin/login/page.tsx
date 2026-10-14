'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import { loginAdmin, AuthState } from '@/app/actions/authActions';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [state, setState] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setState(null);

    const formData = new FormData(e.currentTarget);
    formData.append('redirectTo', redirectTo);

    try {
      const res = await loginAdmin(null, formData);
      if (res?.error) {
        setState(res);
      }
    } catch {
      // In Next.js, redirect() throws an error to perform redirect
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {state?.error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="email"
            name="email"
            required
            defaultValue="admin@example.com"
            placeholder="admin@example.com"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Password
        </label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
      >
        {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs border border-indigo-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs text-slate-500">
            Sign in with your Supabase Admin credentials to manage publications.
          </p>
        </div>

        {/* Suspense Wrapper for useSearchParams */}
        <Suspense fallback={<div className="text-center py-6 text-xs text-slate-400 font-mono">Loading authentication portal...</div>}>
          <LoginForm />
        </Suspense>

        {/* Footer & Back Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/"
            className="hover:text-indigo-600 flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Public Site</span>
          </Link>
          <span>SYNAPSE 2026</span>
        </div>
      </div>
    </div>
  );
}
