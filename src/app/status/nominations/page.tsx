'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { NOMINATIONS_DATA, NominationItem } from '@/lib/status/nominations-data';
import { Plus, Minus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NominationsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent/30 selection:text-accent relative">
            <Navigation />
            
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-0 pb-12 mt-[40px] relative">
                {/* Close Control */}
                <div className="absolute -top-3 right-4 md:-top-2 md:right-8 z-10">
                    <Link href="/status">
                        <div className="h-10 w-10 rounded-full border border-muted/20 flex items-center justify-center text-muted-foreground/40 hover:text-accent hover:border-accent/40 transition-all group">
                            <X size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                        </div>
                    </Link>
                </div>

                {/* Header Section: Two-column layout with status accent */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="flex-1 flex flex-row items-baseline gap-4 md:gap-5">
                        <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-foreground leading-[0.8] whitespace-nowrap">
                            Вітрина <span className="text-muted-foreground/30">номінацій</span>
                        </h1>
                        <div className="text-3xl md:text-6xl font-black tracking-tighter leading-[0.8] select-none text-foreground">
                            <span className="text-muted-foreground/30">?</span> №<span className="text-red-500">1</span>
                        </div>
                    </div>
                    
                    <div className="max-w-[400px] md:text-right pb-1">
                        <p className="text-[10px] md:text-[11px] leading-relaxed text-muted-foreground/60 font-medium uppercase tracking-[0.05em]">
                            Типи професійних статусів та почесних відзнак платформи.
                        </p>
                    </div>
                </div>

                {/* Nomination Grid: Immediate showcase */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-20">
                    {NOMINATIONS_DATA.map((item) => (
                        <NominationCard key={item.id} item={item} />
                    ))}
                </div>
            </main>
        </div>
    );
}

function NominationCard({ item }: { item: NominationItem }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const Icon = item.icon;

    return (
        <div 
            className={cn(
                "group relative border border-muted/15 bg-card/40 backdrop-blur-sm rounded-xl py-3 px-3.5 flex flex-col transition-all duration-300",
                "hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:bg-card/60",
                isExpanded ? "ring-1 ring-accent/20 border-accent/25 bg-card/70" : ""
            )}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="h-9 w-9 rounded-lg bg-accent/5 border border-accent/10 flex items-center justify-center text-accent/60 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                    <Icon strokeWidth={1.2} size={18} />
                </div>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    className="h-6 w-6 rounded-full border border-muted/20 flex items-center justify-center text-muted-foreground/60 hover:border-accent/50 hover:text-accent transition-all focus:outline-none"
                >
                    {isExpanded ? <Minus size={10} /> : <Plus size={10} />}
                </button>
            </div>

            <div className="space-y-1">
                <h3 className="text-[13px] font-black uppercase tracking-tight text-foreground/80 leading-tight">
                    {item.title}
                </h3>
                <p className="text-[11px] leading-tight text-muted-foreground/60 font-medium">
                    {item.shortDescription}
                </p>
            </div>

            {/* Expandable Content Section */}
            <div 
                className={cn(
                    "grid transition-all duration-300 ease-in-out overflow-hidden mt-0",
                    isExpanded ? "grid-rows-[1fr] pt-3 opacity-100" : "grid-rows-[0fr] pt-0 opacity-0"
                )}
            >
                <div className="min-h-0 space-y-3 pt-3 border-t border-muted/10">
                    <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-accent/50 block">За що надається</span>
                        <p className="text-[10px] leading-snug text-muted-foreground/80">
                            {item.explanationReason}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-accent/50 block">Як отримати</span>
                        <p className="text-[10px] leading-snug text-muted-foreground/80">
                            {item.explanationHowToGet}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
