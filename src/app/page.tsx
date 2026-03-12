import { Power, Home as HomeIcon } from 'lucide-react';
import { CountdownTimer } from '@/components/ui/countdown-timer';

export default function Home() {
  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* Left Block Container */}
      <div className="w-[60%] h-full flex flex-col">
        {/* Header for the left block */}
        <div className="p-8 flex justify-between items-center">
          <HomeIcon className="h-6 w-6" />
          <div className="flex items-center gap-4 text-xs font-light">
            <span>PRO</span>
            <span className="text-muted-foreground">|</span>
            <span>USER</span>
            <span className="text-muted-foreground">|</span>
            <span>BLOG</span>
          </div>
        </div>

        {/* This is the gray block at the bottom */}
        <div className="bg-secondary p-8 flex-1"></div>
      </div>

      {/* Center Block */}
      <div className="flex-1 h-full bg-background p-8 flex items-center justify-center">
        <CountdownTimer />
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
