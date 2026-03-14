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
    <div className="flex h-screen w-full">
      {/* Left Block (68%) with Navigation */}
      <div className="w-[68%] bg-muted p-8 flex flex-col justify-between border-r border-black/20">
        <div>
          <div className="flex items-center gap-4">
            <Link href="/" className={cn(pathname === '/' ? 'text-primary' : 'text-muted-foreground')}>
                <HomeIcon className={cn('h-5 w-5 hover:text-foreground transition-colors')} />
            </Link>
            <span className="text-xs text-muted-foreground">простір обміну цінностями</span>
          
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
        <div className="flex items-center">
          {renderAuthControl()}
        </div>
      </div>
      
      {/* Center Block (12%) */}
      <div className="w-[12%] bg-card flex items-center justify-center">
         <CountdownTimer />
      </div>

      {/* Right Block (20%) */}
      <div className="w-1/5 bg-black">
        {/* This is the right-side block. Content can be added here later. */}
      </div>
    </div>
  );
}
