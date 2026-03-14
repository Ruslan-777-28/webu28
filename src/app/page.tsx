'use client';

import { Navigation } from '@/components/navigation';

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <Navigation />
      <main className="flex-grow flex">
        <div className="w-4/5 flex items-center justify-center">
        </div>
        <div className="w-1/5 bg-black h-full">
          {/* This is the right-side block. Content can be added here later. */}
        </div>
      </main>
    </div>
  );
}
