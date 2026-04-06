'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { ASSIGNMENT_TYPE_LOCALE } from '@/lib/status/constants';
import { getLegendGroups } from '@/lib/status/selectors';
import { Shield, Mic, MessageCircle, Repeat, TrendingUp, Crown, Star, ArrowLeft, BookOpen } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
    Mic, Shield, MessageCircle, Repeat, TrendingUp, Crown, Star
};

export default function StatusLegendPage() {
    // The selector layer now handles fetching, sorting by displayPriority, and organizing into Layer groups.
    const legendGroups = getLegendGroups();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-accent/30 selection:text-accent">
            <Navigation />
            
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-16 mt-[80px]">
                {/* Header Section */}
                <div className="flex flex-col gap-10 mb-14">
                    <Link href="/status" className="inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-fit group">
                        <div className="h-6 w-6 rounded-full bg-muted/10 flex items-center justify-center group-hover:bg-muted/20 transition-colors">
                            <ArrowLeft className="w-3 h-3" />
                        </div>
                        Повернутися до статусів
                    </Link>
                    
                    <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                        <div className="space-y-5 max-w-2xl">
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground leading-none">
                                Умовні <span className="text-muted-foreground/40">позначки</span>
                            </h1>
                            <p className="text-sm md:text-base text-muted-foreground/80 font-medium leading-relaxed">
                                Офіційний словник статусної системи платформи LECTOR. Усі нагороди та форми визнання поділяються на 4 основні типи залежно від їхньої ваги, частоти оновлення та способу призначення.
                            </p>
                        </div>
                        <div className="hidden md:flex h-16 w-16 rounded-2xl bg-muted/5 border border-muted/20 items-center justify-center shrink-0">
                            <BookOpen className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                    </div>
                </div>

                {/* Grouped Legend List */}
                <div className="space-y-16 mb-12">
                    {legendGroups.map(group => (
                        <section key={group.layerType} className="space-y-6">
                            <div className="space-y-2 mb-8">
                                <h2 className="text-xl font-black uppercase tracking-wider text-foreground flex items-center gap-3">
                                    <div className="h-px w-6 bg-accent" />
                                    {group.title} {/* The selector handles setting the properly localized title */}
                                </h2>
                                <p className="text-sm text-muted-foreground/80 max-w-xl">
                                    {group.description}
                                </p>
                            </div>
                            
                            <div className="grid gap-4">
                                {group.definitions.map(def => {
                                    const Icon = iconMap[def.icon] || Star;
                                    
                                    return (
                                        <Card key={def.id} className="border-muted/20 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden hover:border-accent/30 hover:shadow-md transition-all group">
                                            <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center">
                                                <div className="h-14 w-14 rounded-2xl bg-muted/10 border border-muted/20 text-foreground/50 flex items-center justify-center shrink-0 group-hover:bg-accent/10 group-hover:border-accent/20 group-hover:text-accent transition-colors">
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                                        <h3 className="text-base font-black tracking-tight text-foreground">
                                                            {def.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-accent/10 text-accent/90 border border-accent/20">
                                                                {ASSIGNMENT_TYPE_LOCALE[def.assignmentType]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-muted-foreground/70 leading-relaxed max-w-2xl font-medium">
                                                        {def.description}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
