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
    <main className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      {/* Left Block Container */}
      <div className="w-full md:w-[60%] h-[50vh] md:h-full flex flex-col">
        <Navigation />

        {/* This is the gray block at the bottom */}
        <div className="bg-secondary p-4 md:p-8 flex-1"></div>
      </div>

      {/* Center Block */}
      <div className="relative w-full md:flex-1 h-[25vh] md:h-full bg-background p-4 md:p-8 flex flex-col items-center justify-center">
        <p className="mb-4 text-xs font-light text-muted-foreground">
          время=енергия=новая ценость
        </p>
        <CountdownTimer />
        <p className="mt-4 text-xs font-light text-muted-foreground">
          до старту залишилось
        </p>
      </div>

      {/* Right Block */}
      <div className="w-full md:w-[15%] h-[25vh] md:h-full bg-black flex items-center justify-center">
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
