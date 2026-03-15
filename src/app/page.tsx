'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Power as PowerIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { useUser } from '@/hooks/use-auth';
import { UserNav } from '@/components/user-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { Button } from '@/components/ui/button';

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
    { word: 'Астрологія', color: 'text-gray-300', margin: 'ml-4' },
    { word: 'Таро', color: 'text-gray-500', margin: 'ml-12' },
    { word: 'Медитація', color: 'text-gray-200', margin: 'ml-2' },
    { word: 'Психічні читання', color: 'text-gray-400', margin: 'ml-8' },
    { word: 'Маніфестація', color: 'text-gray-300', margin: 'ml-5' },
    { word: 'Нумерологія', color: 'text-gray-500', margin: 'ml-10' },
    { word: 'Reiki', color: 'text-gray-200', margin: 'ml-3' },
    { word: 'Тлумачення снів', color: 'text-gray-400', margin: 'ml-9' },
    { word: 'Чакри / energy balance', color: 'text-gray-300', margin: 'ml-6' },
    { word: 'Human Design', color: 'text-gray-500', margin: 'ml-1' },
    { word: 'Feng Shui', color: 'text-gray-200', margin: 'ml-11' },
    { word: 'Oracle cards', color: 'text-gray-400', margin: 'ml-7' },
    { word: 'Хіромантія', color: 'text-gray-300', margin: 'ml-4' },
    { word: 'Ритуали/ обряди', color: 'text-gray-500', margin: 'ml-12' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[100vh] w-full">
      {/* Left Block */}
      <div className="relative w-full md:flex-grow md:min-w-0 bg-white flex flex-col" style={{ flexBasis: '85%' }}>
        <div className="sticky top-0 z-30 bg-white p-4 md:p-8">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className={cn(
                'pb-1 border-b-2 transition-colors',
                pathname === '/'
                    ? 'border-primary'
                    : 'border-transparent'
                )}>
                  <HomeIcon className={cn(
                      'h-5 w-5',
                      pathname === '/'
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                      )} />
              </Link>
              <span className="text-xs text-muted-foreground ml-4">простір обміну цінностями</span>
            </div>
          
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-4 mr-12">
                  {navLinks.map((link, index) => (
                  <React.Fragment key={link.href}>
                      <Link
                      href={link.href}
                      className={cn(
                          'text-xs font-normal transition-colors pb-1 border-b-2',
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
        
        {/* Main content area */}
        <div className="flex-grow flex flex-col items-center justify-center pt-8">
            <div className="flex items-start justify-center gap-8 w-full">
                <div className="relative" style={{ width: '280px', height: '280px' }}>
                    <div className="absolute inset-0 rounded-full border border-gray-200" />
                </div>
                <div className="flex-shrink-0">
                    <div className="mt-24 flex flex-col items-center justify-center p-8 text-center">
                        <p className="text-sm text-muted-foreground mb-2">час=енергія</p>
                        <CountdownTimer />
                        <p className="text-xs text-muted-foreground mt-2">до старту залишилось</p>
                    </div>
                </div>
            </div>
            <div className="text-center text-sm text-muted-foreground max-w-[500px] mt-8">
                <p className="mb-4">
                    Відповіді на важливі питання про стосунки, життєві рішення та власний шлях.  Такі розмови допомагають подивитися на ситуацію з іншого боку, отримати нове бачення та знайти власні рішення, краще зрозуміти події, цикли та внутрішні процеси людини.
                </p>
                <p>
                    Ідея платформи проста: коли час, компетенція, досвід  та знання об’єднуються у змістовній розмові, виникає справжня цінність для обох сторін. Для користувачів це можливість швидко і зручно звернутися до спеціалістів з усього світу та отримати індивідуальну консультацію. Для практиків — це простір, де можна ділитися своїм досвідом, розвивати особистий бренд і перетворювати знання на стабільну професійну діяльність . 4 типи комунікації з консультацій духовних практик з усіх куточків світу , без мовного бар'єру , 24/7.
                </p>
            </div>
        </div>

      </div>
      
      {/* Right Block */}
      <div className="w-full md:w-1/5 bg-black relative z-10 shadow-[-1.2582912rem_0_0.50331648rem_-0.25165824rem_rgba(128,128,128,0.15)] flex flex-col">
        <div className="sticky top-0 z-20 bg-black p-4 text-center md:pt-8">
          <h2 className="text-white font-thin text-sm tracking-widest underline decoration-purple-500 underline-offset-4">LECTOR</h2>
          <div className="mt-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-purple-500/20 hover:text-white animate-pulse">
              <PowerIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <div className="flex-grow flex justify-center items-start pt-12 overflow-y-auto">
            <div className="flex flex-col items-start gap-y-0 text-white text-sm font-thin w-full px-4" style={{paddingTop: '10rem'}}>
                {esotericWords.map(({word, color, margin}) => (
                    <span key={word} className={cn(color, margin)}>{word}</span>
                ))}
                <span className={cn('text-gray-500', 'ml-12')}>. . .</span>
            </div>
        </div>
      </div>
    </div>
  );
}
