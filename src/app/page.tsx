'use client';

import { Navigation } from '@/components/navigation';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />
      <main className="flex-grow">
        {/* The user requested a clean page. Content will be added in subsequent steps. */}
      </main>
    </div>
  );
}
