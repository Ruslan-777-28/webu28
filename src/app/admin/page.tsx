'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-auth';

export default function AdminPage() {
  const router = useRouter();
  const { claims } = useUser();

  useEffect(() => {
    // Redirect to the highest-priority section the user can access
    if (claims?.admin || claims?.moderator) {
        router.replace('/admin/users');
    } else if (claims?.author || claims?.editor) {
        router.replace('/admin/blog');
    } else {
        // Fallback, though the layout guard should prevent this
        router.replace('/');
    }
  }, [router, claims]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
