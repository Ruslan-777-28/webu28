import { Power } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthModal } from '@/components/auth-modal';

export default function ProPage() {
  return (
    <main className="flex flex-col md:flex-row w-full">
      <div className="w-full md:w-[85%]">
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-background">
          <div className="w-full md:w-[calc(100%*60/85)] flex flex-col">
            <Navigation />
            <div className="flex-grow flex flex-col items-center justify-center p-24">
              <h1 className="text-4xl font-bold">Experts</h1>
            </div>
          </div>
          <div className="relative w-full md:flex-1 flex flex-col items-center justify-center">
            {/* Empty block for layout consistency */}
          </div>
        </div>
      </div>

      <div className="w-full md:w-[15%] md:sticky md:top-0 h-screen bg-black flex flex-col items-center justify-center shadow-[-30px_0_30px_-10px_rgba(0,0,0,0.4)]">
        <div className="text-gray-400 text-center text-sm space-y-4 mb-8">
          <p>таро</p>
          <p>нумерологія</p>
          <p>гадання</p>
          <p>ретрит</p>
        </div>
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
        <div className="text-gray-400 text-center text-sm space-y-4 mt-8">
          <p>онлайн консультацїї</p>
          <p>цифрові товари</p>
        </div>
      </div>
    </main>
  );
}
