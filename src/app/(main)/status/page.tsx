'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Navigation } from '@/components/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { LEVEL_LOCALE } from '@/lib/status/constants';
import { getActiveStatusSnapshot, getStatusTableRowsForSubcategory } from '@/lib/status/selectors';
import { StatusHeaderNav } from '@/components/status-header-nav';
import { Shield, Mic, MessageCircle, Repeat, TrendingUp, Crown, Star, Calendar, X, User, Heart, Clock, Sparkles, Users, ShoppingBag, Award, Globe, PenTool } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BlogSettings, Subcategory } from '@/lib/types';
import { FormattedStatusTableRow, StatusAwardLevel } from '@/lib/status/types';
import { Button } from '@/components/ui/button';
import { WelcomeIntentSection } from '@/components/welcome-intent-section';
import { StatusSystemMap } from '@/components/status-system-map';

const iconMap: Record<string, React.ElementType> = {
    Mic, Shield, MessageCircle, Repeat, TrendingUp, Crown, Star,
    Heart, Clock, Sparkles, Users, ShoppingBag, Award, Globe, PenTool
};

const getLevelLabel = (level?: StatusAwardLevel | 'holder'): string => {
    if (!level) return '';
    return LEVEL_LOCALE[level];
};

export default function StatusPage() {
    const router = useRouter();
    const [blogSettings, setBlogSettings] = useState<BlogSettings | null>(null);
    const [activeSubcategoryId, setActiveSubcategoryId] = useState<string>('all');

    // Fetch taxonomy from Firestore
    useEffect(() => {
        const settingsRef = doc(db, 'blogSettings', 'main');
        const unsub = onSnapshot(settingsRef, (snap) => {
            if (snap.exists()) {
                setBlogSettings(snap.data() as BlogSettings);
            }
        });
        return () => unsub();
    }, []);

    // Flatten taxonomy subcategories
    const taxonomyTabs = useMemo(() => {
        const allTab = { id: 'all', name: 'УСІ' };
        if (!blogSettings?.categories) return [allTab];
        
        const subs: { id: string; name: string }[] = [];
        blogSettings.categories.forEach(cat => {
            if (cat.isActive && cat.subcategories) {
                cat.subcategories.forEach(sub => {
                    if (sub.isActive) {
                        subs.push({ id: sub.id || sub.slug || sub.name, name: sub.name });
                    }
                });
            }
        });
        
        // Sorting or filtering by specific taxonomy order if needed
        return [allTab, ...subs];
    }, [blogSettings]);

    const activeSnapshot = getActiveStatusSnapshot();
    
    const activeSubcatName = useMemo(() => {
        if (activeSubcategoryId === 'all') return undefined;
        return taxonomyTabs.find(t => t.id === activeSubcategoryId)?.name;
    }, [activeSubcategoryId, taxonomyTabs]);

    const tableRows = useMemo<FormattedStatusTableRow[]>(() => {
        // Source nominations for demo filling (standard 12 from Vitrine)
        const nominations = [
            { title: 'Експерт року', icon: 'Star' },
            { title: 'Вибір спільноти', icon: 'Heart' },
            { title: 'Найдорожча реалізована хвилина на платформі', icon: 'Clock' },
            { title: 'Відкриття року', icon: 'Sparkles' },
            { title: 'Архітектор спільноти', icon: 'Users' },
            { title: 'Висхідна зірка', icon: 'TrendingUp' },
            { title: 'Замовник року', icon: 'ShoppingBag' },
            { title: 'Магніт повернень', icon: 'Repeat' },
            { title: 'Легенда підкатегорії', icon: 'Award' },
            { title: 'Міжнародний експерт', icon: 'Globe' },
            { title: 'Автор року', icon: 'PenTool' },
            { title: 'Легенда року', icon: 'Crown' }
        ];

        const expertNames = [
            'Олександр', 'Марія', 'Дмитро', 'Тетяна', 'Андрій', 'Олена', 
            'Максим', 'Ірина', 'Сергій', 'Наталія', 'Артем', 'Вікторія',
            'Юрій', 'Світлана', 'Микола', 'Оксана', 'Роман', 'Ганна'
        ];

        // Generator helper for demo records
        const generateDemoRows = (name: string, id: string, count: number = 12) => {
            const seed = name.length + (name.charCodeAt(0) || 0);
            return nominations.slice(0, count).map((nom, i) => {
                const nameIndex = (i + seed) % expertNames.length;
                const avatarIndex = (i * 3 + seed) % 20;
                return {
                    id: `demo-${id}-${i}`,
                    userId: `demo-user-${seed}-${i}`,
                    userDisplayName: `${expertNames[nameIndex]} ${name.slice(0, 3)}`,
                    userAvatarUrl: `https://i.pravatar.cc/150?u=expert${avatarIndex}${id}`,
                    awardDefinitionId: `demo-def-${i}`,
                    definitionId: `demo-def-id-${i}`, 
                    level: (i % 2 === 0 ? 'winner' : 'holder') as StatusAwardLevel | 'holder',
                    assignedAt: Date.now() - (i * 1000 * 60 * 60), // Decaying time
                    periodId: 'season-1',
                    periodLabel: '2025/2026',
                    snapshotId: 'active-snapshot',
                    subcategoryKey: name.toLowerCase(),
                    subcategoryName: name, // Custom field for aggregated view
                    categoryKey: 'expertise',
                    featuredOnProfile: true,
                    isDemo: true,
                    definition: {
                        id: `demo-def-obj-${i}`,
                        layerType: (i % 3 === 0 ? 'permanent' : 'seasonal') as any,
                        assignmentType: 'algorithmic',
                        rarity: 'common',
                        displayPriority: i,
                        visibleInProfile: true,
                        visibleInLegend: true,
                        active: true,
                        description: 'Description for demo',
                        title: nom.title,
                        icon: nom.icon,
                    }
                } as FormattedStatusTableRow;
            });
        };

        // AGGREGATED VIEW: 'Усі статуси'
        if (activeSubcategoryId === 'all') {
            const aggregated: FormattedStatusTableRow[] = [];
            // Map over all available taxonomy tabs (except 'all')
            taxonomyTabs.filter(t => t.id !== 'all').forEach(tab => {
                // For global view, take top 4 statuses per category to show diversity
                aggregated.push(...generateDemoRows(tab.name, tab.id, 4));
            });
            return aggregated.sort((a, b) => b.assignedAt - a.assignedAt);
        }

        // INDIVIDUAL VIEW: Specific subcategory
        const rows = getStatusTableRowsForSubcategory(activeSubcatName);
        
        // SHOWCASE FIX: If we have real rows but less than a full vitrine (12), 
        // force the gorgeous 12-card demo set for a better presentation.
        if (activeSubcatName && rows.length < 12) {
            return generateDemoRows(activeSubcatName, activeSubcategoryId);
        }

        if (rows.length > 0) return rows;

        // DEMO FILL: If empty, fill with 12 showcase items
        if (activeSubcatName) {
            return generateDemoRows(activeSubcatName, activeSubcategoryId);
        }

        return rows;
    }, [activeSubcatName, activeSubcategoryId, taxonomyTabs]);

    const handleClose = () => {
        if (typeof window !== 'undefined' && window.history.length > 2) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-accent/30 selection:text-accent relative">
            <Navigation />
            
            {/* Close Button UI (B) */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleClose}
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-muted/10 border border-muted/20 hover:bg-muted/20 hover:border-muted/40 transition-all group"
                >
                    <X className="w-5 h-5 md:w-6 h-6 text-muted-foreground group-hover:text-foreground" />
                </Button>
            </div>
            
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-16 mt-[32px] md:mt-[40px]">
                <WelcomeIntentSection />
                {/* Header Section */}
                <div className="flex flex-col gap-10 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="space-y-5 max-w-2xl">
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground leading-none">
                                Статус у LECTOR
                            </h1>
                            <div className="space-y-3">
                                <p className="text-sm md:text-lg text-muted-foreground font-bold leading-relaxed">
                                    Статус у LECTOR — це не одна позначка, а система розвитку присутності, довіри та визнання в екосистемі платформи.
                                </p>
                                <p className="text-xs md:text-sm text-muted-foreground/70 font-medium leading-relaxed">
                                    У цій системі поєднуються рівні наповнення профілю, рівні довіри, особливі ролі та публічні відзнаки.
                                </p>
                            </div>
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
                        </div>
                    </div>
                </div>

                {/* Status System Map - Reinforcement Layer */}
                <StatusSystemMap />

                <div className="sticky top-[72px] md:top-[88px] z-40 bg-background/95 backdrop-blur-md pt-4 pb-2 mb-8 -mx-4 px-4 md:-mx-6 md:px-6 border-b border-muted/10">
                    <StatusHeaderNav className="w-full max-w-fit mb-4" />

                    {/* Subcategory Navigation (A) */}
                    <div className="w-full">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                            {taxonomyTabs.map((sub) => (
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
                </div>

                {/* Info Note Note */}
                <div className="flex items-center gap-2 px-1 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                        {activeSnapshot?.description || 'Ця таблиця відображає зафіксований історичний зріз, а не live-перебіг поточного періоду.'}
                    </span>
                </div>

                {/* Content Grid */}
                {tableRows.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {tableRows.map((row: FormattedStatusTableRow) => {
                            const def = row.definition;
                            const Icon = iconMap[def.icon] || Star;
                            const isWinnerOrHolder = row.level === 'winner' || row.level === 'holder';
                            
                            return (
                                <Card key={row.id} className="group relative overflow-hidden bg-muted/40 border border-muted shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] md:hover:scale-[1.25] z-0 hover:z-50 hover:bg-muted/50 transition-all duration-500 ease-out flex flex-col p-3.5 pb-4 h-full origin-center">
                                    
                                    {/* Archive ID (Refined Two-Row Technical Style) */}
                                    <div className="absolute top-3 right-3.5 text-right leading-[1.1]">
                                        <div className="text-[8.5px] font-mono text-muted-foreground/45 font-bold uppercase tracking-tight tabular-nums">
                                            ID {Math.floor(10000 + (row.id.charCodeAt(0) * 345 + row.id.charCodeAt(1)) % 89999)}
                                        </div>
                                        <div className="text-[6.5px] uppercase tracking-[0.1em] text-muted-foreground/20 font-black">
                                            запис в архіві
                                        </div>
                                    </div>

                                    {/* 1. Top Zone: Core Identity */}
                                    <div className="flex items-start gap-3.5 mb-3">
                                        <div className={`h-8 w-8 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                                            isWinnerOrHolder 
                                            ? 'bg-accent/10 text-accent ring-1 ring-accent/20' 
                                            : 'bg-muted/10 text-muted-foreground ring-1 ring-muted/20'
                                        }`}>
                                            <Icon className="h-4.5 w-4.5" />
                                        </div>
                                        <div className="pt-0 pr-6">
                                            <h3 className="text-[13px] font-black leading-tight text-foreground/90 group-hover:text-foreground transition-colors line-clamp-2">
                                                {def.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* 2. Owner Block (Bottom-Left Anchor) */}
                                    <div className="flex items-end gap-3.5 mt-auto -ml-3.5 -mb-4">
                                        <div className="shrink-0">
                                            <Link href={`/profile/${row.userId}`}>
                                                <Avatar className="h-14 w-14 border-t border-r border-background ring-1 ring-muted/10 group-hover:ring-accent/30 transition-all shadow-sm rounded-tr-2xl rounded-bl-none rounded-br-none rounded-tl-none">
                                                    <AvatarImage src={row.userAvatarUrl} alt={row.userDisplayName} className="object-cover rounded-tr-2xl rounded-bl-none rounded-br-none rounded-tl-none" />
                                                    <AvatarFallback className="bg-muted text-[12px] font-black uppercase tracking-widest rounded-tr-2xl rounded-bl-none rounded-br-none rounded-tl-none">
                                                        {row.userDisplayName?.charAt(0) || <User className="w-6 h-6" />}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Link>
                                        </div>
                                        <div className="flex flex-col min-w-0 pr-4 pb-3">
                                            <Link href={`/profile/${row.userId}`} className="truncate block mb-0.5">
                                                <span className="text-[11px] font-bold text-foreground group-hover:text-accent transition-colors truncate block">
                                                    {row.userDisplayName}
                                                </span>
                                            </Link>
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="text-[8.5px] uppercase tracking-[0.12em] font-bold text-muted-foreground/45 leading-none block truncate">
                                                    {def.layerType === 'permanent' ? 'Постійний статус' : 'Сезонна відзнака'}
                                                    {row.level && ` · ${getLevelLabel(row.level)}`}
                                                </span>
                                                {/* Subcategory Marker - ONLY visible in aggregated ('All') View */}
                                                {activeSubcategoryId === 'all' && (
                                                    <span className="text-[7.5px] uppercase tracking-widest font-black text-accent/50 leading-none">
                                                        {(row as any).subcategoryName || row.subcategoryKey}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="border border-muted shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1)] bg-muted/40 overflow-hidden rounded-xl">
                        <CardContent className="p-0">
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
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
