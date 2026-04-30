'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Power as PowerIcon, BookOpen, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { useUser } from '@/hooks/use-auth';
import { UserNav } from './user-nav';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { AuthModal } from './auth-modal';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface NavigationProps {
  hideBalance?: boolean;
  subtitle?: React.ReactNode;
}

export function Navigation({ hideBalance = false, subtitle }: NavigationProps) {
  const pathname = usePathname();
  const isAchievementsPage = pathname?.endsWith('/achievements');
  const { user, profile, loading } = useUser();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const navLinks = [
    { href: '/pro', label: 'FOR EXPERTS', aliases: ['/for-experts'] },
    { href: '/user', label: 'FOR COMMUNITY', aliases: ['/for-community'] },
    { href: '/blog', label: 'BLOG', aliases: [] },
  ];

  const isActive = (href: string, aliases: string[] = []) => {
    if (pathname === href || pathname.startsWith(href)) return true;
    return aliases.some(alias => pathname === alias || pathname.startsWith(alias));
  };

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
    <div className="sticky top-0 z-40 bg-background p-4 md:p-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
            {renderAuthControl()}
            <span className="text-sm font-thin tracking-[0.2em] uppercase text-foreground">LECTOR</span>
        </div>

        <div className="flex-grow flex justify-center">
            <div className="hidden md:flex items-center gap-2 md:gap-4 text-xs font-light">
                <Link 
                    href="/" 
                    className={cn(
                        "hover:text-primary transition-colors flex items-center relative py-1",
                        pathname === '/' && "text-primary"
                    )}
                >
                    <HomeIcon 
                        className={cn(
                            "h-4 w-4 transition-all",
                            pathname === '/' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )} 
                        fill={pathname === '/' ? "currentColor" : "none"}
                    />
                    {pathname === '/' && (
                        <div className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-primary rounded-full" />
                    )}
                </Link>
                <span className="text-muted-foreground">|</span>
                {navLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                    <Link
                    href={link.href}
                    className={cn(
                        'hover:text-primary transition-colors flex items-center relative py-1',
                        isActive(link.href, link.aliases) && 'text-primary'
                    )}
                    >
                    {link.label === 'BLOG' ? (
                        <>
                            <span className="flex items-center group/blog">
                                <BookOpen 
                                    className={cn(
                                        "h-4 w-4 transition-all",
                                        isActive('/blog') ? "text-primary" : "text-muted-foreground group-hover/blog:text-primary"
                                    )} 
                                    fill={isActive('/blog') ? "currentColor" : "none"}
                                />
                            </span>
                            {isActive('/blog') && (
                                <div className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-primary rounded-full" />
                            )}
                        </>
                    ) : (
                        <>
                            {link.label}
                            {isActive(link.href, link.aliases) && (
                                <div className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-primary rounded-full" />
                            )}
                        </>
                    )}
                    </Link>
                    {index < navLinks.length - 1 && (
                    <span className="text-muted-foreground">|</span>
                    )}
                </React.Fragment>
                ))}
            </div>
            {subtitle && (
                <div className="absolute top-[calc(100%-1.5rem)] left-1/2 -translate-x-1/2 w-full text-center">
                    <span className="text-[9px] md:text-[10px] text-muted-foreground/60 font-light tracking-[0.05em] lowercase">
                        {subtitle}
                    </span>
                </div>
            )}
        </div>

      {!hideBalance && (
        <div className="flex items-center">
          <div className="flex items-center gap-2">
              <Link 
                href="/referral-sprint-program"
                className="text-xl md:text-2xl font-extralight tracking-tighter text-muted-foreground/50 font-mono tabular-nums whitespace-nowrap hover:text-primary transition-colors cursor-pointer"
                title="Referral Sprint Program"
              >
                  {(profile?.bonusBalance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
              </Link>
              <Popover>
                  <PopoverTrigger asChild>
                      <button className="p-1 hover:bg-muted rounded-full transition-colors outline-none group">
                          <Info className="h-3.5 w-3.5 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                      </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4 text-[11px] leading-relaxed animate-in fade-in zoom-in duration-200" align="end" sideOffset={12}>
                      <div className="space-y-2">
                         <p className="font-bold uppercase tracking-widest text-[10px]">Bonus Credits</p>
                         <p className="text-muted-foreground">
                           Внутрішній індикатор Вашої активності в еквіваленті бонусних кредитів. Нараховується платформою за вклад у розвиток спільноти: реферальну активність, публікації, рейтинг учасника та участь у партнерських програмах.
                           Використовуються виключно для активації преміум-опцій та цифрових сервісів усередині екосистеми LECTOR. Внутрішній ресурс для використання тільки в межах платформи.
                         </p>
                         <p className="text-[10px] text-accent font-medium italic">Обмін енергоінформаційних цінностей у реальному часі.</p>
                      </div>
                  </PopoverContent>
              </Popover>
          </div>
        </div>
      )}
    </div>
  );
}
