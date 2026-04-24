import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Video, MessageSquare, FileText, User, ShieldCheck, History, Megaphone, Calendar, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { UserTestimonialSlide, UserTestimonialsSettings } from '@/lib/types';

export function ReviewCarousel() {
    const [slides, setSlides] = useState<UserTestimonialSlide[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTestimonials = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, 'siteSettings', 'userTestimonials');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as UserTestimonialsSettings;
                    const activeSlides = (data.slides || [])
                        .filter(s => s.isActive)
                        .sort((a, b) => a.order - b.order);
                    setSlides(activeSlides);
                }
            } catch (error) {
                console.error('Error loading testimonials:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTestimonials();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
                <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">Завантаження відгуків...</p>
            </div>
        );
    }

    if (slides.length === 0) return null;

    const current = slides[currentIndex];

    const next = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            (e.currentTarget as HTMLElement).blur();
        }
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prev = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            (e.currentTarget as HTMLElement).blur();
        }
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const getCommIcon = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('відео') || t.includes('video')) return <Video className="w-3 h-3" />;
        if (t.includes('чат') || t.includes('chat') || t.includes('текст')) return <MessageSquare className="w-3 h-3" />;
        if (t.includes('файл') || t.includes('file')) return <FileText className="w-3 h-3" />;
        return <MessageSquare className="w-3 h-3" />;
    };

    return (
        <div className="relative max-w-3xl mx-auto pt-0 pb-2 px-4 lg:px-6">
            {/* Carousel Controls - Arrows */}
            {slides.length > 1 && (
                <>
                    <div className="absolute top-1/2 -left-4 md:-left-16 -translate-y-1/2 z-20">
                        <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            onClick={prev} 
                            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 hover:bg-background shadow-md border border-border/20 backdrop-blur-sm"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </div>
                    <div className="absolute top-1/2 -right-4 md:-right-16 -translate-y-1/2 z-20">
                        <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            onClick={next} 
                            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 hover:bg-background shadow-md border border-border/20 backdrop-blur-sm"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>
                </>
            )}

            {/* Main Card */}
            <div className="bg-background border border-border/40 rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/10">
                    
                    {/* 1. Left Part: Expert */}
                    <div className="lg:col-span-3 p-2.5 md:p-3 flex flex-col bg-muted/10 border-r border-border/5">
                        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-border/20 shadow-sm mb-2">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={current.expert.avatarUrl} alt={current.expert.name} className="object-cover" />
                                <AvatarFallback className="rounded-none"><User className="w-12 h-12 opacity-20" /></AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-background/90 backdrop-blur-sm border border-border/40 shadow-sm">
                                <ShieldCheck className="w-3 h-3 text-emerald-500 opacity-90" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/80">{current.expert.verifiedLabel}</span>
                            </div>
                        </div>
                        
                        <div className="space-y-0.5 mb-1.5">
                            <h3 className="text-base font-black tracking-tight text-foreground">{current.expert.name}</h3>
                            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent">{current.expert.roleLabel}</p>
                        </div>

                        <div className="space-y-2 mt-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className={cn("fi", `fi-${current.expert.countryCode.toLowerCase()}`, "text-[18px] rounded-sm shadow-sm")} />
                                    <span className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">{current.expert.countryCode}</span>
                                </div>
                                <span className="text-[12px] font-bold text-muted-foreground/80">{current.expert.countryName}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">Мови</span>
                                <div className="flex gap-1.5">
                                    {current.expert.languages.map(lang => (
                                        <span key={lang} className="text-[10px] font-black text-foreground/70 bg-muted/30 px-1.5 py-0.5 rounded border border-border/20">{lang}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2.5 border-t border-border/10">
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-1.5">{current.expert.ratingLabel}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 text-muted-foreground/40" />
                                        <span className="text-sm font-black text-foreground">{current.expert.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/20 px-1.5 py-0.5 rounded border border-border/10">
                                        <History className="w-3 h-3 opacity-50" />
                                        {current.expert.sessionsLabel}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Center Part: Review Content */}
                    <div className="lg:col-span-6 p-3 md:p-4 flex flex-col justify-start pt-4 md:pt-7 relative overflow-hidden bg-background">
                        <div className="relative z-10 space-y-3 max-w-md w-full mx-auto">
                            {/* Service Info Bar */}
                            <div className="flex flex-col items-center mb-1">
                                <div className="flex items-center gap-3 mb-0.5">
                                    <Megaphone className="w-4 h-4 text-accent/60" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">{current.testimonial.title}</span>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 text-muted-foreground/30" />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-[7.5px] font-bold uppercase tracking-widest text-muted-foreground/40">{current.testimonial.offerIdLabel}</span>
                            </div>

                            {/* Top Info Bar */}
                            <div className="flex flex-col items-center gap-2 mb-1">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/30 border border-border/10">
                                        {getCommIcon(current.testimonial.communicationType)}
                                        <span className="text-[8.5px] font-bold uppercase tracking-widest text-muted-foreground">{current.testimonial.communicationType}</span>
                                    </div>
                                    <div className="h-2.5 w-px bg-border/20" />
                                    <span className="text-[8.5px] font-black uppercase tracking-[0.15em] text-accent/70">{current.testimonial.categoryLabel}</span>
                                </div>
                            </div>

                            {/* Review Snippets */}
                            <div className="flex flex-col gap-3 my-3 relative">
                                {/* Snippet 1 (Expert) */}
                                <div className="relative p-4 rounded-2xl bg-muted/10 border border-border/20 shadow-sm animate-in slide-in-from-left-2 duration-500 w-[94%] self-start -ml-4">
                                    <div className="absolute top-1/2 right-full w-12 h-[1.5px] bg-border/40 -translate-y-1/2 hidden lg:block" />
                                    <div className="flex items-end justify-between gap-3">
                                        <p className="text-[14px] leading-relaxed font-medium text-foreground/80 line-clamp-4 min-h-[5.5rem]">
                                            {current.testimonial.firstText}
                                        </p>
                                        <div className="flex items-center gap-1 shrink-0 mb-0.5">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-black text-gray-700">{current.testimonial.firstRating}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Snippet 2 (Customer) */}
                                <div className="relative p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 shadow-sm animate-in slide-in-from-right-2 duration-500 w-[94%] self-end -mr-4">
                                    <div className="absolute top-1/2 left-full w-12 h-[1.5px] bg-indigo-200/40 -translate-y-1/2 hidden lg:block" />
                                    <div className="flex items-end justify-between gap-3">
                                        <p className="text-[14px] leading-relaxed font-medium text-foreground/80 line-clamp-4 min-h-[5.5rem]">
                                            {current.testimonial.secondText}
                                        </p>
                                        <div className="flex items-center gap-1 shrink-0 mb-0.5">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-black text-gray-700">{current.testimonial.secondRating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* System Footer */}
                            <div className="flex items-center justify-center gap-1.5 mt-auto opacity-40">
                                <Calendar className="w-2.5 h-2.5" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">{current.testimonial.communicationDateLabel}</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Right Part: Customer */}
                    <div className="lg:col-span-3 p-2.5 md:p-3 flex flex-col bg-indigo-50/40 border-l border-border/5">
                        <div className="flex flex-col items-center gap-2 mb-3 mt-10">
                            <Avatar className="h-28 w-28 border-2 border-background ring-4 ring-muted/20 shadow-md">
                                <AvatarImage src={current.customer.avatarUrl} className="object-cover" />
                                <AvatarFallback><User className="w-12 h-12 opacity-20" /></AvatarFallback>
                            </Avatar>
                            <div className="space-y-0.5 text-center">
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">{current.customer.roleLabel}</p>
                                <h4 className="text-[14px] font-black tracking-tight text-foreground">{current.customer.name}</h4>
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2.5 border-t border-border/10 w-full mt-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className={cn("fi", `fi-${current.customer.countryCode.toLowerCase()}`, "text-[18px] rounded-sm shadow-sm")} />
                                    <span className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">{current.customer.countryCode}</span>
                                </div>
                                <span className="text-[12px] font-bold text-muted-foreground/80">{current.customer.city}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Мова</span>
                                <div className="flex gap-1">
                                    {current.customer.languages.map(lang => (
                                        <span key={lang} className="text-[9px] font-black text-foreground/70 bg-muted/30 px-1.5 py-0.5 rounded border border-border/20">{lang}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col items-center gap-1.5">
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-0.5">{current.customer.ratingLabel}</p>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 text-muted-foreground/40" />
                                        <span className="text-sm font-black text-foreground">{current.customer.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/20 px-1.5 py-0.5 rounded border border-border/10">
                                        <History className="w-3 h-3 opacity-50" />
                                        {current.customer.sessionsLabel}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                (e.currentTarget as HTMLElement).blur();
                                setCurrentIndex(i);
                            }}
                            className={cn(
                                "h-1.5 transition-all duration-500 rounded-full",
                                currentIndex === i ? "w-8 bg-accent" : "w-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                            )}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
