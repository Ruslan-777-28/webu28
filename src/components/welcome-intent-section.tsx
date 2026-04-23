'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Users, User, ArrowRight } from 'lucide-react';
import { calculateProfileCompletion } from '@/lib/utils/profile-completion';
import Link from 'next/link';

/**
 * WelcomeIntentSection
 * 
 * Shows a premium welcome banner after first login/signup based on usageIntent.
 * Triggered by ?welcome=true URL parameter.
 */
export function WelcomeIntentSection() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { profile, user, loading } = useUser();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (searchParams.get('welcome') === 'true') {
            setIsVisible(true);
        }
    }, [searchParams]);

    if (!isVisible || loading) return null;

    const intent = profile?.usageIntent || 'explore';

    const contentMap = {
        explore: {
            title: "Пориньте в екосистему LECTOR",
            body: "Ваш цифровий простір активовано. Досліджуйте авторські матеріали в блозі, стежте за досягненнями в стрічці статусів та знайомтеся з архітекторами платформи.",
            icon: Sparkles,
            primary: { label: "Перейти до блогу", link: "/blog" },
            secondary: { label: "Перейти до стрічки", link: "/status" },
            quickLinks: [
                { label: "Переглянути профілі", link: "/architectors" },
                { label: "Дізнатися про статуси", link: "/status" },
                { label: "Нарахування балів", link: "/pro" },
                { label: "Referral Sprint", link: "/referral-sprint-program" }
            ]
        },
        communicate: {
            title: "Ваша мережа знайомств",
            body: "Екосистема LECTOR — це простір для змістовного обміну. Знаходьте однодумців, зберігайте цікаві профілі та дізнавайтеся про досвід професіоналів.",
            icon: Users,
            primary: { label: "Переглянути профілі", link: "/architectors" },
            secondary: { label: "Оформити свій профіль", link: user?.uid ? `/profile/${user.uid}` : '#' },
            quickLinks: [
                { label: "Перейти до блогу", link: "/blog" },
                { label: "Дізнатися про статуси", link: "/status" },
                { label: "Нарахування балів", link: "/pro" },
                { label: "Referral Sprint", link: "/referral-sprint-program" }
            ]
        },
        develop: {
            title: "Ваш цифровий дім активовано",
            body: "Ваш профіль — це фундамент вашої присутності. Посилюйте його ключовою інформацією, публікуйте власні пости та збирайте бали в межах екосистеми.",
            icon: User,
            primary: { label: "Посилити профіль", link: user?.uid ? `/profile/${user.uid}?edit=true` : '#' },
            secondary: { label: "Дослідити стрічку", link: "/status" },
            quickLinks: [
                { label: "Опублікувати перший пост", link: "/my-posts" },
                { label: "Дізнатися про статуси", link: "/status" },
                { label: "Referral Sprint", link: "/referral-sprint-program" },
                { label: "Нарахування балів", link: "/pro" }
            ]
        }
    };

    const config = contentMap[intent as keyof typeof contentMap] || contentMap.explore;
    const Icon = config.icon;

    const handleDismiss = () => {
        setIsVisible(false);
        // Clean up URL without refresh
        try {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('welcome');
            const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
            router.replace(newUrl);
        } catch (e) {
            console.error("Failed to update URL", e);
        }
    };

    return (
        <div className="w-full mb-8 animate-in fade-in slide-in-from-top-4 duration-700 ease-out transition-all">
            <Card className="bg-accent/[0.03] border-accent/20 relative overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
                {/* Subtle Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none">
                    <div className="absolute top-[-10%] right-[-5%] w-64 h-64 rounded-full bg-accent blur-3xl" />
                </div>

                <div className="absolute top-2 right-2 z-20">
                    <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8 text-muted-foreground/50 hover:text-foreground hover:bg-muted/10 transition-colors">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="shrink-0 h-20 w-20 rounded-[2rem] bg-background border border-accent/20 shadow-sm flex items-center justify-center text-accent transition-transform hover:scale-105 duration-500">
                        <Icon className="h-10 w-10" />
                    </div>
                    <div className="flex-1 space-y-3 text-center md:text-left">
                        {intent === 'develop' && profile && (
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2 animate-in fade-in slide-in-from-left-2 duration-1000 delay-300">
                                <div className="h-1.5 w-24 bg-accent/10 rounded-full overflow-hidden border border-accent/10">
                                    <div 
                                        className="h-full bg-accent transition-all duration-[1500ms] ease-out" 
                                        style={{ width: `${calculateProfileCompletion(profile).percentage}%` }} 
                                    />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                                    {calculateProfileCompletion(profile).percentage}% · {calculateProfileCompletion(profile).statusLabel}
                                </span>
                            </div>
                        )}
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground leading-none">
                            {config.title}
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground/70 font-medium leading-relaxed max-w-2xl">
                            {config.body}
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                            <Button 
                                onClick={() => router.push(config.primary.link)}
                                className="h-12 px-10 rounded-full font-black uppercase tracking-widest text-[10px] bg-foreground text-background hover:bg-foreground/90 shadow-xl shadow-foreground/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {config.primary.label}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => router.push(config.secondary.link)}
                                className="h-12 px-10 rounded-full font-black uppercase tracking-widest text-[10px] border-muted/40 bg-background/40 backdrop-blur-sm hover:bg-background transition-all"
                            >
                                {config.secondary.label}
                            </Button>
                        </div>

                        <div className="pt-8 mt-6 border-t border-accent/10 space-y-2 text-center md:text-left">
                            <p className="text-[11px] md:text-xs font-medium text-muted-foreground/80 leading-relaxed max-w-2xl">
                                LECTOR уже працює як жива екосистема. Тут ви можете досліджувати Sprint-програму, статуси, бали та формувати свою присутність на платформі.
                            </p>
                            <p className="text-[10px] md:text-[11px] text-muted-foreground/60 font-medium italic leading-relaxed">
                                Усе, що ви створюєте й відкриваєте зараз на сайті, буде автоматично синхронізовано з додатком після його найближчого запуску.
                            </p>
                        </div>

                        {/* Quick Entry Links */}
                        {(config as any).quickLinks && (
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 pt-6">
                                {(config as any).quickLinks.map((link: any, idx: number) => (
                                    <Link 
                                        key={idx} 
                                        href={link.link}
                                        className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 hover:text-accent transition-colors flex items-center gap-1 group"
                                    >
                                        {link.label}
                                        <ArrowRight className="h-2.5 w-2.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent/50" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
