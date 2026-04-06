'use client';

import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { StatusHeaderNav } from '@/components/status-header-nav';
import { getArchiveSnapshots, getArchiveGroupedBySubcategory } from '@/lib/status/selectors';
import { Shield, Mic, MessageCircle, Repeat, TrendingUp, Crown, Star, History, Calendar } from 'lucide-react';
import { LEVEL_LOCALE } from '@/lib/status/constants';

const iconMap: Record<string, React.ElementType> = {
    Mic, Shield, MessageCircle, Repeat, TrendingUp, Crown, Star
};

export default function StatusArchivePage() {
    const snapshots = getArchiveSnapshots();
    const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(
        snapshots.length > 0 ? snapshots[0].snapshotId : null
    );

    const activeSnapshot = useMemo(() => {
        return snapshots.find(s => s.snapshotId === selectedSnapshotId);
    }, [selectedSnapshotId, snapshots]);

    const activeGroupedEntries = useMemo(() => {
        return selectedSnapshotId ? getArchiveGroupedBySubcategory(selectedSnapshotId) : {};
    }, [selectedSnapshotId]);

    const subcategoryKeys = Object.keys(activeGroupedEntries);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-accent/30 selection:text-accent">
            <Navigation />
            
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-16 mt-[80px]">
                {/* Header Section */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground leading-none">
                            Архів <span className="text-muted-foreground/40 text-3xl md:text-5xl block md:inline mt-2 md:mt-0">Статусів</span>
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground/80 font-medium leading-relaxed max-w-2xl">
                            Хронологія розвитку платформи. Офіційні зафіксовані зрізи успіхів за минулі періоди, збережені для історії.
                        </p>
                    </div>
                </div>

                <StatusHeaderNav />

                {/* Main Archive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Period Navigation (Timeline) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="lg:sticky lg:top-[100px] space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <History className="w-5 h-5 text-accent" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Вибрати період</h3>
                            </div>

                            <div className="space-y-3">
                                {snapshots.map(snapshot => {
                                    const isActive = selectedSnapshotId === snapshot.snapshotId;
                                    return (
                                        <button
                                            key={snapshot.snapshotId}
                                            onClick={() => setSelectedSnapshotId(snapshot.snapshotId)}
                                            className={`w-full text-left p-5 rounded-2xl border transition-all ${
                                                isActive 
                                                ? 'bg-foreground/5 border-foreground/20 shadow-md ring-1 ring-foreground/10' 
                                                : 'bg-transparent border-muted/10 hover:border-muted/30 hover:bg-muted/5'
                                            }`}
                                        >
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-accent' : 'text-muted-foreground/40'}`}>
                                                        {snapshot.snapshotType}
                                                    </span>
                                                    {isActive && <div className="h-1.5 w-1.5 rounded-full bg-accent" />}
                                                </div>
                                                <span className={`text-lg font-black tracking-tight ${isActive ? 'text-foreground' : 'text-foreground/70'}`}>
                                                    {snapshot.title}
                                                </span>
                                                <span className="text-xs font-medium text-muted-foreground/60">{snapshot.periodLabel}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {snapshots.length === 0 && (
                                <div className="py-20 text-center opacity-40 border border-dashed border-muted/20 rounded-3xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Порожній архів</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Historical Records View */}
                    <div className="lg:col-span-8 space-y-12 min-h-[400px]">
                        {activeSnapshot ? (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {/* Snapshot Info Banner */}
                                <div className="p-8 rounded-3xl bg-muted/5 border border-muted/10">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-background border border-muted/20 flex items-center justify-center">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
                                                {activeSnapshot.title}
                                            </h2>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium max-w-xl">
                                            {activeSnapshot.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Grouped Records */}
                                {subcategoryKeys.length > 0 ? (
                                    <div className="space-y-14 pt-4">
                                        {subcategoryKeys.map(key => {
                                            const entries = activeGroupedEntries[key];
                                            return (
                                                <div key={key} className="space-y-6">
                                                    <div className="flex items-center gap-3 mb-6 px-1">
                                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-accent shrink-0">
                                                            {key}
                                                        </h3>
                                                        <div className="h-px w-full bg-muted/10" />
                                                    </div>

                                                    <div className="space-y-4">
                                                        {entries.map(entry => {
                                                            const def = entry.definition;
                                                            const Icon = iconMap[def.icon] || Star;
                                                            const isWinnerOrHolder = entry.level === 'winner' || entry.level === 'holder';

                                                            return (
                                                                <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-background border border-muted/10 hover:border-muted/30 transition-all shadow-sm group">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${
                                                                            isWinnerOrHolder 
                                                                            ? 'bg-accent/5 border-accent/20 text-accent' 
                                                                            : 'bg-muted/5 border-muted/10 text-muted-foreground/30'
                                                                        }`}>
                                                                            <Icon className="h-4 w-4" />
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[14px] font-black tracking-tight text-foreground leading-tight group-hover:text-accent transition-colors">
                                                                                {def.title}
                                                                            </span>
                                                                            <span className="text-[10px] font-bold text-muted-foreground/70 mt-1">
                                                                                {entry.userDisplayName}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {entry.level && (
                                                                        <span className={`inline-flex px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg self-start sm:self-center ${
                                                                            isWinnerOrHolder 
                                                                            ? 'bg-foreground/5 text-foreground border border-foreground/10 shadow-sm' 
                                                                            : 'bg-transparent text-muted-foreground/50 border border-muted/20'
                                                                        }`}>
                                                                            {LEVEL_LOCALE[entry.level]}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-32 text-center bg-muted/5 rounded-3xl border border-dashed border-muted/20">
                                        <History className="h-8 w-8 mx-auto mb-4 text-muted-foreground/20" />
                                        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/50">Записи для цього зрізу порожні</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-40 border border-dashed border-muted/20 rounded-3xl opacity-40">
                                <History className="h-10 w-10 mb-6 text-muted-foreground/20" />
                                <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/50 text-center px-6">Виберіть період архіву для перегляду <br className="hidden sm:block" /> історичних зрізів</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
