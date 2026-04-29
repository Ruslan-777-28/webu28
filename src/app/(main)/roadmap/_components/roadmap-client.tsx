'use client';

import React, { useState, useEffect } from 'react';
import { PageCloseButton } from '@/components/page-close-button';
import { Navigation } from '@/components/navigation';
import { Layers, Wallet, Award, Globe, ArrowRight, MessageSquare, Map } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

const iconMap: Record<string, any> = {
  Layers,
  Wallet,
  Award,
  Globe,
  MessageSquare,
  Map
};

const defaultStages = [
  {
    id: 'q1-2026',
    quarter: 'Q1',
    title: 'Фундамент',
    description: 'Архітектура профілю\nЛогіка стрічки та контенту\nШар довіри та верифікації\nПерші структурні системи платформи',
    icon: 'Layers',
  },
  {
    id: 'q2-2026',
    quarter: 'Q2',
    title: 'Взаємодія та монетизація',
    description: 'Дзвінки та сценарії комунікації\nВітрина цифрових артефактів\nФундамент платіжної архітектури\nПерші механіки монетизації',
    icon: 'Wallet',
  },
  {
    id: 'q3-2026',
    quarter: 'Q3',
    title: 'Статус і розширення',
    description: 'Екосистема статусів і нагород\nРозвиток категорій і discoverability\nМеханіки видимості у спільноті\nСильніша вітрина експерта',
    icon: 'Award',
  },
  {
    id: 'q4-2026',
    quarter: 'Q4',
    title: 'Масштаб і екосистема',
    description: 'Системи масштабування платформи\nГлибша інтеграція екосистеми\nЗрілість знань і навігації\nГотовність до ширшого розширення',
    icon: 'Globe',
  }
];

export function RoadmapClient() {
    const [heroTitle, setHeroTitle] = useState('Roadmap');
    const [heroSubtitle, setHeroSubtitle] = useState('Стратегічний шлях 2026');
    const [heroDescription, setHeroDescription] = useState('Наша подорож від створення фундаменту до побудови глобального інтелектуального простору. Шлях, де кожна деталь має значення.');
    
    const [finalNodeLabel, setFinalNodeLabel] = useState('2027');
    const [finalNodeSubtitle, setFinalNodeSubtitle] = useState('Наступний етап');
    const [finalNodeMobileText, setFinalNodeMobileText] = useState('Глобальна зрілість');
    
    const [stages, setStages] = useState(defaultStages);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const loadContent = async () => {
            try {
                const docRef = doc(db, 'sitePages', 'roadmap');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.heroTitle) setHeroTitle(data.heroTitle);
                    if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
                    if (data.heroDescription) setHeroDescription(data.heroDescription);
                    if (data.finalNodeLabel) setFinalNodeLabel(data.finalNodeLabel);
                    if (data.finalNodeSubtitle) setFinalNodeSubtitle(data.finalNodeSubtitle);
                    if (data.finalNodeMobileText) setFinalNodeMobileText(data.finalNodeMobileText);
                    if (data.stages && data.stages.length > 0) {
                        setStages(data.stages);
                    }
                }
            } catch (error) {
                console.error("Error loading roadmap content", error);
            }
        };
        loadContent();
    }, []);

    // Render exact original fallback to prevent hydration mismatch before mount
    if (!isMounted) {
      return null; 
    }

    return (
        <div className="min-h-screen bg-background flex flex-col animate-in fade-in duration-500">
            <Navigation />
            <main className="relative flex-grow">
                <PageCloseButton fallbackHref="/" />
                
                {/* HERO SECTION - SCREEN 1 */}
                <section className="relative pt-16 pb-8 md:pt-20 md:pb-12 min-h-[40vh] lg:min-h-[50vh] flex flex-col justify-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-accent mb-6">
                                {heroSubtitle}
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground mb-6 leading-[0.9]">
                                {heroTitle}
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground/80 font-light leading-relaxed max-w-2xl whitespace-pre-line">
                                {heroDescription}
                            </p>
                        </div>
                    </div>
                </section>

                {/* ROADMAP & CTA - SCREEN 2 */}
                <section className="py-12 lg:py-16 bg-background flex flex-col justify-between">
                    <div className="container mx-auto px-4 max-w-7xl">
                        
                        {/* DESKTOP TIMELINE & CARDS */}
                        <div className="hidden lg:flex relative items-start gap-6 mb-12 xl:mb-16">
                            {/* Continuous horizontal line */}
                            <div className="absolute top-[5px] left-[10%] right-[80px] h-px bg-border/40 z-0" />
                            
                            {stages.map((stage, idx) => {
                                const Icon = iconMap[stage.icon] || Layers;
                                const deliverables = stage.description.split('\n').filter(Boolean);
                                
                                return (
                                <div key={idx} className="relative z-10 flex-1 flex flex-col group">
                                    {/* Timeline Node */}
                                    <div className="flex flex-col items-center mb-8">
                                        <div className="w-3 h-3 rounded-full bg-border/50 group-hover:bg-accent ring-4 ring-background transition-colors duration-500 mb-3" />
                                        <span className="text-sm font-bold text-foreground/80 tracking-widest">{stage.quarter}</span>
                                    </div>
                                    
                                    {/* Card */}
                                    <div className="bg-card border border-border/20 rounded-2xl p-6 lg:p-7 hover:shadow-xl hover:shadow-accent/5 hover:border-accent/20 transition-all duration-300 flex-grow">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 rounded-xl bg-accent/5 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                                                <Icon className="h-5 w-5 xl:h-6 xl:w-6" />
                                            </div>
                                            <h3 className="font-bold text-lg xl:text-xl leading-tight text-foreground">{stage.title}</h3>
                                        </div>
                                        <ul className="space-y-3 lg:space-y-4">
                                            {deliverables.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm xl:text-base text-muted-foreground">
                                                    <span className="w-1 h-1 rounded-full bg-border mt-2 flex-shrink-0" />
                                                    <span className="leading-snug">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                );
                            })}

                            {/* FINAL NODE */}
                            <div className="relative z-10 w-[140px] shrink-0 flex flex-col items-center pt-[1px]">
                                <div className="w-4 h-4 rounded-full border-2 border-accent bg-background ring-4 ring-background mb-3 shadow-[0_0_15px_rgba(var(--accent),0.2)]" />
                                <span className="text-sm font-bold text-accent tracking-widest mb-1">{finalNodeLabel}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap">{finalNodeSubtitle}</span>
                            </div>
                        </div>

                        {/* TABLET / MOBILE VIEW */}
                        <div className="lg:hidden flex flex-col space-y-8 mb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {stages.map((stage, idx) => {
                                    const Icon = iconMap[stage.icon] || Layers;
                                    const deliverables = stage.description.split('\n').filter(Boolean);
                                    
                                    return (
                                    <div key={idx} className="relative group bg-card border border-border/20 rounded-2xl p-6 flex flex-col">
                                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(var(--accent),0.3)]" />
                                                <span className="text-sm font-bold text-foreground/80 tracking-widest">{stage.quarter}</span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-accent/5 text-accent transition-colors duration-300">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        </div>
                                        
                                        <h3 className="font-bold text-xl leading-tight text-foreground mb-5">{stage.title}</h3>
                                        
                                        <ul className="space-y-3.5 mt-auto">
                                            {deliverables.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 flex-shrink-0" />
                                                    <span className="leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    );
                                })}
                            </div>

                            {/* 2027 Node Mobile/Tablet */}
                            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border/40 rounded-2xl bg-accent/5 text-center mt-4">
                                <div className="w-4 h-4 rounded-full border-2 border-accent mb-4 shadow-[0_0_15px_rgba(var(--accent),0.2)]" />
                                <span className="text-xl font-bold text-accent tracking-widest mb-2">{finalNodeLabel}</span>
                                <span className="text-sm text-muted-foreground uppercase tracking-wider">{finalNodeMobileText}</span>
                            </div>
                        </div>

                        {/* INTEGRATED CTA */}
                        <div className="text-center pt-2 md:pt-6">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-foreground mb-8 max-w-2xl mx-auto">
                                Ставайте частиною майбутнього вже сьогодні
                            </h2>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <button className="px-8 py-4 bg-accent text-white rounded-full font-bold text-base hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/20">
                                    Долучитися до спільноти
                                </button>
                                <button className="flex items-center gap-2 text-foreground font-bold text-base hover:text-accent transition-colors">
                                    Дізнатися більше <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}
