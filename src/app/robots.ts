import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/utils';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      // Default rules for all crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      // Google AI Overview / Gemini
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      // Google Search Bot
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      // OpenAI's GPTBot (ChatGPT Search / SearchGPT)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      // OpenAI ChatGPT-User (direct browsing)
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      // Anthropic Claude Web Search
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      // Perplexity AI Search
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      // Apple Siri / Spotlight
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
      },
      // Bing / Microsoft Copilot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      // Meta AI
      {
        userAgent: 'FacebookBot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      {
        userAgent: 'meta-externalagent',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      // Brave Search AI
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      // You.com AI
      {
        userAgent: 'YouBot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      // Cohere AI
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
