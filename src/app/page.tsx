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

  return (
    <div className="flex flex-col md:flex-row min-h-[200vh] w-full">
      {/* Left Block */}
      <div className="relative w-full md:w-[68%] bg-white p-4 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-black/20 overflow-hidden">
        <div className="sticky top-0 z-20 bg-white -m-4 md:-m-8 p-4 md:p-8">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className={cn(pathname === '/' ? 'text-primary' : 'text-muted-foreground')}>
                  <HomeIcon className={cn('h-5 w-5 hover:text-foreground transition-colors')} />
              </Link>
              <span className="text-xs text-muted-foreground ml-4">простір обміну цінностями</span>
            </div>
          
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
          </div>
        </div>


        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vmin] h-[90vmin] rounded-full border border-gray-200" />
        
        <div className="relative z-10 flex items-center mt-4 md:mt-0">
          {renderAuthControl()}
        </div>
      </div>
      
      {/* Center Block */}
      <div className="w-full md:w-[12%] bg-white flex items-center justify-center p-8 md:p-0">
         <CountdownTimer />
      </div>

      {/* Right Block */}
      <div className="w-full md:w-1/5 bg-black relative z-10 shadow-lg md:shadow-[-16px_0px_24px_-16px_rgba(0,0,0,0.5),_-32px_0px_48px_-24px_rgba(0,0,0,0.3)]">
        <div className="sticky top-0 z-20 bg-black p-4 text-center md:pt-8">
          <h2 className="text-white font-thin text-sm tracking-widest">LECTOR</h2>
        </div>
      </div>
    </div>
  );
}
