'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  Zap, 
  GraduationCap, 
  Cpu, 
  Compass, 
  Gamepad2,
  Terminal,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { SearchModal } from '../search/SearchModal';
import { PostWithCategory } from '@/lib/supabase/types';

interface NavbarProps {
  posts?: PostWithCategory[];
}

export function Navbar({ posts = [] }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  // Scroll listener for dynamic elevation & backdrop glow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'AI News', href: '/ai-news', icon: Zap, desc: 'Foundation models & breakthroughs' },
    { label: 'Learn AI', href: '/learn-ai', icon: GraduationCap, desc: 'Zero-to-hero learning roadmaps' },
    { label: 'Deep Learning', href: '/deep-learning', icon: Cpu, desc: 'Transformers & neural research' },
    { label: 'Free Tools', href: '/free-tools', icon: Compass, desc: 'Open-source local AI directory' },
    { label: 'Gaming & Tech', href: '/gaming-tech', icon: Gamepad2, desc: 'Neural rendering & game AI' },
    { label: 'Prompts', href: '/prompt-engineering', icon: Terminal, desc: 'Tactical system metaprompting' },
  ];

  const secondaryLinks = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'All Search', href: '/search' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(99,102,241,0.08)]'
            : 'bg-white/75 backdrop-blur-lg border-b border-slate-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
            
            {/* 1. Logo & AI Pulse Badge */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-[0_0_18px_rgba(99,102,241,0.38)] group-hover:shadow-[0_0_24px_rgba(99,102,241,0.6)] group-hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                </div>
                {/* Glowing status dot */}
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-heading group-hover:text-indigo-600 transition-colors">
                    SYNAPSE
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border border-indigo-200/70 shadow-2xs font-mono">
                    2026
                  </span>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 font-mono -mt-0.5 hidden sm:inline">
                  AI Intelligence & News
                </span>
              </div>
            </Link>

            {/* 2. Desktop Navigation (≥1024px) - Ultra-compact, single row */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-1 justify-center max-w-2xl px-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50/90 shadow-2xs border border-indigo-100/80 font-bold'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70 hover:border-slate-200/60 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 3. Action Controls: Search, Admin, Hamburger */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
              
              {/* Search Trigger Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-slate-600 bg-white/90 hover:bg-indigo-50/50 border border-slate-200/90 hover:border-indigo-300 rounded-xl shadow-2xs transition-all group"
                title="Search AI Articles (⌘K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span className="hidden xl:inline text-slate-500 group-hover:text-slate-700">Search AI...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-50 rounded border border-slate-200">
                  ⌘K
                </kbd>
              </button>

              {/* Admin Portal Button */}
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-[0_2px_10px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.45)] active:scale-95 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>

              {/* Hamburger Menu Toggle (Visible for Tablet & Mobile <1024px) */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-700 hover:text-indigo-600 rounded-xl hover:bg-slate-100/80 border border-slate-200/80 transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 4. Slide-in Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer Panel */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250 z-10">
            
            {/* Drawer Header */}
            <div>
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 font-heading">
                      SYNAPSE AI 2026
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Explore Topics & Directory
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Integrated Search Input in Mobile Drawer */}
              <div className="p-4 border-b border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-indigo-50/40 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-indigo-500" />
                    <span>Search AI articles & tools...</span>
                  </span>
                  <span className="px-1.5 py-0.5 bg-white text-[10px] font-mono text-slate-400 rounded border border-slate-200">
                    ⌘K
                  </span>
                </button>
              </div>

              {/* Category Links Stack */}
              <div className="p-4 space-y-1.5">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Browse Coverage
                </div>

                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                          : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-indigo-50/80 text-indigo-600'
                        }`}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {link.label}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {link.desc}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer / Secondary Links */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600">
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Admin Portal</span>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Global Interactive Search Modal (⌘K) */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        posts={posts}
      />
    </>
  );
}
