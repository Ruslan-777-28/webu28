'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContentAdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first (and currently only) content page
    router.replace('/admin/content/pro');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Redirecting to content management...</p>
    </div>
  );
}
