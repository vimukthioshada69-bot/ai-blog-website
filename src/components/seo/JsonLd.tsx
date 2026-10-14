import { Author, PostWithCategory, SiteSettings, Category } from '@/lib/supabase/types';
import { getSiteUrl } from '@/lib/utils';

const DEFAULT_SITE_URL = getSiteUrl();

// ─── Website Schema with SearchAction (Sitelinks Searchbox) ──────────────
interface WebSiteJsonLdProps {
  settings?: SiteSettings | null;
  siteUrl?: string;
}

export function WebSiteJsonLd({ settings, siteUrl = DEFAULT_SITE_URL }: WebSiteJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings?.site_title || 'SYNAPSE 2026',
    alternateName: 'SYNAPSE AI',
    url: siteUrl,
    description: settings?.site_description || 'The premier destination for 2026 artificial intelligence news, deep learning explainers, autonomous agent architectures, prompt engineering tips, and curated free AI tools.',
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: settings?.site_title || 'SYNAPSE 2026',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.ico`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Enhanced Article Schema with Speakable, WordCount, FAQ ──────────────
interface ArticleJsonLdProps {
  post: PostWithCategory;
  siteUrl?: string;
}

export function ArticleJsonLd({ post, siteUrl = DEFAULT_SITE_URL }: ArticleJsonLdProps) {
  const categorySlug = post.category?.slug || 'ai-news';
  const articleUrl = `${siteUrl}/${categorySlug}/${post.slug}`;
  const coverImage = post.cover_image_url || `${siteUrl}/og-image.jpg`;
  
  // Calculate word count from content
  const wordCount = post.content ? post.content.split(/\s+/).filter(Boolean).length : 0;

  const articleSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    image: {
      '@type': 'ImageObject',
      url: coverImage,
      width: 1200,
      height: 630,
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    wordCount: wordCount,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
          url: `${siteUrl}/author/${post.author.slug}`,
          ...(post.author.avatar_url && { image: post.author.avatar_url }),
        }
      : {
          '@type': 'Organization',
          name: 'SYNAPSE AI',
          url: siteUrl,
        },
    publisher: {
      '@type': 'Organization',
      name: 'SYNAPSE AI',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.ico`,
        width: 512,
        height: 512,
      },
    },
    articleSection: post.category?.name || 'Artificial Intelligence',
    keywords: post.tags?.join(', '),
    // Speakable specification for voice assistants and AI readers
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['article h1', 'article [data-speakable]', 'article .excerpt'],
    },
    // Interaction statistics
    ...(post.view_count > 0 && {
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ReadAction',
        userInteractionCount: post.view_count,
      },
    }),
  };

  // Add about/mentions from tags for entity linking
  if (post.tags && post.tags.length > 0) {
    articleSchema.about = post.tags.map((tag) => ({
      '@type': 'Thing',
      name: tag,
    }));
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.category?.name || 'Category',
        item: `${siteUrl}/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

// ─── FAQ Schema (for articles containing Q&A or FAQ sections) ──────────────
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQJsonLdProps {
  items: FAQItem[];
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── HowTo Schema (for tutorial-type articles) ──────────────
interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

interface HowToJsonLdProps {
  title: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration e.g. "PT30M"
  siteUrl?: string;
}

export function HowToJsonLd({ title, description, steps, totalTime, siteUrl = DEFAULT_SITE_URL }: HowToJsonLdProps) {
  if (!steps || steps.length === 0) return null;

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: step.image,
        },
      }),
    })),
  };

  if (totalTime) {
    schema.totalTime = totalTime;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Organization Schema (Enhanced) ──────────────────────────────────────
interface OrganizationJsonLdProps {
  settings?: SiteSettings | null;
  siteUrl?: string;
}

export function OrganizationJsonLd({ settings, siteUrl = DEFAULT_SITE_URL }: OrganizationJsonLdProps) {
  const socialLinks = settings?.social_links
    ? Object.values(settings.social_links).filter((link): link is string => Boolean(link && typeof link === 'string'))
    : [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: settings?.site_title || 'SYNAPSE AI',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/favicon.ico`,
      width: 512,
      height: 512,
    },
    description: settings?.site_description || '2026 AI Intelligence, Technical Guides & Free Tools Directory',
    sameAs: socialLinks,
    foundingDate: '2026',
    knowsAbout: [
      'Artificial Intelligence',
      'Deep Learning',
      'Machine Learning',
      'Neural Networks',
      'Prompt Engineering',
      'Free AI Tools',
      'Autonomous Agents',
    ],
    publishingPrinciples: `${siteUrl}/about`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── CollectionPage Schema (for category & tag pages) ──────────────────────
interface CollectionPageJsonLdProps {
  title: string;
  description: string;
  url: string;
  posts: PostWithCategory[];
  siteUrl?: string;
}

export function CollectionPageJsonLd({ title, description, url, posts, siteUrl = DEFAULT_SITE_URL }: CollectionPageJsonLdProps) {
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: fullUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: 'SYNAPSE 2026',
      url: siteUrl,
    },
    numberOfItems: posts.length,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 20).map((post, index) => {
        const categorySlug = post.category?.slug || 'ai-news';
        return {
          '@type': 'ListItem',
          position: index + 1,
          url: `${siteUrl}/${categorySlug}/${post.slug}`,
          name: post.title,
        };
      }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Breadcrumb Schema ──────────────────────────────────────────────────────
export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
  siteUrl?: string;
}

export function BreadcrumbJsonLd({ items, siteUrl = DEFAULT_SITE_URL }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Person Schema (Enhanced for AI) ──────────────────────────────────────
interface PersonJsonLdProps {
  author: Author;
  siteUrl?: string;
}

export function PersonJsonLd({ author, siteUrl = DEFAULT_SITE_URL }: PersonJsonLdProps) {
  const authorUrl = `${siteUrl}/author/${author.slug}`;
  const socialLinks = author.social_links
    ? Object.values(author.social_links).filter((link): link is string => Boolean(link && typeof link === 'string'))
    : [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${authorUrl}#person`,
    name: author.name,
    description: author.bio || undefined,
    url: authorUrl,
    image: author.avatar_url || undefined,
    sameAs: socialLinks,
    jobTitle: 'AI Research Writer',
    worksFor: {
      '@type': 'Organization',
      name: 'SYNAPSE AI',
      url: siteUrl,
    },
    knowsAbout: [
      'Artificial Intelligence',
      'Deep Learning',
      'Machine Learning',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
