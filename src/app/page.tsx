import { Power } from 'lucide-react';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { Navigation } from '@/components/navigation';

export default function Home() {
  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* Left Block Container */}
      <div className="w-[60%] h-full flex flex-col">
        <Navigation />

        {/* This is the gray block at the bottom */}
        <div className="bg-secondary p-8 flex-1"></div>
      </div>

      {/* Center Block */}
      <div className="flex-1 h-full bg-background p-8 flex flex-col items-center justify-center">
        <CountdownTimer />
        <p className="mt-4 text-xs font-light text-muted-foreground">
          до старту залишилось
        </p>
      </div>

      {/* Right Block */}
      <div className="w-[15%] h-full bg-black flex items-center justify-center">
        <button className="p-4">
          <Power className="h-6 w-6 text-white" />
        </button>
      </div>
    </main>
  );
}
