'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Mic, MessageCircle, Repeat, TrendingUp, Crown, Star, Info, Calendar } from 'lucide-react';
import { LEVEL_LOCALE } from '@/lib/status/constants';
import { getActiveStatusSnapshot, getStatusTableRowsForSubcategory } from '@/lib/status/selectors';

const iconMap: Record<string, React.ElementType> = {
    Mic, Shield, MessageCircle, Repeat, TrendingUp, Crown, Star
};

// Hardcoded for V1 offline demo. Will move to a selector/fetch later.
const DEMO_SUBCATEGORIES = [
    { id: '1', name: 'Таро' },
    { id: '2', name: 'Астрологія' },
    { id: '3', name: 'Езотерика' },
    { id: '4', name: 'Наставники' }
];

export default function StatusPage() {
    const [activeSubcategoryId, setActiveSubcategoryId] = useState<string>(DEMO_SUBCATEGORIES[0].id);

    // Instead of assembling properties here, we leverage our pure selector layer.
    const activeSnapshot = getActiveStatusSnapshot();
    
    const activeSubcat = useMemo(() => {
        return DEMO_SUBCATEGORIES.find(s => s.id === activeSubcategoryId);
    }, [activeSubcategoryId]);

    const tableRows = useMemo(() => {
        return getStatusTableRowsForSubcategory(activeSubcat?.name);
    }, [activeSubcat?.name]);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-accent/30 selection:text-accent">
            <Navigation />
            
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-16 mt-[80px]">
                {/* Header Section */}
                <div className="flex flex-col gap-10 mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="space-y-5 max-w-2xl">
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground leading-none">
                                Статус
                            </h1>
                            <p className="text-sm md:text-base text-muted-foreground/80 font-medium leading-relaxed">
                                Зафіксований зріз статусів і відзнак платформи за вибраний період. Офіційний реєстр видатних досягнень та професійного визнання.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                            {/* Dynamic Snapshot Marker */}
                            {activeSnapshot && (
                                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-muted/5 border border-muted/20">
                                    <Calendar className="w-4 h-4 text-muted-foreground/50" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/60">
                                            Поточний зріз
                                        </span>
                                        <span className="text-xs font-black tracking-wider text-foreground/90">
                                            {activeSnapshot.title}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <Link href="/status/legend">
                                <button className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-transparent border border-muted/20 hover:border-accent/40 hover:text-foreground hover:bg-muted/5 transition-all rounded-lg h-full">
                                    <Info className="w-4 h-4" />
                                    Умовні позначки
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Subcategory Navigation */}
                <div className="w-full mb-8">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                        {DEMO_SUBCATEGORIES.map((sub) => (
                            <button
                                key={sub.id}
                                onClick={() => setActiveSubcategoryId(sub.id)}
                                className={`px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-full whitespace-nowrap border ${
                                    activeSubcategoryId === sub.id 
                                    ? 'bg-foreground text-background border-foreground shadow-sm' 
                                    : 'bg-transparent text-muted-foreground border-transparent hover:border-muted/30 hover:bg-muted/5 hover:text-foreground'
                                }`}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Note Note */}
                <div className="flex items-center gap-2 px-1 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                        {activeSnapshot?.description || 'Ця таблиця відображає зафіксований історичний зріз, а не live-перебіг поточного періоду.'}
                    </span>
                </div>

                {/* Content Table */}
                <Card className="border-muted/20 shadow-sm bg-background overflow-hidden rounded-xl">
                    <CardContent className="p-0">
                        {tableRows.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-muted/10 bg-muted/5">
                                            <th className="px-6 py-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/50 w-2/5">Номінація / Статус</th>
                                            <th className="px-6 py-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">Рівень</th>
                                            <th className="px-6 py-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/50 w-1/4">Користувач</th>
                                            <th className="px-6 py-5 text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">Період</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-muted/10">
                                        {tableRows.map((row) => {
                                            const def = row.definition;
                                            const Icon = iconMap[def.icon] || Star;
                                            const isWinnerOrHolder = row.level === 'winner' || row.level === 'holder';
                                            
                                            return (
                                                <tr key={row.id} className="hover:bg-muted/5 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border ${isWinnerOrHolder ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-muted/10 border-muted/20 text-foreground/50'}`}>
                                                                <Icon className="h-4 w-4" />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[13px] font-black leading-tight text-foreground/90">
                                                                    {def.title}
                                                                </span>
                                                                <span className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground/60">
                                                                    {def.layerType === 'permanent' ? 'Постійний статус' : 'Сезонна відзнака'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {row.level && (
                                                            <span className={`inline-flex px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${
                                                                isWinnerOrHolder 
                                                                ? 'bg-foreground/5 text-foreground border border-foreground/10' 
                                                                : 'bg-transparent text-muted-foreground border border-muted/30'
                                                            }`}>
                                                                {LEVEL_LOCALE[row.level]}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-[13px] font-black text-foreground group-hover:text-accent transition-colors cursor-pointer w-fit">
                                                                {row.userDisplayName}
                                                            </span>
                                                            {row.userHandle && (
                                                                <span className="text-[10px] font-medium text-muted-foreground mt-0.5">{row.userHandle}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                                                            {row.periodLabel}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center px-4 bg-muted/5">
                                <div className="h-16 w-16 mb-6 rounded-2xl bg-background border border-muted/20 flex items-center justify-center shadow-sm text-muted-foreground/30">
                                    <Crown className="h-6 w-6" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/80 mb-2">
                                    Реєстр порожній
                                </h3>
                                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                                    У цій підкатегорії записи для активного періоду відсутні.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
            
            <Footer />
        </div>
    );
}
