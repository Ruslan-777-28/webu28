'use client';

import React from 'react';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { PageCloseButton } from '@/components/page-close-button';
import { 
  ShieldCheck, 
  UserCheck, 
  Award, 
  Shield, 
  Circle, 
  TrendingUp, 
  Zap, 
  Star, 
  Lock, 
  Unlock,
  CheckCircle2,
  Info,
  CreditCard,
  Target
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function TrustLevelsPage() {
  const levels = [
    {
      id: 0,
      name: 'Без індикації',
      icon: Circle,
      description: 'Початковий або майже порожній профіль. Користувач ще не підтвердив достатню кількість ознак реальності.',
      meaning: 'Такий профіль може почати шлях, але має мінімальні можливості.',
      color: 'text-muted-foreground/40',
      bgColor: 'bg-muted/5'
    },
    {
      id: 1,
      name: 'Базова присутність',
      icon: Shield,
      description: 'Акаунт створено, базові дані частково заповнені. Платформа бачить перші ознаки реального користувача.',
      capabilities: ['Базовий перегляд', 'Мінімальне наповнення профілю', 'Обмежена галерея (1 фото)'],
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/5'
    },
    {
      id: 2,
      name: 'Заповнений профіль',
      icon: UserCheck,
      description: 'Користувач заповнив основні дані: ім’я, аватар, категорію, мову та опис.',
      capabilities: ['Більше елементів у профілі', 'До 3 зображень у галереї', 'Розширене відображення'],
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/5'
    },
    {
      id: 3,
      name: 'Підтверджений профіль',
      icon: ShieldCheck,
      description: 'Користувач підтвердив важливі сигнали: email, соціальний логін або платіжний метод.',
      capabilities: ['Вища видимість', 'До 5 фото в галереї', 'Доступ до розширених функцій'],
      color: 'text-green-500',
      bgColor: 'bg-green-500/5'
    },
    {
      id: 4,
      name: 'Професійна довіра',
      icon: Award,
      description: 'Користувач демонструє реальну активність, корисну поведінку та має позитивну історію взаємодій.',
      capabilities: ['Повні можливості профілю', 'Участь у статусах та відзнаках', 'Пріоритетна позиція в екосистемі'],
      color: 'text-[#C5A059]',
      bgColor: 'bg-[#C5A059]/5'
    }
  ];

  const matrixData = [
    { feature: 'Публічна індикація', l0: 'Немає', l1: '1 сегмент', l2: '2 сегменти', l3: '3 сегменти', l4: '4 сегменти' },
    { feature: 'Галерея (фото)', l0: '0-1', l1: '1', l2: 'До 3', l3: 'До 5', l4: 'Розширена' },
    { feature: 'Типи комунікації', l0: 'Мінімум', l1: '1 тип', l2: 'До 2 типів', l3: 'До 3 типів', l4: 'Повний набір' },
    { feature: 'Видимість у пошуку', l0: 'Мінімальна', l1: 'Низька', l2: 'Базова', l3: 'Підвищена', l4: 'Пріоритетна' },
    { feature: 'Публікації', l0: 'Обмежено', l1: 'Обмежено', l2: 'Базово', l3: 'Розширено', l4: 'Повноцінно' },
    { feature: 'Монетизація', l0: 'Ні', l1: 'Ні', l2: 'Обмежено', l3: 'Доступно', l4: 'Повноцінно' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/10">
      <Navigation />
      <PageCloseButton fallbackHref="/" />
      
      <main className="flex-grow pt-24 pb-20">
        {/* HERO SECTION */}
        <section className="container mx-auto max-w-5xl px-6 mb-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
            <Zap className="w-3.5 h-3.5" />
            Profile Trust System
          </div>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
            Рівень довіри <br /> <span className="text-muted-foreground/30">профілю</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed mb-10">
            LECTOR відкриває можливості поступово — відповідно до заповненості профілю, підтвердження акаунта та реальної цінності користувача для екосистеми.
          </p>
          <div className="p-6 rounded-[32px] bg-muted/5 border border-muted/20 max-w-3xl mx-auto backdrop-blur-sm">
            <p className="text-sm md:text-base font-bold italic leading-relaxed text-foreground/80">
              “Ми не боремося з фейками напряму. Ми створюємо ієрархію доступу, де порожній або фейковий акаунт просто залишається на нижньому рівні.”
            </p>
          </div>
        </section>

        {/* WHY IT MATTERS */}
        <section className="container mx-auto max-w-6xl px-6 mb-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3">
                <div className="h-6 w-1.5 bg-primary rounded-full" />
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Чому це важливо</h2>
              </div>
              <div className="space-y-6 text-muted-foreground font-medium text-lg leading-relaxed">
                <p>
                  Платформа не має цінності від мільйона порожніх реєстрацій. Цінність LECTOR — це підтверджені користувачі, активні профілі та реальні взаємодії.
                </p>
                <p>
                  Порожній акаунт може існувати, але він не має повного впливу на екосистему. Чим більше ви підтверджуєте свій намір, тим більше інструментів відкриває платформа.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, label: 'Реальність', desc: 'Підтверджені сигнали' },
                { icon: TrendingUp, label: 'Розвиток', desc: 'Ріст можливостей' },
                { icon: Star, label: 'Статус', desc: 'Визнання спільноти' },
                { icon: ShieldCheck, label: 'Безпека', desc: 'Довіра та захист' }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-3xl bg-card border border-muted/20 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-black uppercase tracking-wider text-xs mb-1">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5 LEVELS OF TRUST */}
        <section className="bg-muted/5 py-32 border-y border-muted/10 mb-32">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Шкала розвитку довіри</h2>
              <p className="text-muted-foreground font-medium">Ваш профіль розвивається разом із рівнем вашої участі</p>
            </div>

            <div className="relative">
              {/* Desktop Connecting Line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-muted/20 via-primary/10 to-muted/20 -translate-y-1/2 z-0" />
              
              <div className="grid lg:grid-cols-5 gap-8 relative z-10">
                {levels.map((level, i) => (
                  <div key={i} className="group flex flex-col items-center">
                    <div className={cn(
                      "w-20 h-20 rounded-[28px] mb-6 flex items-center justify-center border border-white/10 shadow-lg transition-all duration-500 group-hover:scale-110",
                      level.bgColor, level.color
                    )}>
                      <level.icon className="w-10 h-10" />
                    </div>
                    <div className="text-center space-y-3">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Level {level.id}</div>
                        <h3 className="font-black uppercase tracking-tight text-lg leading-none">{level.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-[200px] mx-auto">
                        {level.description}
                      </p>
                      {level.capabilities && (
                        <div className="pt-4 flex flex-col gap-1.5 items-center">
                           {level.capabilities.map((cap, idx) => (
                             <div key={idx} className="flex items-center gap-1.5">
                               <CheckCircle2 className="w-3 h-3 text-primary/40" />
                               <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">{cap}</span>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CAPABILITIES MATRIX */}
        <section className="container mx-auto max-w-5xl px-6 mb-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Матриця можливостей</h2>
            <p className="text-muted-foreground font-medium">Як рівень довіри впливає на ваш функціонал</p>
          </div>

          <div className="overflow-x-auto rounded-[32px] border border-muted/20 shadow-xl bg-card">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-muted/10 bg-muted/5">
                  <th className="p-6 text-left text-xs font-black uppercase tracking-widest text-muted-foreground/60">Можливість</th>
                  <th className="p-6 text-center text-xs font-black uppercase tracking-widest opacity-40">L0</th>
                  <th className="p-6 text-center text-xs font-black uppercase tracking-widest text-blue-500">L1</th>
                  <th className="p-6 text-center text-xs font-black uppercase tracking-widest text-indigo-500">L2</th>
                  <th className="p-6 text-center text-xs font-black uppercase tracking-widest text-green-500">L3</th>
                  <th className="p-6 text-center text-xs font-black uppercase tracking-widest text-[#C5A059]">L4</th>
                </tr>
              </thead>
              <tbody>
                {matrixData.map((row, i) => (
                  <tr key={i} className="border-b border-muted/5 last:border-0 hover:bg-muted/5 transition-colors">
                    <td className="p-6 font-black uppercase tracking-tight text-xs text-foreground/80">{row.feature}</td>
                    <td className="p-6 text-center text-[11px] font-bold text-muted-foreground/50">{row.l0}</td>
                    <td className="p-6 text-center text-[11px] font-bold text-muted-foreground/70">{row.l1}</td>
                    <td className="p-6 text-center text-[11px] font-bold text-muted-foreground/80">{row.l2}</td>
                    <td className="p-6 text-center text-[11px] font-bold text-foreground/90">{row.l3}</td>
                    <td className="p-6 text-center text-[11px] font-black text-foreground">{row.l4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
            * Дана таблиця є концептуальною та описує загальний вектор розвитку профілю
          </p>
        </section>

        {/* NON-EMPTY PROFILE PRINCIPLE */}
        <section className="container mx-auto max-w-4xl px-6 mb-32">
          <div className="relative overflow-hidden rounded-[40px] bg-foreground text-background p-10 md:p-16 shadow-2xl">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 blur-[120px] rounded-full" />
            <div className="relative z-10 grid md:grid-cols-5 gap-10 items-center">
              <div className="md:col-span-2">
                 <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 text-primary" />
                 </div>
                 <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">Принцип <br /> непорожнього <br /> профілю</h2>
              </div>
              <div className="md:col-span-3 space-y-6 text-background/70 font-medium leading-relaxed">
                <p>
                  У LECTOR профіль — це не просто реєстрація. Це вітрина вашої присутності та довіри спільноти.
                </p>
                <p>
                  Ми створюємо умови, де найбільші можливості отримують ті, хто наповнює профіль, підтверджує свою реальність та створює цінність для інших учасників.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MINIMUM BALANCE */}
        <section className="container mx-auto max-w-4xl px-6 mb-32">
          <Card className="rounded-[32px] border border-muted/20 bg-card overflow-hidden shadow-sm">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start">
               <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-primary" />
               </div>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight">Сигнал реальності</h3>
                    <p className="text-muted-foreground/60 text-xs font-black uppercase tracking-widest">Активація балансу як крок довіри</p>
                  </div>
                  <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                    <p>
                      Платформа може використовувати мінімальну активацію балансу як один із сигналів довіри. Це не є оплатою за реєстрацію — кошти залишаються на вашому балансі та доступні для використання всередині екосистеми.
                    </p>
                    <p className="text-foreground/80 font-bold">
                      Для користувача це маленький крок. Для платформи — важливий сигнал того, що акаунт належить реальній людині з наміром взаємодіяти.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                     <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Реальний платіжний метод</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Захист від спам-акаунтів</span>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        </section>

        {/* FINAL BLOCK */}
        <section className="container mx-auto max-w-5xl px-6 text-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Довіра відкриває <br /> можливості</h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-medium leading-relaxed">
              LECTOR будує екосистему, де права, статуси й видимість відкриваються поступово. Кожен ваш крок — це внесок у вашу власну цифрову репутацію.
            </p>
            <div className="pt-10 flex flex-col items-center gap-4">
               <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Lector Ecosystem 2026</div>
               <div className="flex gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-6 h-1 rounded-full bg-primary/20" />
                  ))}
               </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
