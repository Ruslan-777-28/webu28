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
    Clock,
    Target,
    TrendingUp,
    Award,
    CheckCircle2,
    Info,
    HelpCircle,
    ChevronRight,
    ArrowRight,
    Gem,
    Bot,
    Fingerprint,
    HeartHandshake,
    Scale,
    Route
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function FunctionalityPage() {
    const foundations = [
        {
            icon: Zap,
            title: "Стартові можливості",
            desc: "Після створення акаунта ви отримуєте базовий набір функцій для знайомства з екосистемою та першого оформлення профілю.",
            examples: ["Базовий профіль", "Стартові взаємодії", "Обмежені інструменти"]
        },
        {
            icon: ShieldCheck,
            title: "Додаткові функції",
            desc: "Заповнення даних, налаштування комунікацій та верифікація відкривають нові рівні соціальних та професійних можливостей.",
            examples: ["Розширений профіль", "Типи комунікації", "Інструменти взаємодії"]
        },
        {
            icon: LineChart,
            title: "Активність та статус",
            desc: "Історія ваших успішних взаємодій, залученість та внутрішній статус впливають на вашу видимість та пріоритет у системі.",
            examples: ["Історія активності", "Рейтингова вага", "Статусна присутність"]
        },
        {
            icon: UserCheck,
            title: "Рівень довіри",
            desc: "Рівень довіри відображає зрілість акаунта. Чим він вищий, тим більше лімітів знімається та відкривається спецфункцій.",
            examples: ["Підтверджена присутність", "Посилення профілю", "Розширені ліміти"]
        }
    ];

    const factors = [
        { title: "Заповненість профілю", desc: "Аватар, опис, категорії та мови — базові сигнали вашої активності." },
        { title: "Підтвердження даних", desc: "Верифікація контактів створює фундамент безпеки для інших учасників." },
        { title: "Налаштування зв'язку", desc: "Активація способів комунікації відкриває нові формати професійних сесій." },
        { title: "Історія взаємодій", desc: "Кожна успішна сесія та позитивний відгук посилюють вагу вашого акаунта." },
        { title: "Якість контенту", desc: "Публікації та галерея формують вашу професійну ідентичність у спільноті." },
        { title: "Статусна динаміка", desc: "Отримання відзнак та ролей відкриває спеціальні права в екосистемі." },
        { title: "Сигнали довіри", desc: "Додаткові фактори підтвердження реальності знімають системні обмеження." }
    ];

    const matrixData = [
        { label: 'Профіль', s1: 'Базовий', s2: 'Ширший', s3: 'Посилений', s4: 'Повна вітрина' },
        { label: 'Галерея', s1: '1 фото', s2: 'До 3 фото', s3: 'До 5 фото', s4: 'Розширена' },
        { label: 'Комунікації', s1: 'Старт', s2: 'Більше типів', s3: 'Широкий доступ', s4: 'Повний спектр' },
        { label: 'Публікації', s1: 'Обмежено', s2: 'Базово', s3: 'Розширено', s4: 'Повноцінно' },
        { label: 'Видимість', s1: 'Мінімальна', s2: 'Покращена', s3: 'Підвищена', s4: 'Пріоритетна' },
        { label: 'Монетизація', s1: 'Ні', s2: 'Обмежено', s3: 'Доступно', s4: 'Повноцінно' },
    ];

    const faq = [
        { q: "Чи всі можливості доступні одразу?", a: "Ні, LECTOR використовує модель поступового відкриття функцій для забезпечення якості та безпеки спільноти." },
        { q: "Чому функції відкриваються кроками?", a: "Це дозволяє підтримувати реальних і активних користувачів, обмежуючи вплив порожніх акаунтів на екосистему." },
        { q: "Що найбільше впливає на розвиток?", a: "Поєднання заповненості профілю, підтвердження даних, реальної активності та вашого рівня довіри." },
        { q: "Як отримати повний доступ?", a: "Заповнюйте профіль, підтверджуйте дані, будьте активними та взаємодійте чесно з іншими учасниками." }
    ];

    return (
        <main className="min-h-screen bg-background selection:bg-primary/10">
            <Navigation />
            <PageCloseButton fallbackHref="/" />

            {/* HERO SECTION */}
            <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none select-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full bg-primary blur-[80px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <Unlock className="h-3.5 w-3.5" />
                        Логіка платформи
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Функціональність <br /> <span className="text-muted-foreground/30 text-2xl md:text-5xl">платформи LECTOR</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-3xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        У LECTOR користувач поступово відкриває нові можливості через розвиток профілю, підтвердження даних, активність та реальну цінність для спільноти.
                    </p>
                    <div className="max-w-2xl mx-auto p-6 rounded-[32px] bg-muted/5 border border-muted/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <p className="text-sm md:text-base font-bold italic text-foreground/80 leading-relaxed">
                            “Довіра відкриває можливості. Ми створюємо ієрархію доступу, де цінність мають підтверджені та активні профілі.”
                        </p>
                    </div>
                </div>
            </section>

            {/* LOGIC SECTION */}
            <section className="py-16 border-t border-muted/10">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-3">
                                <div className="h-6 w-1.5 bg-primary rounded-full" />
                                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Як працює логіка</h2>
                            </div>
                            <div className="space-y-5 text-muted-foreground font-medium text-lg md:text-xl leading-relaxed">
                                <p>
                                    LECTOR не орієнтується на кількість порожніх реєстрацій. Для платформи важлива реальна присутність та ідентичність користувача.
                                </p>
                                <p>
                                    Базовий акаунт може почати шлях, але повний вплив у платформі відкривається через заповнення профілю, підтвердження, активність і довіру.
                                </p>
                            </div>
                        </div>
                        <div className="p-1 rounded-[32px] bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
                            <div className="bg-card rounded-[31px] p-8 space-y-6 shadow-sm border border-muted/20">
                                <div className="space-y-4">
                                    {[
                                        { id: "01", label: "Базовий старт" },
                                        { id: "02", label: "Наповнення та підтвердження" },
                                        { id: "03", label: "Активність та довіра" },
                                        { id: "04", label: "Професійна присутність", active: true }
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex items-center gap-5 group">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl border flex items-center justify-center font-black text-xs transition-colors",
                                                step.active 
                                                ? "bg-primary/10 border-primary/20 text-primary shadow-sm" 
                                                : "bg-muted/5 border-muted/20 text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary"
                                            )}>
                                                {step.id}
                                            </div>
                                            <div className={cn(
                                                "uppercase tracking-tight text-sm",
                                                step.active ? "font-black text-primary" : "font-bold text-foreground/90"
                                            )}>
                                                {step.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOUNDATIONS */}
            <section className="py-16 bg-muted/5 border-y border-muted/10">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">4 основи розвитку</h2>
                        <p className="text-muted-foreground font-medium max-w-lg mx-auto text-base">Фундамент, на якому будуються ваші можливості в екосистемі LECTOR</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {foundations.map((item, i) => (
                            <Card key={i} className="group relative overflow-hidden bg-card border-muted/20 rounded-[32px] hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                                <CardContent className="p-8 space-y-6">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                                        <item.icon className="h-7 w-7" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-black uppercase tracking-tight text-foreground leading-none">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed font-medium min-h-[60px]">
                                            {item.desc}
                                        </p>
                                        <div className="pt-4 flex flex-col gap-2 border-t border-muted/10">
                                            {item.examples.map((ex, idx) => (
                                                <div key={idx} className="flex items-center gap-2.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-foreground/60">{ex}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* PHILOSOPHY */}
            <section className="py-20 border-b border-muted/10">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-14 space-y-5">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em]">
                            <Gem className="h-3.5 w-3.5" />
                            Цінності
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Фундаментальні принципи</h2>
                        <p className="text-base md:text-lg text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                            LECTOR — це екосистема, де розвиток профілю не контролюється ручним втручанням, зовнішнім регулятором чи штучними привілеями. Можливості відкриваються автоматизовано, на основі реальних дій користувача.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Bot, title: "Автоматизація", desc: "Можливості відкриваються автоматично за заздалегідь визначеною логікою, без ручного суб'єктивного рішення." },
                            { icon: Route, title: "Реальний шлях", desc: "Тільки послідовність дій, підтвердження, активність і якісна взаємодія формують роль користувача в системі." },
                            { icon: Fingerprint, title: "Децентралізація", desc: "Базова логіка розвитку не залежить від стороннього впливу або суб'єктивних рішень модератора." },
                            { icon: ShieldCheck, title: "Довіра як основа", desc: "Рівень довіри — не декоративний маркер. Він реально впливає на логіку розвитку та відкриття функцій." },
                            { icon: Scale, title: "Якість, а не швидкість", desc: "Для LECTOR головне — осмисленість, безпека, комфорт і якість екосистеми, а не форсований темп." },
                            { icon: HeartHandshake, title: "Без штучних привілеїв", desc: "Неможливо купити фейковий статус або штучне досягнення. Профіль посилюється лише реальною присутністю." }
                        ].map((p, i) => (
                            <div key={i} className="p-8 rounded-[32px] bg-card border border-muted/20 space-y-5 group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-500">
                                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                                    <p.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-base font-black uppercase tracking-tight text-foreground">{p.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FACTORS */}
            <section className="py-16">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-12 gap-12">
                        <div className="md:col-span-4 space-y-5">
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">Що впливає на відкриття</h2>
                            <p className="text-base text-muted-foreground font-medium leading-relaxed">
                                Кілька ключових факторів визначають глибину та швидкість відкриття функціоналу платформи.
                            </p>
                        </div>
                        <div className="md:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-10">
                            {factors.map((f, i) => (
                                <div key={i} className="space-y-2 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                        <h4 className="font-black uppercase tracking-tight text-sm text-foreground/90">{f.title}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed pl-5 opacity-90">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SCENARIO */}
            <section className="py-20 bg-foreground text-background overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[80px] pointer-events-none" />
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Шлях розвитку профілю</h2>
                        <p className="text-background/50 font-medium max-w-xl mx-auto uppercase tracking-widest text-xs">
                            Поступовий розвиток акаунта всередині екосистеми
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden lg:block absolute top-[40px] left-0 right-0 h-0.5 bg-background/10 z-0" />
                        
                        <div className="grid lg:grid-cols-5 gap-10 relative z-10">
                            {[
                                { step: 1, label: "Новий акаунт", desc: "Базовий старт та знайомство", icon: Zap },
                                { step: 2, label: "Заповнений профіль", desc: "Аватар, опис та категорії", icon: UserCheck },
                                { step: 3, label: "Підтверджена присутність", desc: "Посилення через верифікацію", icon: ShieldCheck },
                                { step: 4, label: "Активний учасник", desc: "Взаємодія та активність", icon: TrendingUp },
                                { step: 5, label: "Професійна присутність", desc: "Повна вітрина та пріоритет", icon: Award }
                            ].map((s, i) => (
                                <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 group">
                                    <div className="w-20 h-20 rounded-[28px] bg-background/5 border border-background/10 flex items-center justify-center text-background group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500">
                                        <s.icon className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-xs font-black text-primary uppercase tracking-[0.2em]">Крок {s.step}</div>
                                        <h3 className="font-black uppercase tracking-tight text-lg leading-tight">{s.label}</h3>
                                        <p className="text-xs text-background/50 font-medium leading-relaxed max-w-[160px] mx-auto lg:mx-0">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="mt-12 text-center text-xs font-black uppercase tracking-[0.2em] text-background/20">
                        * Це концептуальний шлях розвитку профілю, а не жорстка автоматична схема.
                    </p>
                </div>
            </section>

            {/* MATRIX */}
            <section className="py-16">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-12 space-y-5">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Матриця можливостей</h2>
                        <p className="text-muted-foreground font-medium text-base max-w-2xl mx-auto leading-relaxed">
                            Матриця показує концептуальну логіку зростання функціональності. Точні правила доступу можуть деталізуватися окремо.
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-[32px] border border-muted/20 shadow-xl bg-card">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-muted/10 bg-muted/5">
                                    <th className="p-6 text-left text-xs font-black uppercase tracking-widest text-foreground/60 whitespace-nowrap">Напрям</th>
                                    <th className="p-6 text-center text-xs font-black uppercase tracking-widest opacity-50 whitespace-nowrap">Старт</th>
                                    <th className="p-6 text-center text-xs font-black uppercase tracking-widest text-primary/70 whitespace-nowrap">Заповнений</th>
                                    <th className="p-6 text-center text-xs font-black uppercase tracking-widest text-primary/90 whitespace-nowrap">Підтверджений</th>
                                    <th className="p-6 text-center text-xs font-black uppercase tracking-widest text-primary whitespace-nowrap">Сильний</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matrixData.map((row, i) => (
                                    <tr key={i} className="border-b border-muted/5 last:border-0 hover:bg-muted/5 transition-colors group">
                                        <td className="p-6 font-black uppercase tracking-tight text-sm text-foreground/90 group-hover:text-primary transition-colors">{row.label}</td>
                                        <td className="p-6 text-center text-xs font-bold text-muted-foreground/70">{row.s1}</td>
                                        <td className="p-6 text-center text-xs font-bold text-muted-foreground/90">{row.s2}</td>
                                        <td className="p-6 text-center text-xs font-bold text-foreground">{row.s3}</td>
                                        <td className="p-6 text-center text-sm font-black text-foreground">{row.s4}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Detailed Matrix CTA */}
                    <div className="mt-14 text-center space-y-6">
                        <p className="text-sm text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
                            Для тих, хто хоче глибше зрозуміти, як саме відкриваються можливості, які умови впливають на рівень доступу та як формується розвиток профілю.
                        </p>
                        <Link
                            href="/info/detailed-matrix"
                            className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-foreground text-background font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl group"
                        >
                            Повна матриця можливостей
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* NON-EMPTY PROFILE */}
            <section className="py-16">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="p-12 md:p-20 rounded-[48px] bg-card border border-muted/20 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 grid md:grid-cols-12 gap-12 items-center">
                            <div className="md:col-span-5 space-y-6">
                                <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary">
                                    <Target className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-[0.9]">Принцип <br /> непорожнього <br /> профілю</h2>
                            </div>
                            <div className="md:col-span-7 space-y-6 text-muted-foreground font-medium text-lg md:text-xl leading-relaxed">
                                <p>
                                    У LECTOR профіль — це не просто запис у базі. Це ваша професійна вітрина, яка відображає рівень довіри спільноти.
                                </p>
                                <p className="text-foreground/90 font-bold italic">
                                    Порожній акаунт може існувати, але він не має такої самої ваги, як профіль із чіткою ідентичністю, активністю та підтвердженою цінністю.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BRIDGE */}
            <section className="py-16 border-t border-muted/10">
                <div className="container mx-auto px-6 max-w-4xl text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Довіра і відкриття можливостей</h2>
                        <p className="text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed text-base">
                            Рівні довіри пояснюють, як підтверджена присутність користувача може впливати на його можливості в екосистемі LECTOR.
                        </p>
                    </div>
                    <Link 
                        href="/info/trust-levels" 
                        className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-primary text-white font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 group"
                    >
                        Детальніше про рівні довіри
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* PRACTICAL STEPS */}
            <section className="py-16 bg-muted/5 border-y border-muted/10">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Заповнити дані профілю",
                                "Додати фото та аватар",
                                "Обрати категорії та підкатегорії",
                                "Налаштувати комунікації",
                                "Бути активним послідовно",
                                "Взаємодіяти чесно та якісно"
                            ].map((step, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-card border border-muted/10 shadow-sm flex items-center gap-4 group">
                                    <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                    <span className="text-xs font-black uppercase tracking-tight text-foreground/70 group-hover:text-foreground transition-colors">{step}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-8">
                             <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">Як посилити <br /> свій профіль</h2>
                             <p className="text-base text-muted-foreground font-medium leading-relaxed">
                                Розвиток профілю — це формування вашої професійної вітрини в екосистемі. Кожен крок посилює вашу присутність, відкриваючи доступ до галереї, публікацій та пріоритетної видимості.
                             </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="text-center mb-16 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mx-auto">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Поширені питання</h2>
                    </div>
                    <div className="space-y-5">
                        {faq.map((item, i) => (
                            <div key={i} className="p-8 rounded-[32px] bg-muted/5 border border-muted/10 space-y-3">
                                <h4 className="font-black uppercase tracking-tight text-sm text-foreground">{item.q}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL BLOCK */}
            <section className="py-24 text-center space-y-12">
                <div className="container mx-auto px-6 max-w-4xl space-y-8">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">Можливості зростають <br /> разом із профілем</h2>
                    <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        У LECTOR функціональність розвивається осмислено. Це дозволяє нам зберігати якість взаємодії та підтримувати сильні, підтверджені профілі.
                    </p>
                </div>
                <div className="flex flex-col items-center gap-6">
                     <div className="flex gap-1.5">
                         {[1, 2, 3, 4, 5].map(i => (
                             <div key={i} className="w-8 h-1 rounded-full bg-primary/20" />
                         ))}
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 leading-none">
                        Окремі розділи цієї моделі будуть деталізовані додатково.
                     </p>
                </div>
            </section>

            <Footer />
        </main>
    );
}
