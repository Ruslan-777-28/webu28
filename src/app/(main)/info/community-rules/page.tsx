import React from 'react';
import { Metadata } from 'next';
import { PageCloseButton } from '@/components/page-close-button';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Правила спільноти | LECTOR',
  description: 'Кодекс поваги, тактовності та доброзичливості в екосистемі LECTOR.',
};

export default function CommunityRulesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 lg:py-32 max-w-5xl relative">
        <PageCloseButton fallbackHref="/" />
        
        {/* HERO SECTION */}
        <div className="mb-16 md:mb-24">
          <div className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-accent mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Кодекс спільноти
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground mb-8 leading-[0.9] uppercase animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            Правила <br className="hidden md:block" /> спільноти
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/80 font-light tracking-tight max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Кодекс поваги, тактовності та доброзичливості
          </p>
        </div>

        {/* INTRO */}
        <div className="prose prose-stone dark:prose-invert max-w-none mb-20">
          <div className="space-y-6 text-lg md:text-xl text-muted-foreground/90 font-light leading-relaxed">
            <p>
              LECTOR — це простір, у якому зустрічаються люди з різним досвідом, поглядами, стилем спілкування та рівнем підготовки. Тут є місце і для професіоналів, і для користувачів, які шукають відповідь, підтримку, ясність або новий досвід.
            </p>
            <p>
              Ми віримо, що сильна спільнота будується не лише на можливостях платформи, а й на внутрішній культурі взаємодії: повазі, тактовності, чистоплотності в комунікації, ясності намірів і доброзичливості.
            </p>
            <p className="text-foreground font-medium border-l-2 border-accent/30 pl-6 py-2">
              Ці правила — не формальність. Це основа атмосфери, в якій людям безпечно бути присутніми, відкриватися, працювати, публікуватися і взаємодіяти.
            </p>
          </div>
        </div>

        {/* RULES GRID/LIST */}
        <div className="space-y-16 md:space-y-24 mb-32">
          
          <section className="group">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="text-4xl md:text-5xl font-black text-foreground/10 group-hover:text-accent/20 transition-colors duration-500 shrink-0">
                01
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase">
                  Поважайте людей по той бік екрана
                </h2>
                <div className="h-[1px] w-12 bg-accent/30 mb-6"></div>
                <p className="text-lg text-muted-foreground/90 font-light leading-relaxed mb-6">
                  За кожним профілем стоїть жива людина. Ми очікуємо від усіх учасників спільноти:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {['ввічливого тону', 'поважного ставлення до меж', 'відсутності агресії', 'уважності до сприйняття'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/70 uppercase tracking-wider font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent/40"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="pt-4 text-base italic text-muted-foreground/60 border-t border-border/40 mt-6">
                  Можна не погоджуватися. Не можна знецінювати.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="text-4xl md:text-5xl font-black text-foreground/10 group-hover:text-accent/20 transition-colors duration-500 shrink-0">
                02
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase">
                  Будьте тактовними у спілкуванні
                </h2>
                <div className="h-[1px] w-12 bg-accent/30 mb-6"></div>
                <p className="text-lg text-muted-foreground/90 font-light leading-relaxed">
                  Тактовність — це не слабкість, а ознака зрілості. Перед тим як написати повідомлення чи публікацію, запитайте себе, чи не провокує це непотрібний конфлікт та чи достатньо ясно ви висловлюєтесь.
                </p>
                <p className="text-sm font-medium uppercase tracking-widest text-foreground/80 bg-muted/30 p-4 rounded-sm border border-border/50">
                  Ми підтримуємо спокійне, ясне і гідне спілкування навіть у складних темах.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="text-4xl md:text-5xl font-black text-foreground/10 group-hover:text-accent/20 transition-colors duration-500 shrink-0">
                03
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase">
                  Уникайте непорозумінь через ясність
                </h2>
                <div className="h-[1px] w-12 bg-accent/30 mb-6"></div>
                <p className="text-lg text-muted-foreground/90 font-light leading-relaxed">
                  Багато конфліктів виникає не через злий намір, а через нечіткість. Ми просимо формулювати думки зрозуміло, не обіцяти зайвого та уточнювати деталі взаємодії заздалегідь.
                </p>
                <p className="text-foreground font-black uppercase tracking-tighter text-2xl md:text-3xl opacity-20">
                  Ясність — це форма поваги.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="text-4xl md:text-5xl font-black text-foreground/10 group-hover:text-accent/20 transition-colors duration-500 shrink-0">
                04
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase">
                  Чистоплотність у поведінці та подачі
                </h2>
                <div className="h-[1px] w-12 bg-accent/30 mb-6"></div>
                <p className="text-lg text-muted-foreground/90 font-light leading-relaxed mb-6">
                  Ми цінуємо охайність у намірах та комунікації. Для всіх учасників це означає:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { t: 'Без маніпуляцій', d: 'Не грати на страхах чи вразливості.' },
                    { t: 'Без омани', d: 'Слова і дії не мають суперечити одне одному.' },
                    { t: 'Чесна подача', d: 'Уникати недобросовісного змісту.' },
                    { t: 'Відсутність тиску', d: 'Не створювати штучного напруження.' }
                  ].map((item, i) => (
                    <div key={i} className="p-4 border border-border/40 bg-muted/10 rounded-sm">
                      <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent mb-1">{item.t}</div>
                      <div className="text-xs text-muted-foreground">{item.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="text-4xl md:text-5xl font-black text-foreground/10 group-hover:text-accent/20 transition-colors duration-500 shrink-0">
                05
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase">
                  Доброзичливість — базовий стандарт
                </h2>
                <div className="h-[1px] w-12 bg-accent/30 mb-6"></div>
                <p className="text-lg text-muted-foreground/90 font-light leading-relaxed">
                  Ми не вимагаємо однаковості, ми очікуємо доброзичливості. Це означає говорити з людьми як із людьми, а не як із функціями, та не шукати зайвого приводу для ворожості.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="h-10 w-10 rounded-full border border-accent/20 flex items-center justify-center text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                  </div>
                  <p className="text-sm font-medium text-foreground/60 uppercase tracking-widest">
                    Атмосфера — це щоденний вибір кожного.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* TWO COLUMN SECTION FOR ROLES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <div className="space-y-6">
              <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent">Професіоналам</div>
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground">
                Відповідальність за довіру
              </h3>
              <div className="h-[1px] w-full bg-border/40"></div>
              <div className="space-y-4 text-sm md:text-base text-muted-foreground/80 leading-relaxed font-light">
                <p>Ми очікуємо від професіоналів коректного самопозиціонування, поваги до часу клієнта та гідної реакції на запитання. Справжня експертність завжди посилюється людяністю.</p>
                <ul className="space-y-2">
                  <li className="flex gap-2 items-start"><span className="text-accent mt-1">•</span> Відсутність тиску та залякування</li>
                  <li className="flex gap-2 items-start"><span className="text-accent mt-1">•</span> Чесність щодо підходів і меж</li>
                  <li className="flex gap-2 items-start"><span className="text-accent mt-1">•</span> Акуратність в описах і публікаціях</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent">Користувачам</div>
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground">
                Повага до праці та меж
              </h3>
              <div className="h-[1px] w-full bg-border/40"></div>
              <div className="space-y-4 text-sm md:text-base text-muted-foreground/80 leading-relaxed font-light">
                <p>Звертайтеся до професіоналів коректно, не вимагайте більше погодженого та не використовуйте платформу для тролінгу. Повага в екосистемі LECTOR працює в обидва боки.</p>
                <ul className="space-y-2">
                  <li className="flex gap-2 items-start"><span className="text-accent mt-1">•</span> Коректне спілкування без образ</li>
                  <li className="flex gap-2 items-start"><span className="text-accent mt-1">•</span> Спокійний діалог замість конфлікту</li>
                  <li className="flex gap-2 items-start"><span className="text-accent mt-1">•</span> Відсутність навмисного дискомфорту</li>
                </ul>
              </div>
            </div>
          </div>

          <section className="group border-t border-border/30 pt-16 md:pt-24">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="text-4xl md:text-5xl font-black text-foreground/10 group-hover:text-accent/20 transition-colors duration-500 shrink-0">
                08
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase">
                  Контент має бути гідним простору
                </h2>
                <div className="h-[1px] w-12 bg-accent/30 mb-6"></div>
                <p className="text-lg text-muted-foreground/90 font-light leading-relaxed">
                  Публікації, описи та матеріали мають відповідати духу платформи. Ми підтримуємо контент, який має цінність, створений з наміром дати, а не використати, і не засмічує простір.
                </p>
                <div className="flex flex-wrap gap-2 pt-4">
                  {['Цінність', 'Гідність', 'Якість', 'Авторство', 'Чесність'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-muted/20 border border-border/40 text-[10px] font-bold uppercase tracking-widest text-foreground/60 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="text-4xl md:text-5xl font-black text-foreground/10 group-hover:text-accent/20 transition-colors duration-500 shrink-0">
                09
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase">
                  Не використовуйте вразливість
                </h2>
                <div className="h-[1px] w-12 bg-accent/30 mb-6"></div>
                <p className="text-lg text-muted-foreground/90 font-light leading-relaxed">
                  Заборонено тиснути на страх, нав’язувати залежну взаємодію чи експлуатувати тривогу людини. Якщо ваша комунікація побудована на тиску чи приниженні — це суперечить духу спільноти.
                </p>
                <div className="p-6 bg-destructive/5 border border-destructive/10 rounded-sm">
                  <p className="text-xs uppercase font-bold tracking-widest text-destructive/70 mb-2">Сувора заборона</p>
                  <p className="text-sm text-destructive/80 font-medium">Будь-яка форма маніпуляції емоційним станом для примусу до взаємодії призведе до обмеження доступу.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="text-4xl md:text-5xl font-black text-foreground/10 group-hover:text-accent/20 transition-colors duration-500 shrink-0">
                10
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase">
                  Репутація — це щоденні дії
                </h2>
                <div className="h-[1px] w-12 bg-accent/30 mb-6"></div>
                <p className="text-lg text-muted-foreground/90 font-light leading-relaxed">
                  На LECTOR важливо не лише те, як ви виглядаєте, а й те, як ви поводитеся. Ми за спільноту, де статус виростає не з шуму, а з гідності.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="text-4xl md:text-5xl font-black text-foreground/10 group-hover:text-accent/20 transition-colors duration-500 shrink-0">
                11
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase">
                  Обирайте діалог, а не ескалацію
                </h2>
                <div className="h-[1px] w-12 bg-accent/30 mb-6"></div>
                <p className="text-lg text-muted-foreground/90 font-light leading-relaxed">
                  Не кожне непорозуміння є порушенням. У спірних ситуаціях спочатку уточніть намір та не робіть поспішних висновків. Зріла спільнота відрізняється способом проживати напругу.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="text-4xl md:text-5xl font-black text-foreground/10 group-hover:text-accent/20 transition-colors duration-500 shrink-0">
                12
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase">
                  Захист атмосфери спільноти
                </h2>
                <div className="h-[1px] w-12 bg-accent/30 mb-6"></div>
                <p className="text-lg text-muted-foreground/90 font-light leading-relaxed">
                  Ми залишаємо за собою право обмежувати присутність учасників, які системно руйнують атмосферу поваги або діють недобросовісно. Ми захищаємо не шум, а якість простору.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* SUMMARY / FOOTER OF PAGE */}
        <div className="bg-muted/30 border border-border/50 p-8 md:p-16 rounded-sm text-center space-y-8 mb-24">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground">
            Підсумок
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground/90 font-light max-w-2xl mx-auto leading-relaxed">
            Ми хочемо, щоб LECTOR був місцем, де безпечно проявлятися, гідно працювати та приємно бути. Наша спільнота тримається на простих речах: тактовності, чистоплотності, ясності та доброзичливості.
          </p>
          <div className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-foreground/20">
            LECTOR COMMUNITY
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
