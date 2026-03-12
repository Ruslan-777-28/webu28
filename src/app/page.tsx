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
        <CountdownTimer />
        <p className="mt-4 text-xs font-light text-muted-foreground">
          до старту залишилось
        </p>
        <div className="absolute bottom-4 md:bottom-8">
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-12 w-12 text-black"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.5 21C5.5 21 4 20 4 18C4 16 5 15 5.5 15.5C6 16 6 17.5 6 18C6.5 20.5 5.5 21 5.5 21ZM8.5 21C8.5 21 7 20 7 18C7 16 8 15 8.5 15.5C9 16 9 17.5 9 18C9.5 20.5 8.5 21 8.5 21ZM13.5 10C13.5 10 12.5 5 16.5 3C20.5 1 21 4.5 21 4.5C21 4.5 21.5 8 18 9.5C14.5 11 13.5 10 13.5 10ZM15 11C15 11 11 13 9 20C9 20 16 20.5 20 14C24 7.5 15 11 15 11Z"
                />
            </svg>
        </div>
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
