'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { useUser } from '@/hooks/use-auth';
import { UserNav } from './user-nav';
import { Skeleton } from './ui/skeleton';

export function Navigation() {
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
    <div className="p-4 md:p-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <Link href="/" className={cn(pathname === '/' && 'border-b border-primary')}>
                <HomeIcon className={cn('h-6 w-6 text-muted-foreground')} />
            </Link>
            <span className="text-xs text-muted-foreground">простір обміну ціностями</span>
        </div>

        <div className="flex-grow flex justify-center">
            <div className="hidden md:flex items-center gap-2 md:gap-4 text-xs font-light">
                {navLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                    <Link
                    href={link.href}
                    className={cn(
                        'hover:text-primary transition-colors',
                        pathname === link.href && 'text-primary underline'
                    )}
                    >
                    {link.label}
                    </Link>
                    {index < navLinks.length - 1 && (
                    <span className="text-muted-foreground">|</span>
                    )}
                </React.Fragment>
                ))}
            </div>
        </div>

      <div className="flex items-center">
        {renderAuthControl()}
      </div>
    </div>
  );
}
