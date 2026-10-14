import { notFound } from 'next/navigation';
import { getCategories, getAuthors, getPostById } from '@/lib/data/posts';
import { PostForm } from '@/components/admin/PostForm';

export const dynamic = 'force-dynamic';

interface EditPostProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostProps) {
  const { id } = await params;
  const [post, categories, authors] = await Promise.all([
    getPostById(id),
    getCategories(),
    getAuthors(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PostForm initialPost={post} categories={categories} authors={authors} />
    </div>
  );
}
