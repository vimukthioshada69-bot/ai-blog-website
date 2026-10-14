import { Metadata } from 'next';
import { 
  getPublishedPosts, 
  getCategories, 
  getTrendingPosts,
  getCategoryPreviewPosts,
  getSiteSettings
} from '@/lib/data/posts';
import { HeroSection } from '@/components/home/HeroSection';
import { LatestFeedSection } from '@/components/home/LatestFeedSection';
import { CategoryRowSection } from '@/components/home/CategoryRowSection';
import { FreeToolsSection } from '@/components/home/FreeToolsSection';
import { TrendingSection } from '@/components/home/TrendingSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/utils';

export const revalidate = 60; // Incremental Static Regeneration every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl = getSiteUrl();
  const title = settings?.site_title || 'SYNAPSE 2026';
  const description = settings?.site_description || 'The premier destination for 2026 artificial intelligence news, deep learning explainers, autonomous agent architectures, prompt engineering tips, and curated free AI tools.';
  const ogImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

  return {
    title: `${title} | AI News, Technical Guides & Free Tools Directory`,
    description,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: `${title} | 2026 AI Intelligence, Technical Guides & Free Tools`,
      description,
      url: baseUrl,
      type: 'website',
      siteName: title,
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
      title: `${title} | 2026 AI Intelligence & Deep Learning`,
      description,
      images: [ogImage],
    },
  };
}

export default async function HomePage() {
  const [
    allPosts, 
    categories, 
    trendingPosts,
    aiNewsPosts,
    learnAiPosts,
    freeToolsPosts,
    gamingTechPosts,
    settings
  ] = await Promise.all([
    getPublishedPosts({ limit: 12 }),
    getCategories(),
    getTrendingPosts(6),
    getCategoryPreviewPosts('ai-news', 4),
    getCategoryPreviewPosts('learn-ai', 4),
    getCategoryPreviewPosts('free-tools', 4),
    getCategoryPreviewPosts('gaming-tech', 4),
    getSiteSettings()
  ]);

  const featuredPost = allPosts[0] || null;
  const latestPostsFeed = allPosts.slice(1, 7);

  const aiNewsCategory = categories.find((c) => c.slug === 'ai-news') || {
    id: '1',
    name: 'AI News',
    slug: 'ai-news',
    description: 'Breaking developments, foundation model releases, and industry shifts in artificial intelligence.',
  };

  const learnAiCategory = categories.find((c) => c.slug === 'learn-ai' || c.slug === 'deep-learning') || {
    id: '2',
    name: 'Learn AI / Deep Learning',
    slug: 'learn-ai',
    description: 'Comprehensive beginner-to-advanced guides for mastering modern deep learning and neural networks.',
  };

  const freeToolsCategory = categories.find((c) => c.slug === 'free-tools') || {
    id: '3',
    name: 'Free AI Tools',
    slug: 'free-tools',
    description: 'Handpicked directory of open-source and free AI tools, APIs, and productivity boosters.',
  };

  const gamingTechCategory = categories.find((c) => c.slug === 'gaming-tech') || {
    id: '4',
    name: 'Gaming & Tech AI',
    slug: 'gaming-tech',
    description: 'How AI is revolutionizing interactive gaming, neural rendering, procedural worlds, and hardware.',
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Schema.org Organization Structured Data */}
      <OrganizationJsonLd settings={settings} />

      {/* Schema.org WebSite with Sitelinks SearchBox for AI & Google Search */}
      <WebSiteJsonLd settings={settings} />

      {/* 1. Hero Section: Latest/most important post with featured image & relative time */}
      <HeroSection post={featuredPost} />

      {/* 2. Latest Posts: Chronological feed with relative timestamps */}
      <LatestFeedSection posts={latestPostsFeed} />

      {/* 3. AI News: Category preview row (4-6 posts, "View all" link) */}
      <CategoryRowSection
        category={aiNewsCategory}
        posts={aiNewsPosts}
      />

      {/* 4. Learn AI / Deep Learning: Category preview row */}
      <CategoryRowSection
        category={learnAiCategory}
        posts={learnAiPosts}
      />

      {/* 5. Free Tools: Category preview row & Directory Showcase */}
      <CategoryRowSection
        category={freeToolsCategory}
        posts={freeToolsPosts}
      />
      <FreeToolsSection posts={freeToolsPosts} />

      {/* 6. Gaming & Tech AI: Secondary Category preview row (compact) */}
      <CategoryRowSection
        category={gamingTechCategory}
        posts={gamingTechPosts}
        isSecondary={true}
      />

      {/* 7. Trending: Top posts by view_count, "Most viewed this week" */}
      <TrendingSection posts={trendingPosts} />

      {/* 8. Newsletter CTA Section */}
      <NewsletterSection />

    </div>
  );
}
