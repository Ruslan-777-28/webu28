'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthModal } from '@/components/auth-modal';

export function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/pro', label: 'EXPERTS' },
    { href: '/user', label: 'USER' },
    { href: '/blog', label: 'BLOG' },
  ];

  return (
    <div className="p-4 md:p-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <Link href="/" className={cn(pathname === '/' && 'border-b border-primary')}>
                <HomeIcon className={cn('h-6 w-6 text-muted-foreground')} />
            </Link>
            <span className="text-xs text-muted-foreground">простір обміну ціностями</span>
        </div>

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

      <div className="flex items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Увійти</Button>
          </DialogTrigger>
          <DialogContent className="w-[90%] sm:max-w-[425px]">
            <AuthModal />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
