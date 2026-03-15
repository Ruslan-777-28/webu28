'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Power as PowerIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { useUser } from '@/hooks/use-auth';
import { UserNav } from './user-nav';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { AuthModal } from './auth-modal';

export function Navigation() {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

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
    return (
      <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <PowerIcon className="h-6 w-6 text-muted-foreground hover:text-foreground" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <AuthModal setOpen={setAuthModalOpen} />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="p-4 md:p-8 flex justify-between items-center">
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
            <span className="text-xs text-muted-foreground">екосистема обміну ціностями</span>
        </div>

        <div className="flex-grow flex justify-center">
            <div className="hidden md:flex items-center gap-2 md:gap-4 text-xs font-light">
                {navLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                    <Link
                    href={link.href}
                    className={cn(
                        'hover:text-primary transition-colors',
                        pathname.startsWith(link.href) && 'text-primary underline'
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
