import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getPublishedPosts, getSiteSettings } from '@/lib/data/posts';
import { WebSiteJsonLd } from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/utils';

import { PerformanceFix } from '@/components/common/PerformanceFix';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SYNAPSE 2026 | AI News, Technical Guides & Free Tools Directory',
    template: '%s | SYNAPSE AI 2026',
  },
  description:
    'The premier destination for 2026 artificial intelligence news, deep learning explainers, autonomous agent architectures, prompt engineering tips, and curated free AI tools.',
  keywords: [
    'AI News 2026',
    'Deep Learning Tutorials',
    'Autonomous AI Agents',
    'Free AI Tools Directory',
    'Prompt Engineering',
    'PyTorch 2026',
    'Neural Rendering',
    'Machine Learning',
    'AI Tools',
    'LLM',
    'GPT',
    'Artificial Intelligence Blog',
  ],
  authors: [{ name: 'SYNAPSE Editorial Team', url: siteUrl }],
  creator: 'SYNAPSE AI',
  publisher: 'SYNAPSE Media',
  category: 'Technology',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'SYNAPSE 2026 AI News',
    title: 'SYNAPSE 2026 | AI News, Technical Guides & Free Tools Directory',
    description:
      'Explore cutting-edge 2026 AI breakthroughs, multi-agent frameworks, free developer tools, and deep learning roadmaps.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'SYNAPSE 2026 AI Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SYNAPSE 2026 | AI News & Guides',
    description:
      'Curated 2026 AI news, technical deep learning explainers, and free tools directory.',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    // AI content declaration meta tags
    'ai-content-declaration': 'human-authored',
    'content-language': 'en',
    // Allow AI reading
    'robots': 'max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [posts, settings] = await Promise.all([
    getPublishedPosts({ limit: 20 }),
    getSiteSettings(),
  ]);

  return (
    <html lang="en" dir="ltr" className={`scroll-smooth ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* llms.txt for AI discovery */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt - AI Content Discovery" />
        
        {/* RSS Feed auto-discovery for AI content monitoring */}
        <link rel="alternate" type="application/rss+xml" title="SYNAPSE 2026 RSS Feed" href="/api/rss" />
        
        {/* Schema.org WebSite with SearchAction for Sitelinks Searchbox */}
        <WebSiteJsonLd settings={settings} />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900 font-sans">
        <PerformanceFix />
        <Navbar posts={posts} />
        <main className="flex-1" role="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
