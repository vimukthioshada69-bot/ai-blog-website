import { getCategories, getPublishedPosts } from '@/lib/data/posts';
import { CategoryManagement } from '@/components/admin/CategoryManagement';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const [categories, posts] = await Promise.all([
    getCategories(),
    getPublishedPosts({ limit: 100 }),
  ]);

  return <CategoryManagement initialCategories={categories} initialPosts={posts} />;
}
