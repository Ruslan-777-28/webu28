'use client';

import React from 'react';
import { Navigation } from '@/components/navigation';
import { PageCloseButton } from '@/components/page-close-button';
import Footer from '@/components/layout/footer';
import { 
    Unlock, 
    ShieldCheck, 
    Zap, 
    UserCheck, 
    TrendingUp, 
    Award, 
    Info, 
    Bot, 
    Fingerprint, 
    Scale, 
    HeartHandshake, 
    CheckCircle2,
    ArrowRight,
    Check,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DetailedMatrixPage() {
    const levels = [
        { id: 0, label: "Level 0", title: "Початковий профіль", desc: "Майже порожній акаунт, базове знайомство з платформою." },
        { id: 1, label: "Level 1", title: "Базовий акаунт", desc: "Перше наповнення, мінімальна присутність." },
        { id: 2, label: "Level 2", title: "Заповнений профіль", desc: "Наявність аватара, опису та основних категорій." },
        { id: 3, label: "Level 3", title: "Підтверджений профіль", desc: "Верифіковані дані та посилені сигнали присутності." },
        { id: 4, label: "Level 4", title: "Активний / сильний профіль", desc: "Реальна історія успішних взаємодій та активність." },
        { id: 5, label: "Level 5", title: "Професійна присутність", desc: "Високий рівень зрілості та повний набір інструментів." }
    ];

    const matrixRows = [
        { label: "Профіль", l0: "Базовий", l1: "Базовий+", l2: "Розширений", l3: "Повний", l4: "Пріоритет", l5: "Вітрина", open: "Заповнення даних" },
        { label: "Аватар / фото", l0: "Ні", l1: "1 фото", l2: "Аватар", l3: "Селфі-чек", l4: "Галерея", l5: "Бренд-бук", open: "Завантаження медіа" },
        { label: "Галерея", l0: "Ні", l1: "Ні", l2: "До 3 фото", l3: "До 5 фото", l4: "До 10 фото", l5: "Без ліміту", open: "Активність профілю" },
        { label: "Біо / опис", l0: "Ні", l1: "Коротко", l2: "Повно", l3: "Форматування", l4: "Посилання", l5: "Портфоліо", open: "Наповнення профілю" },
        { label: "Категорії", l0: "1", l1: "1", l2: "До 2", l3: "До 3", l4: "Розширено", l5: "Повно", open: "Спеціалізація" },
        { label: "Мови", l0: "1", l1: "1", l2: "До 2", l3: "До 3", l4: "До 5", l5: "Всі", open: "Налаштування профілю" },
        { label: "Комунікації", l0: "Чат", l1: "Чат+", l2: "Аудіо", l3: "Відео", l4: "Запис", l5: "Прямий ефір", open: "Налаштування зв'язку" },
        { label: "Відео за розкладом", l0: "Ні", l1: "Ні", l2: "Перегляд", l3: "Бронювання", l4: "Слоти", l5: "Розклад", open: "Календар, підтвердження" },
        { label: "Груповий відеочат", l0: "Ні", l1: "Ні", l2: "Ні", l3: "Участь", l4: "Обмежено", l5: "500+", open: "Довіра, статус" },
        { label: "Квиткові офери", l0: "Ні", l1: "Ні", l2: "Ні", l3: "Ні", l4: "Тестово", l5: "Продаж", open: "Монетизація, статус" },
        { label: "Публікації", l0: "Ні", l1: "Ні", l2: "Базово", l3: "Регулярно", l4: "Пріоритет", l5: "Редактор", open: "Історія активності" },
        { label: "Цифрові товари", l0: "Ні", l1: "Ні", l2: "Ні", l3: "До 3", l4: "До 10", l5: "Магазин", open: "Статусна динаміка" },
        { label: "Відгуки", l0: "Ні", l1: "Ні", l2: "Перегляд", l3: "Отримання", l4: "Модерація", l5: "Пріоритет", open: "Взаємодія" },
        { label: "Видимість", l0: "Мін", l1: "Мін", l2: "Норм", l3: "Покращена", l4: "Висока", l5: "Топ", open: "Сигнали довіри" },
        { label: "Статуси", l0: "Ні", l1: "Ні", l2: "Участь", l3: "Ранг", l4: "Відзнаки", l5: "Еліта", open: "Розвиток акаунта" },
        { label: "Довіра", l0: "0%", l1: "20%", l2: "40%", l3: "60%", l4: "80%", l5: "100%", open: "Підтвердження даних" },
        { label: "Монетизація", l0: "Ні", l1: "Ні", l2: "Обмежено", l3: "Доступно", l4: "Повно", l5: "VIP", open: "Комплексний розвиток" },
        { label: "Проф. інструменти", l0: "Ні", l1: "Ні", l2: "Ні", l3: "Базові", l4: "Аналітика", l5: "CRM", open: "Професійний шлях" }
    ];

    const renderMatrixValue = (value: string) => {
        if (value === "Так") {
            return <Check className="w-5 h-5 text-emerald-500 mx-auto stroke-[3]" aria-label="Так" />;
        }
        if (value === "Ні") {
            return <X className="w-4 h-4 text-red-500/30 mx-auto stroke-[3]" aria-label="Ні" />;
        }
        return value;
    };

    return (
        <main className="min-h-screen bg-background selection:bg-primary/10 flex flex-col">
            <Navigation />
            
            {/* 1. MATRIX TABLE SECTION (PRIMARY) */}
            <section className="pt-24 pb-12 md:pt-32 md:pb-16 relative">
                <PageCloseButton fallbackHref="/functionality" />
                
                <div className="container mx-auto px-4 md:px-8 max-w-[1600px]">
                    <div className="text-center mb-8 space-y-4 max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-foreground leading-[1.1] py-2">
                            ДЕТАЛЬНА МАТРИЦЯ МОЖЛИВОСТЕЙ
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-sm md:text-base uppercase tracking-widest opacity-80 leading-relaxed">
                            Повна карта рівнів, функцій та умов відкриття можливостей у LECTOR.
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-[32px] border border-muted/20 shadow-2xl bg-card">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-muted/10 bg-muted/5">
                                    <th className="px-4 py-6 text-left text-[11px] font-black uppercase tracking-widest text-foreground/60 sticky left-0 bg-card z-10 border-r border-muted/10">Напрям</th>
                                    <th className="px-4 py-6 text-center text-[11px] font-black uppercase tracking-widest opacity-40">Lvl 0</th>
                                    <th className="px-4 py-6 text-center text-[11px] font-black uppercase tracking-widest opacity-60">Lvl 1</th>
                                    <th className="px-4 py-6 text-center text-[11px] font-black uppercase tracking-widest opacity-80">Lvl 2</th>
                                    <th className="px-4 py-6 text-center text-[11px] font-black uppercase tracking-widest text-primary/70">Lvl 3</th>
                                    <th className="px-4 py-6 text-center text-[11px] font-black uppercase tracking-widest text-primary/90">Lvl 4</th>
                                    <th className="px-4 py-6 text-center text-[11px] font-black uppercase tracking-widest text-primary">Lvl 5</th>
                                    <th className="px-4 py-6 text-left text-[11px] font-black uppercase tracking-widest text-foreground/60 border-l border-muted/10">Що відкриває</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matrixRows.map((row, i) => (
                                    <tr key={i} className="border-b border-muted/5 last:border-0 hover:bg-muted/5 transition-colors group">
                                        <td className="px-4 py-6 font-black uppercase tracking-tight text-sm text-foreground/90 group-hover:text-primary transition-colors sticky left-0 bg-card z-10 border-r border-muted/10 whitespace-nowrap">{row.label}</td>
                                        <td className="px-4 py-6 text-center text-sm font-bold text-muted-foreground/50 whitespace-nowrap">{renderMatrixValue(row.l0)}</td>
                                        <td className="px-4 py-6 text-center text-sm font-bold text-muted-foreground/70 whitespace-nowrap">{renderMatrixValue(row.l1)}</td>
                                        <td className="px-4 py-6 text-center text-sm font-bold text-muted-foreground whitespace-nowrap">{renderMatrixValue(row.l2)}</td>
                                        <td className="px-4 py-6 text-center text-sm font-bold text-foreground/80 whitespace-nowrap">{renderMatrixValue(row.l3)}</td>
                                        <td className="px-4 py-6 text-center text-sm font-black text-foreground/90 whitespace-nowrap">{renderMatrixValue(row.l4)}</td>
                                        <td className="px-4 py-6 text-center text-sm font-black text-primary whitespace-nowrap">{renderMatrixValue(row.l5)}</td>
                                        <td className="px-4 py-6 text-left text-xs font-black uppercase tracking-widest text-muted-foreground/60 border-l border-muted/10 whitespace-nowrap">{row.open}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="mt-10 p-6 md:p-8 rounded-[32px] bg-muted/5 border border-muted/10 text-center max-w-4xl mx-auto">
                        <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
                            “Ця таблиця є концептуальною основою для майбутньої реалізації логіки доступів. Точні правила можуть деталізуватися окремо.”
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. SECONDARY HERO / INTRO */}
            <section className="py-16 md:py-20 border-y border-muted/10 bg-muted/5">
                <div className="container mx-auto px-6 text-center max-w-4xl space-y-6">
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-foreground leading-[1.1]">
                        Контекст та логіка системи
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed">
                        Повна карта розвитку профілю пояснює, як можливості користувача відкриваються через заповнення даних, підтвердження, активність, довіру та реальні дії. LECTOR будується як прозоре середовище, де ваш шлях визначає ваш статус.
                    </p>
                </div>
            </section>

            {/* 3. PHILOSOPHY SECTION */}
            <section className="py-20 border-b border-muted/10">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-black uppercase tracking-tight">Філософія системи</h2>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                LECTOR будується на принципах прозорості та справедливості. Ми не використовуємо ручне керування статусами — система сама визначає вашу роль на основі реальних сигналів.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { icon: ShieldCheck, title: "Довіра", desc: "Фундаментальний маркер вашої надійності." },
                                    { icon: Fingerprint, title: "Децентралізація", desc: "Розвиток без суб'єктивного втручання." },
                                    { icon: Bot, title: "Автоматизація", desc: "Миттєве відкриття функцій за умови." },
                                    { icon: HeartHandshake, title: "Без фейків", desc: "Неможливо купити штучний статус." }
                                ].map((p, i) => (
                                    <div key={i} className="space-y-2 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <p.icon className="w-4 h-4" />
                                            </div>
                                            <h4 className="font-black uppercase tracking-tight text-xs">{p.title}</h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-80">{p.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-8 rounded-[40px] bg-muted/5 border border-muted/10 relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 blur-[60px] rounded-full group-hover:bg-primary/10 transition-colors" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-xl font-black uppercase tracking-tight">Пріоритети</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">Лише реальні дії та якісна взаємодія впливають на ваш розвиток у системі.</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">Якість, комфорт і безпека спільноти для нас важливіші за швидкість набору маси акаунтів.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. LEVELS SECTION */}
            <section className="py-20 bg-muted/5 border-b border-muted/10">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">Рівні розвитку профілю</h2>
                        <p className="text-muted-foreground font-medium max-w-lg mx-auto text-sm uppercase tracking-widest">Еволюція вашого акаунта в екосистемі</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {levels.map((level) => (
                            <div key={level.id} className="p-8 rounded-[32px] bg-card border border-muted/20 space-y-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                                <div className="flex items-center justify-between">
                                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{level.label}</div>
                                    {level.id === 5 ? <Award className="w-5 h-5 text-primary" /> : <Zap className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />}
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{level.title}</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium opacity-90">{level.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. HOW IT OPENS SECTION */}
            <section className="py-20 bg-foreground text-background overflow-hidden relative">
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-primary/10 blur-[100px] pointer-events-none" />
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Як відкриваються <br /> можливості</h2>
                            <p className="text-lg text-background/60 font-medium leading-relaxed">
                                Можливості не з'являються випадково і не видаються вручну. Вони є наслідком ваших реальних дій на платформі.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Заповнення профілю та наповнення контентом",
                                    "Підтвердження контактів та верифікація даних",
                                    "Послідовна активність та якісна взаємодія",
                                    "Отримання позитивних відгуків від спільноти",
                                    "Участь у статусній динаміці та системні сигнали довіри"
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                        <span className="text-sm font-black uppercase tracking-tight text-background/80 group-hover:text-background transition-colors">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-10 rounded-[48px] bg-background/5 border border-background/10 backdrop-blur-sm space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-xl font-black uppercase tracking-tight text-primary">Що не працює в цій моделі</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-background">Без куплених статусів</h4>
                                        <p className="text-xs text-background/50 leading-relaxed font-medium">Неможливо отримати штучну вагу або псевдодосягнення просто заплативши.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-background">Без порожнього шуму</h4>
                                        <p className="text-xs text-background/50 leading-relaxed font-medium">Зовнішня активність без реального наповнення не відкриває глибокі функції.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-background">Без ручного регулювання</h4>
                                        <p className="text-xs text-background/50 leading-relaxed font-medium">Базова логіка розвитку не залежить від особистих вподобань модераторів.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FINAL BLOCK */}
            <section className="py-32 text-center space-y-12">
                <div className="container mx-auto px-6 max-w-4xl space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight">Ваші можливості <br /> визначаються вашим шляхом</h2>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        У LECTOR саме реальні дії, довіра, активність і якість присутності формують силу профілю та відкривають нові можливості для росту.
                    </p>
                </div>
                <div className="pt-10 flex flex-col items-center gap-8">
                     <div className="flex gap-2">
                         {[1, 2, 3, 4, 5, 6].map(i => (
                             <div key={i} className="w-12 h-1.5 rounded-full bg-primary/20" />
                         ))}
                     </div>
                     <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40 leading-none">
                        Lector Ecosystem Logic v1.0
                     </p>
                </div>
            </section>

            <Footer />
        </main>
    );
}
