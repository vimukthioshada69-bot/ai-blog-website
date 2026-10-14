'use client';

import { useEffect, useRef } from 'react';

interface ViewTrackerProps {
  postId: string;
}

/**
 * Silent client component that fires a single POST /api/views on mount.
 * The API route handles: admin-skip, dedup (24h / visitor), atomic increment.
 * No visible UI — renders nothing.
 */
export function ViewTracker({ postId }: ViewTrackerProps) {
  const hasFired = useRef(false);

  useEffect(() => {
    // Guard: only fire once per page lifecycle, even in React Strict Mode double-invoke
    if (hasFired.current) return;
    hasFired.current = true;

    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId }),
      // Fire-and-forget — don't await or show errors to the user
    }).catch(() => {/* silent */});
  }, [postId]);

  return null;
}
