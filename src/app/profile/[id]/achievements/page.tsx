'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { UserProfile } from '@/lib/types';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Trophy, GraduationCap, Briefcase, Calendar, Image as ImageIcon, Milestone, Award, User, Quote } from 'lucide-react';
import Image from 'next/image';

function SectionTitle({ title, icon: Icon }: { title: string, icon: any }) {
    return (
        <div className="flex items-center gap-3 mb-6 border-b border-muted pb-2">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight">{title}</h2>
        </div>
    );
}

function PlaceholderBlock({ title, description }: { title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/5 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                <Milestone className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <h3 className="font-bold text-sm mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground max-w-[280px]">{description}</p>
        </div>
    );
}

export default function AchievementsPage() {
    const params = useParams();
    const router = useRouter();
    const profileId = params?.id as string;
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!profileId) return;
        setIsLoading(true);

        const unsub = onSnapshot(doc(db, 'users', profileId), (doc) => {
            if (doc.exists()) {
                setProfile({ uid: doc.id, ...doc.data() } as UserProfile);
            }
            setIsLoading(false);
        });

        return () => unsub();
    }, [profileId]);

    const handleBack = () => {
        router.push(`/profile/${profileId}`);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow container max-w-4xl mx-auto px-4 py-12">
                    <Skeleton className="h-10 w-48 mb-8" />
                    <div className="space-y-12">
                        <Skeleton className="h-64 w-full rounded-3xl" />
                        <Skeleton className="h-48 w-full rounded-3xl" />
                    </div>
                </main>
            </div>
        );
    }

    if (!profile) return <div>Профіль не знайдено.</div>;

    return (
        <div className="flex flex-col min-h-screen bg-background relative">
            {/* Background blur if cover exists */}
            {profile.coverUrl && (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <Image src={profile.coverUrl} alt="Background" layout="fill" objectFit="cover" className="opacity-[0.15] blur-3xl" />
                </div>
            )}

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navigation />
                
                <main className="flex-grow container max-w-4xl mx-auto px-4 py-8 md:py-12">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-10">
                        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full bg-muted/20 hover:bg-muted/40">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Досягнення та Шлях</h1>
                            <p className="text-muted-foreground font-medium text-sm md:text-base">Детальна історія та професійні відзнаки: {profile.displayName || profile.name}</p>
                        </div>
                    </div>

                    <div className="space-y-16">
                        
                        {/* Section: Bio */}
                        <section>
                            <SectionTitle title="Біо / Про автора" icon={User} />
                            <Card className="border-muted/60 shadow-sm overflow-hidden">
                                <CardContent className="p-0 flex flex-col md:flex-row">
                                    <div className="md:w-1/3 relative h-64 md:h-auto bg-muted/20">
                                        <Image 
                                            src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || profile.name || '')}&background=random&size=512`} 
                                            alt={profile.displayName || profile.name}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                    <div className="md:w-2/3 p-6 lg:p-10 flex flex-col justify-center">
                                        <div className="mb-4 text-accent opacity-60">
                                            <Quote className="h-8 w-8" />
                                        </div>
                                        <p className="text-lg md:text-xl font-medium leading-relaxed italic text-foreground/90">
                                            {profile.bio || profile.shortBio || 'Автор поки не додав детальну біографію.'}
                                        </p>
                                        <div className="mt-8 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full border border-muted/30 overflow-hidden relative">
                                                <Image 
                                                    src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || profile.name || '')}&background=random&size=512`} 
                                                    alt="Avatar" layout="fill" objectFit="cover" 
                                                />
                                            </div>
                                            <span className="font-black uppercase tracking-wider text-xs">Офіційний профіль LECTOR</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Section: Gallery */}
                        <section>
                            <SectionTitle title="Галерея" icon={ImageIcon} />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="aspect-square rounded-2xl bg-muted/30 flex items-center justify-center border border-muted/40 group overflow-hidden relative">
                                    <ImageIcon className="h-8 w-8 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/20 to-transparent">
                                         <p className="text-[10px] text-white/60 font-medium uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity">Світлина автора</p>
                                    </div>
                                </div>
                                <div className="aspect-square rounded-2xl bg-muted/20 border border-muted/30" />
                                <div className="aspect-square rounded-2xl bg-muted/10 border border-muted/20" />
                            </div>
                            <p className="text-center text-xs text-muted-foreground mt-4 italic font-medium">Розділ галереї наразі у стані наповнення</p>
                        </section>

                        {/* Section: Education */}
                        <section>
                            <SectionTitle title="Освіта" icon={GraduationCap} />
                            <div className="space-y-4">
                                <Card className="border-muted/40 bg-muted/5 shadow-none">
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <div className="shrink-0 h-10 w-10 rounded-full bg-accent/5 flex items-center justify-center border border-accent/10">
                                                <GraduationCap className="h-5 w-5 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base">Вища освіта / Спеціалізація</h3>
                                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Системна робота з енергоінформаційними полями, дослідження впливу символізму на психоемоційний стан людини.</p>
                                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-widest text-accent">Підтверджено</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* Section: Key Events */}
                        <section>
                            < SectionTitle title="Знакові події" icon={Milestone} />
                            <div className="relative border-l-2 border-muted ml-4 pl-8 space-y-10 py-2">
                                <div className="relative">
                                    <div className="absolute -left-[41px] top-0 h-4 w-4 rounded-full bg-accent border-4 border-background" />
                                    <span className="text-xs font-black text-accent uppercase tracking-widest mb-1 block">2024 — Теперішній час</span>
                                    <h3 className="font-bold text-lg">Запуск авторського курсу</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed mt-2">Старт масштабної освітньої програми, що об’єднує академічні знання та авторські методики.</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[41px] top-0 h-4 w-4 rounded-full bg-muted-foreground/30 border-4 border-background" />
                                    <span className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest mb-1 block">2023</span>
                                    <h3 className="font-bold text-lg text-foreground/80">Публікація фундаментальної праці</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed mt-2 italic">Розділ очікує на детальне підтвердження автором</p>
                                </div>
                            </div>
                        </section>

                        {/* Section: Professional Path */}
                        <section>
                            <SectionTitle title="Професійний шлях" icon={Briefcase} />
                            <PlaceholderBlock 
                                title="Професійна історія" 
                                description="Тут буде відображено етапи кар'єрного зростання, ключові ролі та професійні трансформації автора." 
                            />
                        </section>

                        {/* Section: Achievements / Awards */}
                        <section>
                            <SectionTitle title="Досягнення / Відзнаки" icon={Award} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl bg-accent/[0.03] border border-accent/10 flex items-start gap-4">
                                    <Trophy className="h-6 w-6 text-yellow-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm">Топ Експерт Кварталу</h4>
                                        <p className="text-[11px] text-muted-foreground mt-1">Визнання на основі відгуків та успішно завершених консультацій у LECTOR App.</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-muted/5 border border-muted/20 flex items-start gap-4 opacity-70">
                                    <Award className="h-6 w-6 text-muted-foreground shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm">Сертифікація LECTOR</h4>
                                        <p className="text-[11px] text-muted-foreground mt-1">Очікується фінальна валідація авторських методик командою модерації.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                    
                    {/* Final CTA/Footer */}
                    <div className="mt-20 pt-10 border-t border-muted/40 text-center">
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 mb-6">Вся інформація надана автором або підтверджена платформою</p>
                        <Button variant="outline" onClick={handleBack} className="rounded-full px-8 h-11 font-bold text-sm hover:bg-muted border-muted/60 transition-all">
                             Повернутись до скороченого профілю
                        </Button>
                    </div>

                </main>
            </div>
        </div>
    );
}
