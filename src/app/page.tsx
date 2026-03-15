'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { useUser } from '@/hooks/use-auth';
import { UserNav } from '@/components/user-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { CountdownTimer } from '@/components/ui/countdown-timer';

export default function HomePage() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  const navLinks = [
    { href: '/pro', label: 'EXPERTS' },
    { href: '/user', label: 'USER' },
    { href: '/blog', label: 'BLOG' },
  ];

  const renderAuthControl = () => {
    if (loading) {
      return <Skeleton className="h-10 w-10 rounded-full" />;
    }
    if (user) {
      return <UserNav />;
    }
    return null;
  };

  const esotericWords = [
    { word: 'таро', color: 'text-gray-300', margin: 'ml-4' },
    { word: 'шаман', color: 'text-gray-500', margin: 'ml-12' },
    { word: 'ретрит', color: 'text-gray-200', margin: 'ml-2' },
    { word: 'рейки', color: 'text-gray-400', margin: 'ml-8' },
    { word: 'астрологія', color: 'text-gray-300', margin: 'ml-5' },
    { word: 'нумерологія', color: 'text-gray-500', margin: 'ml-10' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[160vh] w-full">
      {/* Left Block */}
      <div className="relative w-full md:flex-1 bg-white p-4 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-black/20 overflow-hidden">
        <div className="sticky top-0 z-20 bg-white -m-4 md:-m-8 p-4 md:p-8">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className={cn(pathname === '/' ? 'text-primary' : 'text-muted-foreground')}>
                  <HomeIcon className={cn('h-5 w-5 hover:text-foreground transition-colors')} />
              </Link>
              <span className="text-xs text-muted-foreground ml-4">простір обміну цінностями</span>
            </div>
          
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-4">
                  {navLinks.map((link, index) => (
                  <React.Fragment key={link.href}>
                      <Link
                      href={link.href}
                      className={cn(
                          'text-sm font-normal text-foreground/80 hover:text-primary transition-colors',
                          pathname.startsWith(link.href) && 'text-primary font-medium'
                      )}
                      >
                      {link.label}
                      </Link>
                      {index < navLinks.length - 1 && <span className="text-foreground/30">|</span>}
                  </React.Fragment>
                  ))}
              </nav>
              {renderAuthControl()}
            </div>
          </div>
        </div>


        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vmin] h-[90vmin] rounded-full border border-gray-200" />
        
        <div className="relative z-10 flex-grow flex flex-col justify-end items-center text-center pb-8">
            <p className="text-sm text-muted-foreground max-w-2xl">
 Відповіді на важливі питання про стосунки, життєві рішення та власний шлях.  Такі розмови допомагають подивитися на ситуацію з іншого боку, отримати нове бачення та знайти власні рішення, краще зрозуміти події, цикли та внутрішні процеси людини.
  Ідея платформи проста: коли час, компетенція, досвід  та знання об’єднуються у змістовній розмові, виникає справжня цінність для обох сторін. Для користувачів це можливість швидко і зручно звернутися до спеціалістів з усього світу та отримати індивідуальну консультацію. Для практиків — це простір, де можна ділитися своїм досвідом, розвивати особистий бренд і перетворювати знання на стабільну професійну діяльність . 4 типи комунікації з консультацій духовних практик з усіх куточків світу , без мовного бар'єру , 24/7.
            </p>
        </div>
      </div>
      
      {/* Center Block */}
      <div className="w-full md:w-24 bg-white flex items-center justify-center p-8 md:p-0">
         <div className="text-gray-500">
            <CountdownTimer />
         </div>
      </div>

      {/* Right Block */}
      <div className="w-full md:w-1/5 bg-black relative z-10 shadow-[-1rem_0_1.5rem_-0.5rem_rgba(128,128,128,0.4)]">
        <div className="sticky top-0 z-20 bg-black p-4 text-center md:pt-8">
          <h2 className="text-white font-thin text-sm tracking-widest">LECTOR</h2>
        </div>
        <div className="flex justify-center pt-16">
            <div className="flex flex-col items-start gap-4 text-white text-sm font-thin w-full px-4">
                {esotericWords.map(({word, color, margin}) => (
                    <span key={word} className={cn(color, margin)}>{word}</span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
