'use client';

import React from 'react';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { ShieldCheck, CheckCircle2, ArrowUpCircle, Info } from 'lucide-react';
import { TRUST_COLORS } from '@/lib/trust/get-user-trust-state';

/**
 * TrustVerificationPage - Informational hub for LECTOR's Trust & Verification system.
 * Explains how Trust Levels work, the difference between various indicators, and why it matters.
 */
export default function TrustVerificationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative w-full overflow-x-hidden">
      <Navigation />
      
      <main className="flex-grow pt-8 md:pt-12 pb-20">
        {/* Header Hero */}
        <section className="py-16 md:py-24 border-b border-muted/10 bg-gradient-to-b from-muted/[0.05] to-transparent">
          <div className="container max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-[24px] bg-accent/5 mb-8 shadow-sm border border-accent/10">
              <ShieldCheck className="h-12 w-12 text-accent" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground mb-6 leading-[0.9]">
              Довіра і верифікація
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              LECTOR створює простір, де взаємодія базується на прозорості та якості. 
              Система рівнів довіри допомагає кожному знайти надійного партнера для спілкування та обміну знаннями.
            </p>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground leading-[1.1]">
                  Чому ми <span className="text-accent underline underline-offset-8 decoration-accent/20">це впроваджуємо</span>?
                </h2>
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed text-base font-medium">
                    Ми віримо, що преміальний сервіс неможливий без довіри. 
                    Trust Strip (верхня смужка профілю) — це не просто декоративний елемент, 
                    а динамічний індикатор вашого статусу та репутації на платформі.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-base font-medium">
                    Кожен рівень відкриває нові можливості: від базового спілкування до активації 
                    професійних пропозицій, монетизації та виплати отриманих коштів.
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/[0.03] rounded-[40px] p-8 md:p-12 border border-muted/20 shadow-sm backdrop-blur-sm">
                <div className="space-y-8">
                  <div className="flex gap-5 group">
                    <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 border border-accent/10 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-xs tracking-[0.1em] mb-1.5 text-foreground">Верхня смужка (Trust Strip)</h4>
                      <p className="text-sm text-muted-foreground leading-snug">Ваш інтегральний рівень перевіреності та довіри платформи.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-5 group">
                    <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/10 group-hover:scale-105 transition-transform">
                      <div className="h-2 w-6 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-xs tracking-[0.1em] mb-1.5 text-foreground">Нижня смужка (Online Indicator)</h4>
                      <p className="text-sm text-muted-foreground leading-snug">Ваш поточний статус у мережі: онлайн, готовий до виклику або консультації.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-5 group">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/10 group-hover:scale-105 transition-transform">
                      <ArrowUpCircle className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-xs tracking-[0.1em] mb-1.5 text-foreground">Наповненість профілю (Completion)</h4>
                      <p className="text-sm text-muted-foreground leading-snug">Показник того, наскільки детально ви розповіли про себе спільноті.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Levels Section */}
        <section className="py-20 md:py-32 bg-muted/[0.02] border-y border-muted/10">
          <div className="container max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-center mb-20 leading-none">
              4 Рівні Довіри
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  level: 1, 
                  title: 'Підтверджений акаунт', 
                  desc: 'Мінімальний поріг для входу в спільноту та безпечної взаємодії.', 
                  req: ['Email підтверджено', 'Телефон підтверджено', 'Базові дані профілю'],
                  color: TRUST_COLORS[1]
                },
                { 
                  level: 2, 
                  title: 'Підтверджена особа', 
                  desc: 'Свідчить про проходження офіційної верифікації та готовність до виплат.', 
                  req: ['Верифікація особистості', 'Налаштування реквізитів', 'Payer readiness'],
                  color: TRUST_COLORS[2]
                },
                { 
                  level: 3, 
                  title: 'Активний професіонал', 
                  desc: 'Для спеціалістів, які активно створюють цінність на платформі.', 
                  req: ['Активні пропозиції', 'Перші закриті запити', 'Відсутність претензій'],
                  color: TRUST_COLORS[3]
                },
                { 
                  level: 4, 
                  title: 'Верифіковано платформою', 
                  desc: 'Вищий статус довіри, амбасадорський рівень із особливим статусом.', 
                  req: ['Високий Trust Score', 'Чиста тривала історія', 'Експертний перегляд'],
                  color: TRUST_COLORS[4]
                }
              ].map((item) => (
                <div key={item.level} className="bg-background rounded-[32px] p-8 border border-muted/40 shadow-sm flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-muted/5 font-black text-2xl border border-muted/10" style={{ color: item.color }}>
                      {item.level}
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((seg) => (
                        <div key={seg} className="h-1.5 w-6 rounded-full overflow-hidden bg-muted/10">
                          {seg <= item.level && (
                            <div className="h-full w-full opacity-60" style={{ backgroundColor: item.color }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-4 leading-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium mb-10 flex-grow leading-relaxed">{item.desc}</p>
                  
                  <div className="space-y-3 pt-6 border-t border-muted/20">
                    <h4 className="text-[10px] font-black uppercase text-muted-foreground/30 tracking-[0.2em] mb-3">Вимоги:</h4>
                    {item.req.map((r, i) => (
                      <div key={i} className="flex gap-3 text-[11px] font-bold text-foreground/70 items-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 opacity-60" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Style Section */}
        <section className="py-20 md:py-32">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-center mb-16 leading-none">
              Питання та відповіді
            </h2>
            <div className="space-y-8">
              {[
                {
                  q: 'Як росте мій Trust Level?',
                  a: 'Рівень зростає автоматично при виконанні певних кроків: підтвердження контактів, проходження верифікації особи та ведення успішної професійної діяльності.'
                },
                {
                  q: 'Чи можна втратити статус?',
                  a: 'Довіра — це те, що потрібно підтримувати. Порушення правил спільноти, обґрунтовані скарги або нечесна діяльність призводять до зниження рівня аж до блокування акаунта.'
                },
                {
                  q: 'Чи обов’язково бути верифікованою особою?',
                  a: 'Це не обов’язково для простого спілкування, але необхідно для тих, за ким стоїть фінансова активність (консультації, продаж артефактів), щоб гарантувати безпеку транзакцій.'
                },
                {
                  q: 'Як перевірити свій поточний рівень?',
                  a: 'Ви бачите свою Trust Strip безпосередньо у власному профілі. Натисніть на неї, щоб побачити детальне пояснення та кроки для переходу на наступний етап.'
                }
              ].map((faq, i) => (
                <div key={i} className="bg-muted/[0.03] rounded-[32px] p-8 border border-muted/20 group hover:bg-muted/[0.05] transition-colors">
                  <h4 className="text-xl font-black text-foreground mb-4 flex gap-3">
                    <span className="text-accent opacity-30">#</span>
                    {faq.q}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed font-medium pl-7 text-sm ml-0.5 border-l border-accent/10 italic">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
