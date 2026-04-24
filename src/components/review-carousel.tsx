'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, Video, MessageSquare, FileText, User, ShieldCheck, History, Megaphone, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReviewItem {
    professional: {
        name: string;
        avatar: string;
        specialty: string;
        country: string;
        countryCode: string;
        languages: string[];
        rating: number;
        sessions: number;
        status: string;
    };
    customer: {
        name: string;
        avatar: string;
        country: string;
        countryCode: string;
        language: string;
        ratingGiven: number;
        location?: string;
    };
    review: {
        text: string;
        communicationType: 'video' | 'chat' | 'files';
        subcategory: string;
        interactionRating: number;
    };
}

const reviews: ReviewItem[] = [
    {
        professional: {
            name: "Alina Zoryana",
            avatar: "https://i.pravatar.cc/400?u=archstr1",
            specialty: "Таролог, Астролог",
            country: "Ukraine",
            countryCode: "ua",
            languages: ["UA", "EN"],
            rating: 4.9,
            sessions: 120,
            status: "Verified"
        },
        customer: {
            name: "Dmitry K.",
            avatar: "https://i.pravatar.cc/150?u=cust1",
            country: "Poland",
            countryCode: "pl",
            language: "UA",
            ratingGiven: 5,
            location: "Warsaw"
        },
        review: {
            text: "Неймовірна глибина аналізу. Аліна допомогла побачити ситуацію з боку, про який я навіть не замислювався. Це був не просто прогноз, а справжня терапевтична розмова, яка дала мені спокій і чіткий план дій на наступні місяці.",
            communicationType: 'video',
            subcategory: "Астрологія",
            interactionRating: 5
        }
    },
    {
        professional: {
            name: "Ірина Вогник",
            avatar: "https://i.pravatar.cc/400?u=archstr2",
            specialty: "Нумеролог",
            country: "Germany",
            countryCode: "de",
            languages: ["UA", "DE"],
            rating: 4.8,
            sessions: 90,
            status: "Expert"
        },
        customer: {
            name: "Elena M.",
            avatar: "https://i.pravatar.cc/150?u=cust2",
            country: "Ukraine",
            countryCode: "ua",
            language: "UA",
            ratingGiven: 5,
            location: "Kyiv"
        },
        review: {
            text: "Дуже точний розбір мого запиту. Ірина професійно оперує цифрами та вміє пояснити складні взаємозв'язки простою мовою. Після сесії я відчула величезний приплив енергії та впевненості у своїх силах.",
            communicationType: 'chat',
            subcategory: "Нумерологія",
            interactionRating: 5
        }
    },
    {
        professional: {
            name: "Максим Сидоренко",
            avatar: "https://i.pravatar.cc/400?u=archstr3",
            specialty: "Енергопрактик",
            country: "Spain",
            countryCode: "es",
            languages: ["UA", "ES"],
            rating: 4.9,
            sessions: 140,
            status: "Guided"
        },
        customer: {
            name: "Sergey V.",
            avatar: "https://i.pravatar.cc/150?u=cust3",
            country: "Spain",
            countryCode: "es",
            language: "ES",
            ratingGiven: 5,
            location: "Barcelona"
        },
        review: {
            text: "Це був унікальний досвід. Максим дуже тонко відчуває стан і допомагає знайти баланс. Вже після першої взаємодії я відчув реальні зміни у своєму самопочутті та сприйнятті навколишнього світу. Рекомендую всім, хто шукає внутрішній спокій.",
            communicationType: 'files',
            subcategory: "Енергопрактики",
            interactionRating: 5
        }
    }
];

export function ReviewCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

    const current = reviews[currentIndex];

    const getCommIcon = (type: string) => {
        switch (type) {
            case 'video': return <Video className="w-3 h-3" />;
            case 'chat': return <MessageSquare className="w-3 h-3" />;
            case 'files': return <FileText className="w-3 h-3" />;
            default: return <MessageSquare className="w-3 h-3" />;
        }
    };

    const getCommLabel = (type: string) => {
        switch (type) {
            case 'video': return 'Відеочат';
            case 'chat': return 'Текстовий чат';
            case 'files': return 'Обмін файлами';
            default: return 'Чат';
        }
    };

    return (
        <div className="relative max-w-3xl mx-auto py-2 px-4 lg:px-6">
            {/* Carousel Controls - Arrows */}
            <div className="absolute top-1/2 -left-4 md:-left-16 -translate-y-1/2 z-20">
                <Button variant="ghost" size="icon" onClick={prev} className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 hover:bg-background shadow-md border border-border/20 backdrop-blur-sm">
                    <ChevronLeft className="w-6 h-6" />
                </Button>
            </div>
            <div className="absolute top-1/2 -right-4 md:-right-16 -translate-y-1/2 z-20">
                <Button variant="ghost" size="icon" onClick={next} className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 hover:bg-background shadow-md border border-border/20 backdrop-blur-sm">
                    <ChevronRight className="w-6 h-6" />
                </Button>
            </div>

            {/* Main Card */}
            <div className="bg-background border border-border/40 rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/10">
                    
                    {/* 1. Left Part: Professional */}
                    <div className="lg:col-span-3 p-3 md:p-4 flex flex-col bg-muted/10 border-r border-border/5">
                        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-border/20 shadow-sm mb-3">
                            <img src={current.professional.avatar} alt={current.professional.name} className="w-full h-full object-cover" />
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-background/90 backdrop-blur-sm border border-border/40 shadow-sm">
                                <ShieldCheck className="w-3 h-3 text-emerald-500 opacity-90" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/80">{current.professional.status}</span>
                            </div>
                        </div>
                        
                        <div className="space-y-0.5 mb-2.5">
                            <h3 className="text-base font-black tracking-tight text-foreground">{current.professional.name}</h3>
                            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent">{current.professional.specialty}</p>
                        </div>

                        <div className="space-y-3 mt-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={cn("fi", `fi-${current.professional.countryCode}`, "text-xs rounded-sm shadow-sm")} />
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{current.professional.countryCode}</span>
                                </div>
                                <span className="text-[10px] font-medium text-muted-foreground/60">{current.professional.country}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">Мови</span>
                                <div className="flex gap-1.5">
                                    {current.professional.languages.map(lang => (
                                        <span key={lang} className="text-[10px] font-black text-foreground/70 bg-muted/30 px-1.5 py-0.5 rounded border border-border/20">{lang}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/10">
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-2">ОЦІНКА ПРОФЕСІОНАЛУ</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 text-muted-foreground/40" />
                                        <span className="text-sm font-black text-foreground">{current.professional.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/20 px-1.5 py-0.5 rounded border border-border/10">
                                        <History className="w-3 h-3 opacity-50" />
                                        {current.professional.sessions}+ сесій
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Center Part: Review Content */}
                    <div className="lg:col-span-6 p-3 md:p-6 flex flex-col justify-center relative overflow-hidden bg-background">
                        <div className="relative z-10 space-y-3 max-w-md w-full mx-auto">
                            {/* Service Info Bar */}
                            <div className="flex flex-col items-center mb-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Megaphone className="w-3.5 h-3.5 text-accent/60" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">ВІДГУК</span>
                                    <div className="flex items-center gap-0.5 ml-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-2.5 h-2.5 text-muted-foreground/30" />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-[7.5px] font-bold uppercase tracking-widest text-muted-foreground/40">ОФЕР ID 2 101</span>
                            </div>

                            {/* Top Info Bar */}
                            <div className="flex flex-col items-center gap-2 mb-1">

                                <div className="flex items-center gap-2.5">
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/30 border border-border/10">
                                        {getCommIcon(current.review.communicationType)}
                                        <span className="text-[8.5px] font-bold uppercase tracking-widest text-muted-foreground">{getCommLabel(current.review.communicationType)}</span>
                                    </div>
                                    <div className="h-2.5 w-px bg-border/20" />
                                    <span className="text-[8.5px] font-black uppercase tracking-[0.15em] text-accent/70">{current.review.subcategory}</span>
                                </div>
                            </div>
                            {/* Review Snippets */}
                            <div className="flex flex-col gap-4 my-4 relative">
                                {/* Snippet 1 (Pro) */}
                                <div className="relative p-4 rounded-2xl bg-muted/10 border border-border/20 shadow-sm animate-in slide-in-from-left-2 duration-500 w-[88%] self-start -ml-2">
                                    {/* Connector to Pro side */}
                                    <div className="absolute top-1/2 right-full w-12 h-[1.5px] bg-border/40 -translate-y-1/2 hidden lg:block" />
                                    
                                    <div className="flex items-end justify-between gap-3">
                                        <p className="text-[14px] leading-relaxed font-medium text-foreground/80 line-clamp-3">
                                            Професійний підхід та глибоке розуміння запиту. Кожна хвилина сесії була наповнена сенсом та реальною цінністю.
                                        </p>
                                        <div className="flex items-center gap-1 shrink-0 mb-0.5">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-black text-gray-700">4.8</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Snippet 2 (Cust) */}
                                <div className="relative p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 shadow-sm animate-in slide-in-from-right-2 duration-500 w-[88%] self-end -mr-2">
                                    {/* Connector to Cust side */}
                                    <div className="absolute top-1/2 left-full w-12 h-[1.5px] bg-indigo-200/40 -translate-y-1/2 hidden lg:block" />
                                    
                                    <div className="flex items-end justify-between gap-3">
                                        <p className="text-[14px] leading-relaxed font-medium text-foreground/80 line-clamp-3">
                                            Швидка комунікація та дуже комфортна атмосфера. Отримав відповіді на всі питання, які турбували довгий час.
                                        </p>
                                        <div className="flex items-center gap-1 shrink-0 mb-0.5">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-black text-gray-700">4.8</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* System Footer */}
                            <div className="flex items-center justify-center gap-1.5 mt-auto opacity-40">
                                <Calendar className="w-2.5 h-2.5" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Дата комунікації: 14.03.2026</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Right Part: Customer */}
                    <div className="lg:col-span-3 p-3 md:p-4 flex flex-col bg-indigo-50/40 border-l border-border/5">
                        <div className="flex flex-col items-center gap-2 mb-4 mt-8">
                            <Avatar className="h-28 w-28 border-2 border-background ring-4 ring-muted/20 shadow-md">
                                <AvatarImage src={current.customer.avatar} className="object-cover" />
                                <AvatarFallback><User className="w-12 h-12 opacity-20" /></AvatarFallback>
                            </Avatar>
                            <div className="space-y-0.5 text-center">
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">Замовник</p>
                                <h4 className="text-[14px] font-black tracking-tight text-foreground">{current.customer.name}</h4>
                            </div>
                        </div>

                        <div className="space-y-2.5 pt-4 border-t border-border/10 w-full mt-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={cn("fi", `fi-${current.customer.countryCode}`, "text-xs rounded-sm shadow-sm")} />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{current.customer.countryCode}</span>
                                </div>
                                <span className="text-[9px] font-medium text-muted-foreground/60">{current.customer.location}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Мова</span>
                                <span className="text-[9px] font-black text-foreground/70 bg-muted/30 px-1.5 py-0.5 rounded border border-border/20">{current.customer.language}</span>
                            </div>

                            <div className="pt-2 flex flex-col items-center gap-1.5">
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-0.5">ОЦІНКА ЗАМОВНИКУ</p>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 text-muted-foreground/40" />
                                        <span className="text-sm font-black text-foreground">{current.customer.ratingGiven}.0</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/20 px-1.5 py-0.5 rounded border border-border/10">
                                        <History className="w-3 h-3 opacity-50" />
                                        20+ сесій
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-3">
                {reviews.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={cn(
                            "h-1.5 transition-all duration-500 rounded-full",
                            currentIndex === i ? "w-8 bg-accent" : "w-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                        )}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
