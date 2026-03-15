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
    { href: '/pro', label: 'FOR EXPERTS' },
    { href: '/user', label: 'FOR COMMUNITY' },
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
    <div className="flex flex-col md:flex-row min-h-[100vh] w-full">
      {/* Left Block */}
      <div className="relative w-full md:flex-1 bg-white flex flex-col md:border-b-0">
        <div className="sticky top-0 z-30 bg-white p-4 md:p-8">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className={cn(
                'pb-1 border-b-2 transition-colors',
                pathname === '/'
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}>
                  <HomeIcon className='h-5 w-5' />
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
                          'text-sm font-normal transition-colors pb-1 border-b-2',
                          pathname.startsWith(link.href)
                              ? 'text-foreground font-medium border-primary'
                              : 'text-foreground/80 hover:text-foreground border-transparent'
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

        <div className="flex-grow flex flex-col justify-between">
           <div className="relative flex-grow flex flex-col justify-center items-center pt-[3%]" style={{minHeight: 'calc(100vh - 220px)'}}>
              <div className="relative w-[107.2vmin] max-w-2xl h-[107.2vmin] max-h-2xl rounded-full border border-gray-200 flex items-center justify-center">
                  <div className="w-[80%] h-[80%] rounded-full border border-gray-200 flex items-center justify-center">
                    <div className="w-[80%] h-[80%] rounded-full border border-gray-200 flex items-center justify-center">
                        <div className="w-[80%] h-[80%] rounded-full border border-gray-200"></div>
                    </div>
                  </div>
              </div>
          </div>
            
          <div className="relative text-center px-4 pb-8 pt-4">
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-4">
Відповіді на важливі питання про стосунки, життєві рішення та власний шлях.  Такі розмови допомагають подивитися на ситуацію з іншого боку, отримати нове бачення та знайти власні рішення, краще зрозуміти події, цикли та внутрішні процеси людини.
              </p>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
Ідея платформи проста: коли час, компетенція, досвід  та знання об’єднуються у змістовній розмові, виникає справжня цінність для обох сторін. Для користувачів це можливість швидко і зручно звернутися до спеціалістів з усього світу та отримати індивідуальну консультацію. Для практиків — це простір, де можна ділитися своїм досвідом, розвивати особистий бренд і перетворювати знання на стабільну професійну діяльність . 4 типи комунікації з консультацій духовних практик з усіх куточків світу , без мовного бар'єру , 24/7.
              </p>
          </div>
        </div>
      </div>
      
      {/* Center Block */}
      <div className="w-full md:w-[27.56rem] bg-white flex justify-center p-8 md:p-0">
         <div className="sticky top-[52%] h-fit text-gray-500">
            <CountdownTimer />
         </div>
      </div>

      {/* Right Block */}
      <div className="w-full md:w-1/5 bg-black relative z-10 shadow-[-12rem_0_5rem_-2.5rem_rgba(128,128,128,0.4)] flex flex-col">
        <div className="sticky top-0 z-20 bg-black p-4 text-center md:pt-8">
          <h2 className="text-white font-thin text-sm tracking-widest">LECTOR</h2>
        </div>
        <div className="flex-grow flex justify-center pt-16">
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
