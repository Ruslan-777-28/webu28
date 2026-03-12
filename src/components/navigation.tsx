'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

export function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/pro', label: 'PRO' },
    { href: '/user', label: 'USER' },
    { href: '/blog', label: 'BLOG' },
  ];

  return (
    <div className="p-8 flex justify-between items-center">
        <Link href="/">
            <HomeIcon className={cn('h-6 w-6 text-foreground', pathname === '/' && 'text-primary')} />
        </Link>
        <div className="flex items-center gap-4 text-xs font-light">
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
  );
}
