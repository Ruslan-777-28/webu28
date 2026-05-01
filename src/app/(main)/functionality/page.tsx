'use client';

import React from 'react';
import { Navigation } from '@/components/navigation';
import { PageCloseButton } from '@/components/page-close-button';
import Footer from '@/components/layout/footer';
import { 
    Zap, 
    ShieldCheck, 
    UserCheck, 
    LineChart, 
    Unlock,
    Clock
} from 'lucide-react';

export default function FunctionalityPage() {
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
                            <Unlock className="h-3 w-3" />
                            Розвиток платформи
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground leading-none mb-8">
                            Функціональність <br className="hidden md:block" /> платформи
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-3xl mb-6">
                            На цій сторінці буде описано, як користувач поступово відкриває можливості LECTOR через заповнення профілю, активність, довіру, статуси та взаємодію з платформою.
                        </p>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="py-20 bg-accent/[0.01]">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl">
                        <div className="space-y-12">
                            {/* Intro Text */}
                            <div className="space-y-6 text-base md:text-lg text-muted-foreground/80 leading-relaxed font-light">
                                <p>
                                    <span className="text-foreground font-medium italic">LECTOR</span> розвивається як платформа, де функціональність користувача може відкриватися поступово. Базовий акаунт отримує стартові можливості, а подальше заповнення профілю, підтвердження даних, активність, якість взаємодії та рівень довіри можуть відкривати ширший доступ до інструментів платформи.
                                </p>
                            </div>

                            {/* Key Areas (Placeholders for future content) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 rounded-2xl bg-white border border-border/40 hover:border-accent/20 transition-all duration-300 space-y-4">
                                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                                        <Zap className="h-5 w-5 text-accent" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
                                        Стартові можливості
                                    </h3>
                                    <p className="text-sm text-muted-foreground/70 leading-relaxed font-medium">
                                        Опис функцій, які доступні кожному користувачу відразу після реєстрації базового акаунта.
                                    </p>
                                </div>

                                <div className="p-8 rounded-2xl bg-white border border-border/40 hover:border-accent/20 transition-all duration-300 space-y-4">
                                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                                        <ShieldCheck className="h-5 w-5 text-accent" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
                                        Додаткові функції
                                    </h3>
                                    <p className="text-sm text-muted-foreground/70 leading-relaxed font-medium">
                                        Як заповнення профілю та верифікація даних впливають на відкриття професійних та соціальних інструментів.
                                    </p>
                                </div>

                                <div className="p-8 rounded-2xl bg-white border border-border/40 hover:border-accent/20 transition-all duration-300 space-y-4">
                                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                                        <LineChart className="h-5 w-5 text-accent" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
                                        Активність та Статус
                                    </h3>
                                    <p className="text-sm text-muted-foreground/70 leading-relaxed font-medium">
                                        Вплив вашої залученості, якості взаємодії та внутрішнього статусу на пріоритетність та доступ до сервісів.
                                    </p>
                                </div>

                                <div className="p-8 rounded-2xl bg-white border border-border/40 hover:border-accent/20 transition-all duration-300 space-y-4">
                                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                                        <UserCheck className="h-5 w-5 text-accent" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
                                        Рівень довіри
                                    </h3>
                                    <p className="text-sm text-muted-foreground/70 leading-relaxed font-medium">
                                        Як підтвердження надійності профілю розширює ліміти та відкриває спеціальні можливості екосистеми.
                                    </p>
                                </div>
                            </div>

                            {/* Details List */}
                            <div className="pt-8 border-t border-border/40">
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground mb-8">
                                    На цій сторінці пізніше буде детально описано:
                                </h2>
                                <ul className="space-y-4">
                                    {[
                                        "які можливості доступні на старті;",
                                        "як відкриваються додаткові функції;",
                                        "як впливають заповнення профілю, верифікація, активність і статус;",
                                        "які обмеження можуть застосовуватись до базових або неповних акаунтів;",
                                        "як користувач може посилити свій профіль і отримати більше можливостей."
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                                            <span className="text-muted-foreground/80 font-medium leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PREPARATION NOTICE */}
            <section className="py-20 bg-foreground text-background">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <div className="flex justify-center mb-8">
                        <Clock className="h-12 w-12 text-background/30" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8">
                        Сторінка перебуває в підготовці
                    </h2>
                    <p className="text-lg text-background/70 font-light leading-relaxed">
                        Детальний опис рівнів доступу та функціональних можливостей буде додано пізніше. Ми працюємо над тим, щоб зробити шлях розвитку в LECTOR максимально прозорим та змістовним.
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    );
}
