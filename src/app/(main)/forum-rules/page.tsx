'use client';

import React from 'react';
import { Navigation } from '@/components/navigation';
import { PageCloseButton } from '@/components/page-close-button';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MessageSquare, 
  AlertTriangle, 
  Sparkles, 
  Users, 
  Scale, 
  ArrowLeft,
  GanttChartSquare,
  Landmark,
  CheckCircle2,
  Info,
  ShieldAlert,
  Gavel,
  BadgeCheck
} from 'lucide-react';

export default function ForumRulesPage() {
  const sections = [
    {
      id: 1,
      icon: Users,
      title: '1. Повага і ввічливість',
      text: 'Кожен учасник форуму має право поставити питання, висловити думку або дати відповідь без приниження, тиску чи знецінення. Ми підтримуємо спокійну, аргументовану та людяну комунікацію.',
      bullets: [
        'Критикуйте ідею, а не людину.',
        'Не використовуйте образи, приниження, насмішки або провокації.',
        'Не переходьте на особистості, походження, стать, вік, зовнішність, переконання чи досвід іншого учасника.',
        'Якщо не згодні — пояснюйте позицію змістовно, без агресії.'
      ]
    },
    {
      id: 2,
      icon: AlertTriangle,
      title: '2. Що неприпустимо',
      variant: 'danger',
      text: 'На форумі заборонений контент, який руйнує довіру, безпеку або якість спільноти. Такі матеріали можуть бути приховані, відхилені або передані на адміністративний розгляд.',
      bullets: [
        'Образи, цькування, переслідування, мова ненависті або дискримінаційні висловлювання.',
        'Погрози, залякування, тиск на учасників або спроби маніпуляції.',
        'Спам, повторювані порожні повідомлення, агресивна самореклама або рекламні вставки без контексту.',
        'Публікація особистих даних інших людей без згоди.',
        'Контент, який закликає до небезпечних дій, шкоди собі або іншим.',
        'Навмисне поширення неправдивої інформації, фейкових відгуків або провокаційних вкидів.'
      ]
    },
    {
      id: 3,
      icon: Sparkles,
      title: '3. Якість питань і відповідей',
      text: 'LECTOR цінує питання, які відкривають змістовну розмову. Гарне питання не обов’язково має бути складним, але воно має бути зрозумілим, чесним і корисним для теми.',
      bullets: [
        'Формулюйте питання так, щоб інші учасники могли зрозуміти контекст.',
        'Уникайте надто загальних або порожніх формулювань без змісту.',
        'Не дублюйте одне й те саме питання багато разів.',
        'Відповідаючи, додавайте пояснення, приклади або власну аргументовану позицію.',
        'Не видавайте категоричні твердження за абсолютну істину там, де йдеться про інтерпретацію, практику або особистий досвід.'
      ]
    },
    {
      id: 4,
      icon: Landmark,
      title: '4. Модерація та роль архітекторів',
      text: 'Форум LECTOR модерують адміністратори та архітектори підкатегорій. Архітектор — це не просто бейдж, а куратор своєї теми: людина, яка допомагає підтримувати якість обговорень і бачити, які питання справді варті уваги.',
      bullets: [
        'Адміністратори можуть переглядати й модерувати питання в усіх підкатегоріях.',
        'Архітектори можуть працювати з питаннями у своїх підкатегоріях.',
        'Питання можуть проходити попередню модерацію перед публікацією.',
        'Архітектор або адміністратор може погодити, відхилити, приховати або позначити питання для подальшого розгляду.',
        'Якісні дискусії можуть стати основою для добірок, редакційних матеріалів або майбутніх статей LECTOR.'
      ]
    },
    {
      id: 5,
      icon: ShieldAlert,
      title: '5. Попередження, сірий бан і тимчасові обмеження',
      text: 'Якщо учасник порушує правила, платформа може застосувати м’які або тимчасові обмеження. Мета таких дій — не покарання заради покарання, а захист якості простору.',
      bullets: [
        'Попередження — коли порушення не є критичним, але потребує уваги.',
        'Приховування контенту — якщо питання або відповідь порушує правила чи не відповідає якості форуму.',
        'Сірий бан — тимчасове зниження видимості активності користувача до перевірки поведінки.',
        'Тимчасові обмеження — обмеження можливості публікувати питання або відповіді на певний період.',
        'Адміністративний розгляд — для повторних, грубих або спірних випадків.'
      ]
    },
    {
      id: 6,
      icon: GanttChartSquare,
      title: '6. Толерантність і безпечний простір',
      text: 'Форум LECTOR об’єднує людей з різним досвідом, мовами, країнами, підходами та рівнем знань. Різниця поглядів допустима. Приниження, ворожість і навмисне створення небезпечної атмосфери — ні.',
      bullets: [
        'Поважайте різні стилі мислення, практики та професійні підходи.',
        'Не знецінюйте новачків за прості питання.',
        'Не використовуйте тему форуму для тиску, сорому або публічного висміювання.',
        'Якщо дискусія загострюється, зупиніться, переформулюйте думку або зверніться до модерації.'
      ]
    },
    {
      id: 7,
      icon: Gavel,
      title: '7. Диспути та спірні ситуації',
      text: 'У спірних ситуаціях адміністратори та уповноважені архітектори можуть допомагати оцінити контекст, визначити сторону диспуту та зафіксувати результат рішення. Такий розгляд має спиратися на правила платформи, факти, тон комунікації та вплив ситуації на спільноту.',
      bullets: [
        'Архітектор може брати участь у диспутах у межах своєї підкатегорії.',
        'Адміністратор має право остаточного перегляду рішення.',
        'Рішення має бути зафіксоване так, щоб його можна було перевірити або переглянути.',
        'Диспут не має перетворюватися на публічне приниження будь-якої сторони.'
      ]
    },
    {
      id: 8,
      icon: Info,
      title: '8. Навіщо ці правила',
      text: 'Ми створюємо форум не для хаосу, а для якісної спільноти. Тут питання можуть отримувати відповіді, відповіді — підтримку, а сильні дискусії — продовження у матеріалах, статусах і розвитку підкатегорій.',
      bullets: []
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation subtitle="Community Standards" />
      <PageCloseButton fallbackHref="/blog" />

      <main className="flex-grow">
        {/* HERO */}
        <section className="py-20 md:py-32 px-4 border-b border-border/30 bg-slate-50/30">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 text-accent text-[11px] uppercase tracking-[0.2em] font-black mb-8">
              <BadgeCheck className="h-3.5 w-3.5" />
              Стандарти спільноти
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 text-foreground uppercase leading-none">
              Правила форуму LECTOR
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Форум LECTOR створений для змістовних питань, уважних відповідей і розвитку професійної спільноти. Тут важлива не гучність висловлювання, а його якість, повага до співрозмовника та користь для теми.
            </p>
          </div>
        </section>

        {/* INTRO CALLOUT */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="p-8 md:p-12 rounded-[48px] bg-slate-50 border border-border/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare className="h-40 w-40" />
              </div>
              <p className="text-xl md:text-2xl font-bold text-foreground leading-relaxed italic relative z-10">
                &ldquo;Форум — це не чат для випадкового шуму. Це простір, де питання можуть стати початком дискусії, якісної відповіді, майбутньої статті або нової теми для розвитку підкатегорії.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* RULES GRID */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sections.map((section) => (
                <div 
                  key={section.id} 
                  className={`p-10 rounded-[48px] border transition-all duration-500 group flex flex-col h-full ${
                    section.variant === 'danger' 
                      ? 'bg-red-50/30 border-red-100 hover:border-red-200' 
                      : 'bg-white border-border/40 hover:border-accent/20 hover:shadow-xl'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 ${
                    section.variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-foreground group-hover:text-accent'
                  }`}>
                    <section.icon className="h-8 w-8" />
                  </div>
                  
                  <h3 className={`text-2xl font-black uppercase tracking-tight mb-6 ${
                    section.variant === 'danger' ? 'text-red-900' : 'text-foreground'
                  }`}>
                    {section.title}
                  </h3>
                  
                  <p className="text-base text-muted-foreground leading-relaxed font-medium mb-8">
                    {section.text}
                  </p>
                  
                  {section.bullets.length > 0 && (
                    <ul className="space-y-4 mt-auto">
                      {section.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-bold text-foreground/70">
                          <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${
                            section.variant === 'danger' ? 'text-red-400' : 'text-accent'
                          }`} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* FINAL CALLOUT */}
            <div className="mt-20 p-10 md:p-16 rounded-[60px] bg-accent text-white text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <ShieldCheck className="h-64 w-64" />
              </div>
              <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                <p className="text-2xl md:text-4xl font-black tracking-tighter leading-tight">
                  LECTOR підтримує свободу думки, але не підтримує хаос, токсичність і знецінення.
                </p>
                <p className="text-lg md:text-xl font-medium opacity-80">
                  Якість спільноти починається з того, як ми ставимо питання і як відповідаємо одне одному.
                </p>
              </div>
            </div>

            {/* BACK BUTTON */}
            <div className="mt-24 flex justify-center">
              <Link href="/blog">
                <Button 
                  variant="outline"
                  className="rounded-full px-12 py-8 border-2 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all group shadow-lg"
                >
                  <ArrowLeft className="h-5 w-5 mr-4 group-hover:-translate-x-1 transition-transform" />
                  Повернутися до форуму
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
