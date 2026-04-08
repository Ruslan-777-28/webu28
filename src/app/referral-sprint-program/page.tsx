'use client';

import React from 'react';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { 
  Users, 
  UserPlus, 
  CreditCard, 
  Zap, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Clock,
  Layout,
  Bell,
  BarChart3
} from 'lucide-react';

export default function ReferralSprintProgramPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation subtitle="Referral Sprint Program" />
      
      <main className="flex-grow">
        {/* Block 1 — Hero */}
        <section className="py-20 px-4 border-b border-border/40">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 text-accent text-[10px] uppercase tracking-[0.2em] font-medium mb-6">
              <Zap className="h-3 w-3" />
              Launch Phase
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Launch Referral Sprint / <br className="hidden md:block" /> Ambassador Program
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Рання launch-програма для амбасадорів платформи, яка допомагає розширювати спільноту й отримувати bonus credits за реальний вклад у ріст LECTOR.
            </p>
          </div>
        </section>

        {/* Block 2 — Як працює програма */}
        <section className="py-20 px-4 bg-slate-50/50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold mb-12 text-center uppercase tracking-wider text-muted-foreground/80">Як працює програма</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border border-border flex items-center justify-center mb-6 shadow-sm group-hover:border-accent/40 transition-colors">
                  <UserPlus className="h-6 w-6 text-accent" />
                </div>
                <p className="text-sm font-medium mb-2 uppercase tracking-wide">Промокод</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Користувач отримує власний промокод для запрошення нових учасників.</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border border-border flex items-center justify-center mb-6 shadow-sm group-hover:border-accent/40 transition-colors">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <p className="text-sm font-medium mb-2 uppercase tracking-wide">Реєстрація</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Новий користувач реєструється з цим промокодом на платформі.</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border border-border flex items-center justify-center mb-6 shadow-sm group-hover:border-accent/40 transition-colors">
                  <CreditCard className="h-6 w-6 text-accent" />
                </div>
                <p className="text-sm font-medium mb-2 uppercase tracking-wide">Бонуси</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Власник промокоду отримує +3 bonus credits за реєстрацію.</p>
              </div>
            </div>
            
            <div className="mt-16 p-8 rounded-3xl bg-white border border-border/60 shadow-sm max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Повна активація</p>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">Додатковий бонус</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-xs text-muted-foreground mb-1">Завершення першої комунікації у ролі професіонала</p>
                  <p className="text-2xl font-mono font-bold text-accent">+5 bonus credits</p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-border/40 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60">Сумарно за активованого професіонала</p>
                <p className="text-3xl font-mono font-thin mt-2">8 bonus credits</p>
              </div>
            </div>
          </div>
        </section>

        {/* Block 3 — Важливо */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="border border-border/80 rounded-3xl overflow-hidden bg-white shadow-sm">
              <div className="bg-sidebar p-6 border-b border-border/20">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-sidebar-foreground/80" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-sidebar-foreground">Важливо розуміти</h2>
                </div>
              </div>
              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Clock className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2">Тимчасовість</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Програма є тимчасовою. Після завершення спринту нові реферальні нарахування можуть бути зупинені.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Zap className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2">Збереження бонусів</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Вже зароблені bonus credits не згорають після завершення програми та залишаються на вашому рахунку.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <CreditCard className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2">Внутрішній ресурс</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Bonus credits — це внутрішній ресурс платформи, а не фіатні гроші. Це одиниці доступу та активації.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Layout className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2">Використання</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Вони можуть бути використані для майбутніх цифрових активацій та преміум-опцій усередині екосистеми.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Block 5 — Як ми дивимось на вклад користувача (Premium Info Block) */}
        <section className="py-24 px-4 bg-sidebar text-sidebar-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full -ml-48 -mb-48 blur-3xl opacity-50" />
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="max-w-2xl">
              <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] font-light">Contribution Philosophy</span>
              </div>
              <h2 className="text-3xl font-thin tracking-tight mb-8">Внесок в екосистему:<br />доступний ліміт vs вклад</h2>
              
              <div className="space-y-10 text-sidebar-foreground/70 font-light leading-relaxed">
                <p>
                  Ми розділяємо поняття «поточного ліміту» та «накопиченого вкладу». Ваш доступний обсяг бонусних credits є активним: він може зменшуватися, коли ви використовуєте його для цифрових активацій чи сервісів платформи.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-white/10">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 mb-3">Current Credits</p>
                    <p className="text-sm">Поточний доступний обсяг бонусних credits для внутрішніх активацій.</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 mb-3">Referral Credits Earned</p>
                    <p className="text-sm">Сумарний обсяг отриманих реферальних бонусів, що зберігається в історії вкладу незалежно від витрат.</p>
                  </div>
                </div>
                
                <p>
                  Для нас важливо масштабувати ваш вплив. У майбутніх оновленнях показник <span className="text-accent font-normal italic">referral influence</span> буде відображати не поточний доступний ліміт credits, а повний історичний обсяг вашого вкладу в ріст спільноти.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Block 4 — Що буде далі */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold mb-16 text-center uppercase tracking-wider text-muted-foreground/80">Майбутній функціонал</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Layout, title: "Промокод в реєстрації", desc: "Зручне поле для автоматичної активації коду новим юзером." },
                { icon: Zap, title: "Copy Promo Code", desc: "Швидка кнопка копіювання коду в один клік у профілі." },
                { icon: Bell, title: "Сповіщення", desc: "Real-time пуші про кожну успішну реєстрацію та активацію." },
                { icon: BarChart3, title: "Dashboard вкладу", desc: "Окремий інтерфейс для відстеження накопичених реферальних credits." }
              ].map((item, i) => (
                <div key={i} className="p-6 border border-border/40 rounded-2xl hover:bg-slate-50 transition-colors">
                  <item.icon className="h-5 w-5 text-accent/60 mb-4" />
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-3">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Block 6 — FAQ */}
        <section className="py-20 px-4 bg-slate-50/50 border-t border-border/40">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-3 justify-center mb-12">
              <HelpCircle className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-bold uppercase tracking-wider">FAQ</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: "Чи згорають bonus credits після завершення програми?", a: "Ні. Всі отримані credits залишаються у вашому доступі та можуть бути використані пізніше." },
                { q: "Чи ця програма постійна?", a: "Ні, це launch sprint. Це стартова ініціатива для перших амбасадорів, вона має обмежений термін дії." },
                { q: "Чи можна буде використати bonus credits на платформі?", a: "Так, для внутрішніх цифрових активацій, преміум-можливостей та взаєморозрахунків усередині LECTOR." },
                { q: "Чи дорівнює referral influence поточному залишку бонусів?", a: "Ні. У майбутньому він відображатиме накопичений вами реферальний внесок, незалежно від того, чи витрачали ви отримані бонуси чи ні." }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white border border-border/40 rounded-2xl">
                  <p className="text-xs font-bold uppercase tracking-widest mb-3">{item.q}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-20 text-center">
              <div className="inline-block p-[1px] bg-gradient-to-r from-border/10 via-accent/30 to-border/10 w-full mb-12" />
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 mb-4">Lector Ecosystem</p>
              <h3 className="text-lg font-thin italic">Будуємо майбутнє обміну знаннями разом.</h3>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
