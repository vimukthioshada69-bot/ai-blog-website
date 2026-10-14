import { getCategories, getAuthors } from '@/lib/data/posts';
import { PostForm } from '@/components/admin/PostForm';

export const dynamic = 'force-dynamic';

export default async function CreateArticlePage() {
  const [categories, authors] = await Promise.all([
    getCategories(),
    getAuthors(),
  ]);

  return (
    <div className="space-y-6">
      <PostForm categories={categories} authors={authors} />
    </div>
  );
}
