'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, History, Info, LayoutList, Award } from 'lucide-react';

export function StatusHeaderNav({ className }: { className?: string }) {
    const pathname = usePathname();

    const links = [
        { href: '/status', label: 'Усі статуси', icon: LayoutList },
        { href: '/status/nominations', label: 'Вітрина', icon: Award },
        { href: '/status/hall-of-fame', label: 'Hall of Fame', icon: Trophy },
        { href: '/status/archive', label: 'Архів', icon: History },
        { href: '/status/legend', label: 'Легенда', icon: Info },
    ];

    return (
        <div className={`flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 ${className !== undefined ? className : 'border-b border-muted/10 mb-10 w-full max-w-fit'}`}>
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                
                return (
                    <Link key={link.href} href={link.href}>
                        <button className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all rounded-md whitespace-nowrap ${
                            isActive 
                            ? 'bg-foreground opacity-90 text-background' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/5'
                        }`}>
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-background' : 'opacity-40'}`} />
                            {link.label}
                        </button>
                    </Link>
                );
            })}
        </div>
    );
}
