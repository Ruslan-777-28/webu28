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
        <div className="bg-background px-4 md:px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-4 text-xs leading-normal text-muted-foreground/80">
            <p>Люди в усі часи шукали відповіді на важливі питання про стосунки, життєві рішення та власний шлях. У різних культурах для цього використовували духовні практики — таро, астрологію, нумерологію та інші інтуїтивні системи, які допомагають краще зрозуміти події, цикли та внутрішні процеси людини.</p>
            <p>Ця платформа створена для того, щоб поєднати людей, які шукають відповіді, з досвідченими практиками, здатними поділитися своїми знаннями та інтуїцією. Тут можна знайти онлайн консультації з таро, астрології, нумерології та інших напрямів духовної практики. Такі розмови допомагають подивитися на ситуацію з іншого боку, отримати нове бачення та знайти власні рішення.</p>
            <p>Для користувачів це можливість швидко і зручно звернутися до спеціалістів з усього світу та отримати індивідуальну консультацію. Для практиків — це простір, де можна ділитися своїм досвідом, розвивати особистий бренд і перетворювати знання на стабільну професійну діяльність.</p>
            <p>Ідея платформи проста: коли час, увага та знання об’єднуються у змістовній розмові, виникає справжня цінність для обох сторін.</p>
            <p>Відкрий для себе екосистему, де інтуїція, досвід і знання стають частиною живого обміну енергією та цінністю.</p>
          </div>
        </div>
      </div>


      {/* Right Block */}
      <div className="w-full md:w-[15%] h-screen md:sticky md:top-0 bg-black flex items-center justify-center shadow-[-30px_0_30px_-10px_rgba(0,0,0,0.4)]">
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
