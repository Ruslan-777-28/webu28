import { Power } from 'lucide-react';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { Navigation } from '@/components/navigation';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthModal } from '@/components/auth-modal';

export default function HomePage() {
  return (
    <main className="flex flex-col md:flex-row w-full">
      <div className="w-full md:w-[85%]">
        <div className="flex flex-col md:flex-row w-full md:h-screen">
          {/* Left Block Container */}
          <div className="w-full md:w-[calc(100%*60/85)] h-[50vh] md:h-full flex flex-col bg-background">
            <Navigation />

            {/* This is the image block at the bottom */}
            <div className="p-4 md:p-8 flex-1 flex items-center justify-center">
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
                <g stroke="white" strokeWidth="0.5" fill="none">
                  <circle cx="50" cy="50" r="35" />
                </g>
                <circle cx="50" cy="50" r="49.5" stroke="white" strokeWidth="0.5" fill="none" />
              </svg>
            </div>
          </div>

          {/* Center Block */}
          <div className="relative w-full md:flex-1 h-[25vh] md:h-full bg-background p-4 md:p-8 flex flex-col items-center justify-center">
            <p className="mb-4 text-xs font-light text-muted-foreground text-center">
              время=енергия<br />новая ценость
            </p>
            <CountdownTimer />
            <p className="mt-4 text-xs font-light text-muted-foreground">
              до старту залишилось
            </p>
          </div>
        </div>
        <div className="h-[60vh] bg-background" />
      </div>


      {/* Right Block */}
      <div className="w-full md:w-[15%] h-[25vh] md:h-screen md:sticky md:top-0 bg-black flex items-center justify-center shadow-[-30px_0_30px_-10px_rgba(0,0,0,0.4)]">
        <Dialog>
          <DialogTrigger asChild>
            <button className="p-4">
              <Power className="h-6 w-6 text-white" />
            </button>
          </DialogTrigger>
          <DialogContent className="w-[90%] sm:max-w-[425px]">
            <AuthModal />
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
