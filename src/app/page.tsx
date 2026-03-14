'use client';

import { Navigation } from '@/components/navigation';

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <main className="flex-grow flex w-full">
        {/* Left Block (40%) */}
        <div className="w-2/5 bg-muted">
          {/* This is the left-side block. Content can be added here later. */}
        </div>
        
        {/* Center Block (40%) */}
        <div className="w-2/5 bg-card">
           {/* This is the center block. Content can be added here later. */}
        </div>

        {/* Right Block (20%) */}
        <div className="w-1/5 bg-black">
          {/* This is the right-side block. Content can be added here later. */}
        </div>
      </main>
    </div>
  );
}
