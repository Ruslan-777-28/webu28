'use client';

import React from 'react';
import { Navigation } from '@/components/navigation';
import { PageCloseButton } from '@/components/page-close-button';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
    Coins, 
    UserPlus, 
    PenSquare, 
    Zap, 
    Share2, 
    TrendingUp, 
    Award, 
    ShieldCheck, 
    RefreshCw,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/hooks/use-auth';
import { bonusRules, type BonusRule } from '@/lib/config/bonus-rules';
import { cn } from '@/lib/utils';

export default function RewardsPage() {
    const { user } = useUser();

    return (
        <main className="min-h-screen bg-background">
            <Navigation />
            <PageCloseButton fallbackHref="/" />

            {/* HERO SECTION */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 border-b border-border/50 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none">
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-accent blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 rounded-full bg-accent blur-3xl" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-6">
                            <Coins className="h-3 w-3" />
                            Система балів LECTOR
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground leading-none mb-8">
                            Бали, що відображають <br className="hidden md:block" /> вашу цінність
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl mb-6">
                            Бали, які ви вже бачите у своєму акаунті, відображають вашу активність, залученість і розвиток у системі LECTOR.
                        </p>
                        <div className="flex items-center gap-3 py-4 px-6 rounded-2xl bg-accent/[0.03] border border-accent/10 w-fit">
                            <RefreshCw className="h-4 w-4 text-accent animate-spin-slow" />
                            <p className="text-sm text-muted-foreground/80 font-medium">
                                Усе, що впливає на ваші бали зараз на сайті, буде синхронізовано й відображено в додатку після його запуску.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 1: What it means */}
            <section className="py-20 bg-accent/[0.01]">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center md:text-left md:mx-0">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground mb-6">
                            Що означає ця цифра
                        </h2>
                        <div className="space-y-4 text-base md:text-lg text-muted-foreground/80 leading-relaxed">
                            <p>
                                Це ваш поточний показник активності в екосистемі LECTOR. Він формується на основі ваших дій у системі та відображає, як ви включаєтесь у платформу вже зараз.
                            </p>
                            <p>
                                Бали — це не декоративний елемент. Вони допомагають фіксувати вашу присутність, прогрес і ранню активність у середовищі LECTOR.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: How to earn (Refined) */}
            <section className="py-24 border-y border-border/50 bg-background relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/[0.01] -skew-x-12 transform origin-top pointer-events-none" />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-6">
                            За що нараховуються бонуси
                        </h2>
                        <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                            Виконуйте корисні дії на платформі, розвивайте свій профіль і накопичуйте внутрішні бонуси екосистеми LECTOR.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Group: Site */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                                    <PenSquare className="h-4 w-4 text-accent" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-widest text-foreground/90">На сайті</h3>
                            </div>
                            
                            <div className="grid gap-4">
                                {bonusRules.filter(r => r.platform === 'site' && r.isActive).map((rule) => (
                                    <RuleCard key={rule.id} rule={rule} />
                                ))}
                            </div>
                        </div>

                        {/* Group: App */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                                    <Zap className="h-4 w-4 text-accent" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-widest text-foreground/90">У додатку</h3>
                            </div>
                            
                            <div className="grid gap-4">
                                {bonusRules.filter(r => r.platform === 'app' && r.isActive).map((rule) => (
                                    <RuleCard key={rule.id} rule={rule} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer & CTA */}
                    <div className="mt-20 pt-12 border-t border-border/40">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-xl">
                                <p className="text-sm text-muted-foreground/60 font-medium leading-relaxed italic">
                                    * Бонуси — це внутрішній ресурс екосистеми LECTOR. Вони не є готівкою і не підлягають прямому виведенню. Використовуються для активації преміум-можливостей платформи.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-right">
                                <p className="text-sm font-bold uppercase tracking-widest text-accent/80">
                                    Заповніть профіль, публікуйте контент і розкривайте можливості екосистеми
                                </p>
                                <ArrowRight className="h-4 w-4 text-accent animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: Benefits */}
            <section className="py-24 bg-accent/[0.02]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground mb-6">
                                Що дають вам бали
                            </h2>
                            <p className="text-lg text-muted-foreground/80 font-medium leading-relaxed mb-8">
                                Бали в LECTOR — це не просто цифра. Вони допомагають побачити, що ваша активність має результат і вже зараз формує вашу роль у системі.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                                {[
                                    {
                                        title: "Відчуття прогресу",
                                        text: "Ви бачите, що ваші дії не зникають безслідно, а складаються в реальний поступ."
                                    },
                                    {
                                        title: "Посилення присутності",
                                        text: "Активність на платформі формує вашу видимість і відчуття включеності в екосистему."
                                    },
                                    {
                                        title: "Зв’язок зі статусами",
                                        text: "Бали працюють поряд зі статусами, відзнаками та загальною логікою розвитку присутності."
                                    },
                                    {
                                        title: "Основа для app",
                                        text: "Те, що ви формуєте зараз на сайті, стане частиною вашої повної присутності в додатку."
                                    }
                                ].map((benefit, i) => (
                                    <div key={i} className="space-y-2">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-accent flex items-center gap-2">
                                            <Zap className="h-3 w-3" />
                                            {benefit.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground/70 leading-relaxed font-medium">
                                            {benefit.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-[3rem] bg-accent/5 border border-accent/10 flex items-center justify-center p-12 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_70%)]" />
                                <Coins className="h-48 w-48 text-accent/20 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4 & 5: Connections */}
            <section className="py-20 border-t border-border/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                                Бали, Статус та Довіра
                            </h2>
                            <p className="text-muted-foreground/80 font-medium leading-relaxed">
                                У LECTOR бали не існують окремо від загальної логіки платформи. Вони працюють у зв’язці зі статусами, рівнем довіри (надійністю), сезонними механіками та розвитком вашої присутності в системі.
                            </p>
                            <p className="text-muted-foreground/80 font-medium leading-relaxed">
                                Бали відображають вашу енергію та активність, тоді як довіра та статус фіксують вашу вагу та надійність в екосистемі.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                                Бали та Launch Referral Sprint
                            </h2>
                            <p className="text-muted-foreground/80 font-medium leading-relaxed">
                                Ранній етап розвитку LECTOR уже включає Sprint-програму, яка допомагає формувати перше коло активних учасників платформи.
                            </p>
                            <p className="text-muted-foreground/80 font-medium leading-relaxed">
                                Участь у цій динаміці вже зараз підсилює вашу присутність у системі й допомагає раніше включитися в екосистему платформи.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6: Sync */}
            <section className="py-20 bg-foreground text-background">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8">
                        Усе, що ви формуєте зараз, переходить далі
                    </h2>
                    <div className="space-y-6 text-lg text-background/70 font-light leading-relaxed">
                        <p>
                            Сайт уже є живою частиною екосистеми LECTOR. Профіль, активність, контент і участь у системі балів, які ви формуєте тут, будуть автоматично синхронізовані з додатком після його запуску.
                        </p>
                        <p>
                            Те, що ви створюєте зараз, не зникає. Це вже частина вашої присутності на платформі.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 7: Getting Started */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground mb-10 text-center">
                            З чого почати вже зараз
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Заповнити ключові блоки профілю",
                                "Опублікувати перший пост",
                                "Дослідити Launch Referral Sprint",
                                "Переглянути статусну систему",
                                "Познайомитися з іншими учасниками",
                                "Активніше включитися в екосистему сайту"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-accent/[0.03] border border-accent/5 hover:border-accent/20 transition-colors">
                                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                                    <span className="text-sm md:text-base font-semibold text-foreground/80">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="py-24 border-t border-border/50 bg-accent/[0.01]">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-6">
                        Посильте свою присутність <br /> у LECTOR вже зараз
                    </h2>
                    <p className="text-lg text-muted-foreground/70 font-medium max-w-2xl mx-auto mb-12">
                        Те, що ви робите сьогодні на сайті, уже працює на ваш профіль, активність і подальшу синхронізацію з додатком.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button 
                            asChild
                            className="h-14 px-10 rounded-full font-black uppercase tracking-widest text-[10px] bg-foreground text-background hover:bg-foreground/90 shadow-2xl shadow-foreground/20 transition-all hover:-translate-y-1"
                        >
                            <Link href={user?.uid ? `/profile/${user.uid}?edit=true` : '#'}>
                                Посилити профіль
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button 
                            asChild
                            variant="outline"
                            className="h-14 px-10 rounded-full font-black uppercase tracking-widest text-[10px] border-muted/40 hover:bg-background transition-all hover:-translate-y-1"
                        >
                            <Link href="/status">
                                Перейти до статусів
                            </Link>
                        </Button>
                        <Button 
                            asChild
                            variant="outline"
                            className="h-14 px-10 rounded-full font-black uppercase tracking-widest text-[10px] border-muted/40 hover:bg-background transition-all hover:-translate-y-1"
                        >
                            <Link href="/trust-verification">
                                Рівні довіри
                            </Link>
                        </Button>
                        <Button 
                            asChild
                            variant="outline"
                            className="h-14 px-10 rounded-full font-black uppercase tracking-widest text-[10px] border-muted/40 hover:bg-background transition-all hover:-translate-y-1"
                        >
                            <Link href="/referral-sprint-program">
                                Sprint-програма
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* DISCLAIMER */}
            <section className="py-12 bg-background border-t border-border/30">
                <div className="container mx-auto px-6">
                    <p className="text-[10px] md:text-[11px] text-muted-foreground/40 text-center max-w-3xl mx-auto uppercase tracking-widest font-medium leading-relaxed">
                        Бали (Bonus Credits) є внутрішнім інструментом вимірювання активності та залученості учасників екосистеми LECTOR. 
                        Вони не є грошовими коштами, не мають ринкової вартості та не можуть бути обміняні на готівку або виведені з системи. 
                        Використання балів регулюється внутрішньою політикою платформи.
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    );
}

const Activity = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

function RuleCard({ rule }: { rule: BonusRule }) {
    return (
        <div className="group relative p-5 md:p-6 rounded-2xl bg-white border border-border/40 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/[0.02] transition-all duration-300 flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-grow">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-accent/50">{rule.category}</span>
                    {rule.platform === 'app' && (
                         <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-accent/5 text-accent font-black uppercase tracking-tighter">APP-ONLY</span>
                    )}
                </div>
                <h4 className="text-base md:text-lg font-black uppercase tracking-tight text-foreground group-hover:text-accent transition-colors leading-tight">
                    {rule.title}
                </h4>
                <p className="text-sm text-muted-foreground/70 font-medium leading-snug max-w-[90%]">
                    {rule.description}
                </p>
            </div>
            
            <div className="shrink-0 pt-1">
                <div className="px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center min-w-[70px]">
                    <span className="text-xs md:text-sm font-black text-accent whitespace-nowrap">
                        +{rule.amount} {rule.unit}
                    </span>
                </div>
            </div>
        </div>
    );
}
