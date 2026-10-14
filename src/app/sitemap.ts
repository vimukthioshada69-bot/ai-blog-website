import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/utils';
import { 
  getPublishedPosts, 
  getCategories, 
  getAuthors, 
  getAllTags, 
  getAllStaticPages 
} from '@/lib/data/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const [posts, categories, authors, tags, staticPages] = await Promise.all([
    getPublishedPosts({ limit: 500 }),
    getCategories(),
    getAuthors(),
    getAllTags(),
    getAllStaticPages(),
  ]);

  // 1. Homepage
  const homeRoute: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/author`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. Static pages from page_content table
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const staticPageRoutes: MetadataRoute.Sitemap = staticPages
    // Exclude keys that duplicate category slugs if stored in page_content
    .filter((sp) => !categorySlugs.has(sp.page_key))
    .map((page) => ({
      url: `${baseUrl}/${page.page_key}`,
      lastModified: new Date(page.updated_at || new Date()),
      changeFrequency: 'monthly',
      priority: page.page_key === 'about' || page.page_key === 'contact' ? 0.8 : 0.7,
    }));

  // Ensure 'about' and 'contact' exist even if page_content hasn't returned them
  const staticUrls = new Set(staticPageRoutes.map((r) => r.url));
  if (!staticUrls.has(`${baseUrl}/about`)) {
    staticPageRoutes.push({
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }
  if (!staticUrls.has(`${baseUrl}/contact`)) {
    staticPageRoutes.push({
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // 3. Category routes (/[category-slug]/)
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 4. Post routes (/[category-slug]/[post-slug]/) with lastModified from updated_at
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    const categorySlug = post.category?.slug || 'ai-news';
    return {
      url: `${baseUrl}/${categorySlug}/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at),
      changeFrequency: 'weekly',
      priority: 0.9,
    };
  });

  // 5. Author routes (/author/[author-slug]/)
  const authorRoutes: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${baseUrl}/author/${author.slug}`,
    lastModified: new Date(author.created_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  // 6. Tag routes (/tag/[tag-slug]/)
  const tagRoutes: MetadataRoute.Sitemap = tags.map(({ tag }) => ({
    url: `${baseUrl}/tag/${encodeURIComponent(tag.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.65,
  }));

  return [
    ...homeRoute,
    ...staticPageRoutes,
    ...categoryRoutes,
    ...postRoutes,
    ...authorRoutes,
    ...tagRoutes,
  ];
}
