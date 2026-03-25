'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Power as PowerIcon, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { useUser } from '@/hooks/use-auth';
import { UserNav } from '@/components/user-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AuthModal } from '@/components/auth-modal';
import { HeroCircleMedia } from '@/components/hero-circle-media';
import { Navigation } from '@/components/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function HomePage() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  const esotericWords = [
    { word: 'Астрологія', color: 'text-sidebar-foreground/80', margin: 'ml-4' },
    { word: 'Таро', color: 'text-sidebar-foreground/60', margin: 'ml-12' },
    { word: 'Медитація', color: 'text-sidebar-foreground', margin: 'ml-2' },
    { word: 'Психічні читання', color: 'text-sidebar-foreground/70', margin: 'ml-8' },
    { word: 'Маніфестація', color: 'text-sidebar-foreground/80', margin: 'ml-5' },
    { word: 'Нумерологія', color: 'text-sidebar-foreground/60', margin: 'ml-10' },
    { word: 'Reiki', color: 'text-sidebar-foreground', margin: 'ml-3' },
    { word: 'Тлумачення снів', color: 'text-sidebar-foreground/70', margin: 'ml-9' },
    { word: 'Чакри / energy balance', color: 'text-sidebar-foreground/80', margin: 'ml-6' },
    { word: 'Human Design', color: 'text-sidebar-foreground/60', margin: 'ml-1' },
    { word: 'Feng Shui', color: 'text-sidebar-foreground', margin: 'ml-11' },
    { word: 'Oracle cards', color: 'text-sidebar-foreground/70', margin: 'ml-7' },
    { word: 'Хіромантія', color: 'text-sidebar-foreground/80', margin: 'ml-4' },
    { word: 'Ритуали/ обряди', color: 'text-sidebar-foreground/60', margin: 'ml-12' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Left Block */}
      <div className="relative w-full md:flex-grow md:min-w-0 bg-white flex flex-col" style={{ flexBasis: '85%' }}>
        <Navigation hideBalance />
        
        {/* Main content area */}
        <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-center md:gap-16 w-full">
                {/* Circle */}
                <div className="relative w-[350px] h-[350px] md:w-[443px] md:h-[443px] flex-shrink-0">
                    <div className="absolute inset-0 rounded-full border border-border pointer-events-none z-10" />
                    <HeroCircleMedia />
                </div>
                {/* Timer */}
                <div className="flex-shrink-0 mt-8 md:mt-0">
                    <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-sm text-muted-foreground mb-2">час=енергія</p>
                        <CountdownTimer />
                        <p className="text-xs text-muted-foreground mt-2">до старту залишилось</p>
                    </div>
                </div>
            </div>
             {/* Text Block */}
            <div className="text-center text-sm text-muted-foreground max-w-5xl mt-12">
                <h2 className="text-2xl font-bold mb-8 text-foreground text-center max-w-4xl mx-auto">ВІДКРИЙ ДОСТУП ДО ЗНАНЬ БЕЗ КОРДОНІВ 24/7</h2>
                <p className="mb-4">
Платформа створена для людей, які шукають відповіді на важливі питання про стосунки, життєві рішення, особистий розвиток і власний шлях. Тут можна отримати персональні консультації, нове бачення ситуації та глибші інсайти у зручному форматі спілкування з експертами й практиками з усього світу. Ідея сервісу проста: коли час, компетенція, досвід та знання поєднуються у змістовній розмові, виникає справжня цінність для обох сторін. Платформа відкриває доступ до живої взаємодії без мовних і географічних бар’єрів, допомагає знайти фахівця під конкретний запит і створює простір для глибшого пізнання, підтримки та нових рішень. Це екосистема обміну живою енергією, сенсами та знаннями, де кожна розмова може стати точкою ясності, підтримки й нового напрямку.
                </p>
            </div>
        </main>

      </div>
      
      {/* Right Block */}
      <div className="w-full md:w-1/5 bg-sidebar relative z-10 flex flex-col">
        {/* Balance Area at the top of Sidebar */}
        <div className="p-6 md:p-8 flex justify-end items-center">
            <div className="flex items-center gap-2">
                <div className="text-xl md:text-2xl font-thin tracking-tighter text-sidebar-foreground/50 font-mono">
                    000 000.00
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="p-1 hover:bg-white/5 rounded-full transition-colors outline-none group">
                            <Info className="h-3.5 w-3.5 text-sidebar-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4 text-[11px] leading-relaxed animate-in fade-in zoom-in duration-200" align="end" sideOffset={12}>
                        <div className="space-y-2">
                            <p className="font-bold uppercase tracking-widest text-[10px]">Ваш баланс</p>
                            <p className="text-muted-foreground">
                              Це внутрішній доступний баланс вашого рахунку, що використовується для розрахунків усередині платформи LECTOR. 
                              Нарахування відбуваються внаслідок активності учасника стосовно задекларованих програм активності учасника а саме: реферальна програма, активність стосовно публікацій, рейтинг учасника на платформі. 
                              Використання можливе активуючи преміум опції на платформі в середовищі взаємодії між користувачами.
                            </p>
                            <p className="text-[10px] text-accent font-medium italic">Обмін енергоінформаційних цінностей у реальному часі.</p>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
        <div className="flex-grow flex justify-center items-start pt-12 overflow-y-auto">
            <div className="flex flex-col items-start gap-y-0 text-sidebar-foreground text-sm font-thin w-full px-12" style={{paddingTop: '10rem'}}>
                {esotericWords.map(({word, color, margin}) => (
                    <span key={word} className={cn(color, margin, 'tracking-[0.3em] font-light')}>{word}</span>
                ))}
                <span className={cn('text-sidebar-foreground/60', 'ml-12', 'tracking-[0.3em]')}>. . .</span>
            </div>
        </div>
      </div>
    </div>
  );
}
