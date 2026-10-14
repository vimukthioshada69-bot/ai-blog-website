'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { incrementPostView } from '@/app/actions/postActions';

interface ViewCounterProps {
  slug: string;
  initialViews: number;
}

export function ViewCounter({ slug, initialViews }: ViewCounterProps) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    // Only increment once per browser session
    const storageKey = `synapse_viewed_${slug}`;
    const hasViewed = sessionStorage.getItem(storageKey);

    if (!hasViewed) {
      sessionStorage.setItem(storageKey, 'true');
      incrementPostView(slug);
      setViews((prev) => prev + 1);
    }
  }, [slug]);

  return (
    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
      <Eye className="w-3.5 h-3.5 text-slate-400" />
      <span>{views.toLocaleString()} reads</span>
    </span>
  );
}
