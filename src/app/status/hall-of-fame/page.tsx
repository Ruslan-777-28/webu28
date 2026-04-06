'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { StatusHeaderNav } from '@/components/status-header-nav';
import { getHallOfFameGroupedBySection } from '@/lib/status/selectors';
import { Shield, Mic, MessageCircle, Repeat, TrendingUp, Crown, Star, Quote, ExternalLink } from 'lucide-react';
import { HallOfFameSection } from '@/lib/status/types';

const iconMap: Record<string, React.ElementType> = {
    Mic, Shield, MessageCircle, Repeat, TrendingUp, Crown, Star
};

const SECTION_LABELS: Record<HallOfFameSection, { title: string; subtitle: string; color: string }> = {
    legendary: { 
        title: 'Легенди платформи', 
        subtitle: 'Найвищі постійні відзнаки за багаторічний внесок та бездоганну репутацію.',
        color: 'text-accent'
    },
    yearly: { 
        title: 'Герої року', 
        subtitle: 'Ті, хто визначив обличчя платформи протягом річного циклу.',
        color: 'text-foreground'
    },
    seasonal: { 
        title: 'Сезонні прориви', 
        subtitle: 'Яскраві результати та стрімкий ріст у межах одного сезону.',
        color: 'text-foreground/80'
    },
    picks: { 
        title: 'Вибір редакції', 
        subtitle: 'Особливі згадки за відповідність найвищим професійним стандартам.',
        color: 'text-foreground/70'
    }
};

export default function HallOfFamePage() {
    const groupedEntries = getHallOfFameGroupedBySection();
    const sections = Object.keys(SECTION_LABELS) as HallOfFameSection[];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-accent/30 selection:text-accent">
            <Navigation />
            
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-16 mt-[80px]">
                {/* Header Section */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground leading-none">
                            Hall of <span className="text-muted-foreground/40 text-3xl md:text-5xl block md:inline mt-2 md:mt-0">Fame</span>
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground/80 font-medium leading-relaxed max-w-2xl">
                            Музей найвищих досягнень, легендарних імен та історичних моментів. Тут зафіксовані ті, хто став символом професійності та довіри на LECTOR.
                        </p>
                    </div>
                </div>

                <StatusHeaderNav />

                {/* Museum Sections */}
                <div className="space-y-24 mb-20">
                    {sections.map(sectionKey => {
                        const entries = groupedEntries[sectionKey];
                        const label = SECTION_LABELS[sectionKey];
                        
                        if (entries.length === 0) return null;

                        return (
                            <section key={sectionKey} className="scroll-mt-32">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-l-4 border-accent/20 pl-6">
                                    <div className="space-y-2">
                                        <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-wider ${label.color}`}>
                                            {label.title}
                                        </h2>
                                        <p className="text-sm text-muted-foreground/70 max-w-xl font-medium">
                                            {label.subtitle}
                                        </p>
                                    </div>
                                    <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/30 hidden md:block">
                                        {entries.length} {entries.length === 1 ? 'record' : 'records'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {entries.map(entry => {
                                        const def = entry.definition;
                                        const Icon = iconMap[def.icon] || Star;
                                        const snapshot = entry.snapshot;

                                        return (
                                            <Card key={entry.id} className="border-muted/10 bg-muted/5 hover:bg-muted/10 hover:border-accent/20 transition-all group rounded-2xl overflow-hidden shadow-sm">
                                                <CardContent className="p-0">
                                                    <div className="p-8 space-y-6">
                                                        {/* Entry Header */}
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-12 w-12 rounded-xl bg-background border border-muted/20 flex items-center justify-center text-accent shadow-sm group-hover:scale-110 transition-transform">
                                                                    <Icon className="h-5 w-5" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                                                        {entry.titleOverride || def.title}
                                                                    </span>
                                                                    <span className="text-lg font-black tracking-tight text-foreground leading-tight">
                                                                        {entry.userDisplayName}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <Link href={`/profile/${entry.userId}`}>
                                                                <div className="h-8 w-8 rounded-full bg-background border border-muted/20 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/40 transition-all shadow-sm">
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                </div>
                                                            </Link>
                                                        </div>

                                                        {/* Citation */}
                                                        <div className="relative">
                                                            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-accent/5 -z-0" />
                                                            <p className="text-sm text-foreground/80 font-medium leading-relaxed italic relative z-10 pl-2 border-l border-accent/20">
                                                                "{entry.citation}"
                                                            </p>
                                                        </div>

                                                        {/* Metadata Footer */}
                                                        <div className="flex items-center justify-between pt-4 border-t border-muted/10">
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] uppercase font-black tracking-widest text-muted-foreground/40">Період</span>
                                                                <span className="text-[10px] font-bold text-foreground/60">{snapshot?.periodLabel || 'Постійно'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[8px] uppercase font-black tracking-widest text-muted-foreground/40">Категорія</span>
                                                                <span className="text-[10px] font-bold text-foreground/60 capitalize">{entry.subcategoryKey}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* Final museum footer note */}
                <div className="text-center py-20 border-t border-muted/10">
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/30">
                        LECTOR Historical Prestige Registry • {new Date().getFullYear()}
                    </p>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
