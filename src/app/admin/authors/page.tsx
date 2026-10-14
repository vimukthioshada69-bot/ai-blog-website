import { getAuthors, getPublishedPosts } from '@/lib/data/posts';
import { AuthorManagement } from '@/components/admin/AuthorManagement';

export const dynamic = 'force-dynamic';

export default async function AdminAuthorsPage() {
  const [authors, posts] = await Promise.all([
    getAuthors(),
    getPublishedPosts({ limit: 100 }),
  ]);

  return <AuthorManagement initialAuthors={authors} initialPosts={posts} />;
}
