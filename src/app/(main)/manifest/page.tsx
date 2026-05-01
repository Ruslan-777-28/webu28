import React from 'react';
import { Metadata } from 'next';
import { PageCloseButton } from '@/components/page-close-button';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Маніфест | LECTOR',
  description: 'Декларація цінностей та наша візія розвитку екосистеми.',
};

export default function ManifestPage() {
  return (
    <div className="min-h-screen bg-background text-balance flex flex-col">
      <Navigation />
      <main className="container mx-auto px-4 py-16 md:py-24 lg:py-32 max-w-5xl relative flex-grow">
        <PageCloseButton fallbackHref="/" />
        
        {/* HERO SECTION */}
        <div className="mb-12 md:mb-20">
          <div className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-accent mb-6">
            Декларація цінностей
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground mb-8 leading-[0.9]">
            Маніфест LECTOR
          </h1>
        </div>

        {/* CONTENT */}
        <div className="space-y-12 md:space-y-16 text-base md:text-lg lg:text-xl text-muted-foreground/90 font-light leading-relaxed">
          
          <div className="space-y-6">
            <p>
              Ми створили LECTOR не як черговий комерційний проєкт і не як платформу, що прагне швидкої уваги, короткого ефекту чи формального успіху.
            </p>
            <p className="text-foreground font-medium text-xl md:text-2xl">
              Ми прийшли сюди всерйоз і надовго.
            </p>
            <p>
              Для нас це не зовнішня тема і не випадково обрана ніша.
            </p>
            <p>
              Творці, співзасновники та люди, які стоять за цією екосистемою, мають живу дотичність до езотеричного світу — до практик, знань, пошуку, досвіду, інтуїції, внутрішньої роботи і тих напрямів, які для багатьох є не просто сферою інтересу, а частиною шляху.
            </p>
            <p>
              Саме тому LECTOR з’явився не як абстрактна ідея, а як усвідомлений намір створити середовище нового рівня.
            </p>
            <p>
              Середовище, у якому ця галузь зможе отримати більше видимості, поваги, структури, сучасних інструментів і нових можливостей для розвитку.
            </p>
            <p>
              Ми не ставимо перед собою мету стати номером один у світі просто заради гучного титулу чи красивої галочки.
            </p>
            <p>
              Для нас важливо більше інше: дати цій сфері новий етап розвитку та еволюції — через технології, інновації, сильну команду, системний підхід і глибоке розуміння самої суті того, що ми будуємо.
            </p>
            <div className="space-y-4 pt-4">
              <p>
                Ми хочемо, щоб LECTOR став простором, де практика, досвід, експертність і справжня цінність отримують гідну форму в цифровому середовищі.
              </p>
              <p className="pl-6 border-l-[3px] border-accent/20 space-y-3 py-2 text-foreground/80 font-medium italic">
                <span className="block">Простором, де можна бути побаченим.</span>
                <span className="block">Де можна рости.</span>
                <span className="block">Де можна знайти своїх.</span>
                <span className="block">Де окремі підкатегорії, знання і люди перестають існувати розрізнено та починають формувати сильну екосистему.</span>
              </p>
            </div>
          </div>

          <div className="w-24 h-[1px] bg-border/50 my-16"></div>

          {/* PARADIGM */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-foreground uppercase">
              Наша фундаментальна парадигма
            </h2>
            <div className="space-y-6">
              <p>
                LECTOR будується не навколо випадкової реєстрації, не навколо штучної популярності і не навколо швидкого зовнішнього ефекту.
              </p>
              <p>
                LECTOR будується навколо довіри, реальної присутності, послідовного шляху користувача і справжньої цінності, яку він приносить екосистемі.
              </p>
              <p>
                Для нас важливо не просто зібрати велику кількість акаунтів.
              </p>
              <p>
                Для нас важливо створити середовище, у якому сильні, заповнені, активні, підтверджені й корисні профілі мають природну вагу.
              </p>
              <p>
                Ми не прагнемо будувати систему, де всі отримують однаковий вплив лише через факт реєстрації.
              </p>
              <p>
                У LECTOR можливості мають відкриватися поступово — через шлях, дії, наповнення профілю, підтвердження, активність, довіру, якість взаємодії та реальну участь у житті платформи.
              </p>
              <p className="text-foreground font-semibold text-xl border-l-4 border-accent pl-6 py-2">
                Це одна з ключових ідей нашої екосистеми: не формальний статус визначає людину, а її реальний шлях у системі.
              </p>
            </div>
          </div>

          {/* TRUST */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-foreground uppercase">
              Довіра як основа розвитку
            </h2>
            <div className="space-y-6">
              <p>
                У LECTOR довіра не є декоративним знаком, випадковою позначкою чи формальним бейджем.
              </p>
              <p>
                Довіра — це основа того, як користувач поступово відкриває більше можливостей.
              </p>
              <p>
                Ми створюємо модель, у якій профіль розвивається разом із самим користувачем.
              </p>
              <p>
                Чим більше користувач наповнює свій профіль, підтверджує свою присутність, взаємодіє чесно, формує історію активності, отримує реальні відгуки, створює корисний контент і бере участь у житті платформи, тим сильнішою стає його роль в екосистемі.
              </p>
              <div className="pt-4">
                <p className="text-foreground font-bold mb-4 uppercase tracking-widest text-sm text-accent">Для нас це важливий принцип:</p>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tighter">
                  довіра відкриває можливості.
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-foreground/60 font-medium uppercase tracking-tighter text-sm">
                  <span>Не випадковість.</span>
                  <span>Не штучне просування.</span>
                  <span>Не куплений образ.</span>
                  <span>Не фейкове досягнення.</span>
                </div>
                <p className="mt-4 text-foreground font-medium">А послідовність, реальні дії, підтвердження і цінність.</p>
              </div>
            </div>
          </div>

          {/* DECENTRALIZATION */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-foreground uppercase">
              Децентралізація і справедливий шлях
            </h2>
            <div className="space-y-6">
              <p>
                Ми прагнемо будувати LECTOR як екосистему, у якій розвиток користувача не залежить від ручного суб’єктивного втручання, випадкової симпатії, зовнішнього тиску чи непрозорого рішення.
              </p>
              <p>
                Базова логіка росту має бути автоматизованою, зрозумілою і прив’язаною до реальних дій.
              </p>
              <p>
                Користувач не повинен отримувати перевагу лише тому, що хтось вручну надав йому штучний статус.
              </p>
              <p>
                Так само в нашій філософії не має працювати модель, де можна купити фейкову вагу, псевдодосягнення або порожню видимість без реального шляху.
              </p>
              <p>
                У LECTOR важливим має бути не те, наскільки голосно користувач заявляє про себе, а те, наскільки послідовно він формує свою присутність.
              </p>
              <p className="pl-6 border-l-[3px] border-accent/20 space-y-2 py-1 italic">
                <span className="block">Ми хочемо, щоб система бачила не обіцянки, а дії.</span>
                <span className="block">Не випадкову активність, а якісну участь.</span>
                <span className="block">Не порожній акаунт, а живий профіль.</span>
                <span className="block">Не штучний статус, а реальну довіру.</span>
              </p>
              <p>
                Саме тому для нас децентралізація — це не просто технологічне слово.
              </p>
              <p>
                Це принцип, за яким екосистема має поступово зменшувати залежність від людського фактору там, де розвиток може бути визначений прозорими правилами, алгоритмами, діями користувача і перевіреними сигналами.
              </p>
            </div>
          </div>

          {/* OPPORTUNITIES */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-foreground uppercase">
              Можливості як наслідок шляху
            </h2>
            <div className="space-y-6">
              <p>
                У LECTOR функціональність не повинна бути випадковою або однаковою для всіх.
              </p>
              <p className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base md:text-lg">
                <span className="p-4 bg-muted/5 border border-border/50 rounded-xl"><strong className="text-foreground block mb-1">Базовий акаунт</strong> може почати шлях.</span>
                <span className="p-4 bg-muted/5 border border-border/50 rounded-xl"><strong className="text-foreground block mb-1">Заповнений профіль</strong> може отримати більше простору.</span>
                <span className="p-4 bg-muted/5 border border-border/50 rounded-xl"><strong className="text-foreground block mb-1">Підтверджений профіль</strong> може мати вищу довіру.</span>
                <span className="p-4 bg-muted/5 border border-border/50 rounded-xl"><strong className="text-foreground block mb-1">Активний користувач</strong> може отримати ширшу видимість.</span>
              </p>
              <p>
                Професійна присутність може відкривати глибші інструменти, статуси, комунікації, монетизацію і більшу роль у спільноті.
              </p>
              <p>
                Це не покарання для нових користувачів. Це логіка розвитку.
              </p>
              <p>
                Порожній або випадковий акаунт може існувати, але він не повинен мати таку саму вагу, як профіль, за яким стоїть реальна людина, історія активності, наповнення, відповідальність і довіра.
              </p>
              <p>
                Ми не боремося з порожніми акаунтами тільки через заборони. Ми створюємо ієрархію доступу, де порожній або фейковий профіль природно залишається на нижньому рівні, а справжня цінність відкриває шлях вище.
              </p>
            </div>
          </div>

          {/* QUALITY */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-foreground uppercase">
              Якість, комфорт і безпека важливіші за швидкість
            </h2>
            <div className="space-y-6">
              <p>
                Ми чесно розуміємо: швидкість не завжди означає якість.
              </p>
              <p>
                У таких екосистемах, як LECTOR, надто швидке відкриття всіх можливостей для всіх може створювати хаос, знижувати довіру, перевантажувати простір і послаблювати безпеку взаємодії.
              </p>
              <p>
                Тому для нас важливо рухатися осмислено.
              </p>
              <p className="text-foreground font-medium pl-6 border-l-[3px] border-accent/20 py-2 space-y-2">
                <span className="block">Краще поступовий розвиток, ніж швидкий, але нестійкий ріст.</span>
                <span className="block">Краще зрозуміла логіка доступів, ніж випадкова вседозволеність.</span>
                <span className="block">Краще якісна спільнота, ніж велика кількість порожніх реєстрацій.</span>
                <span className="block">Краще комфортна й безпечна екосистема, ніж поверхнева гонитва за цифрами.</span>
              </p>
              <p>
                LECTOR має рости не хаотично, а послідовно.
              </p>
              <p>
                Так, щоб кожен новий рівень функціональності мав сенс.
              </p>
              <p>
                Так, щоб користувач розумів, чому перед ним відкриваються нові можливості.
              </p>
              <p>
                Так, щоб довіра була не обіцянкою, а результатам реального шляху.
              </p>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-foreground uppercase">
              Про категорії та розвиток структури
            </h2>
            <div className="space-y-6">
              <p>
                На цьому етапі ми стартуємо з тими категоріями та підкатегоріями, які вже визначені в межах поточної архітектури платформи.
              </p>
              <p>
                Але ми одразу хочемо зафіксувати важливий принцип: LECTOR не мислиться як закрита конструкція.
              </p>
              <p>
                У подальшому, якщо цього потребуватиме спільнота, якщо це буде підтверджено реальним попитом і підтримається загальним рішенням архітекторів платформи, коло підкатегорій буде розширюватися.
              </p>
              <p>
                Ми відкриті до органічного росту цієї структури разом із самою екосистемою.
              </p>
              <p>
                Саме тому на поточному етапі передбачена також категорія «Інші».
              </p>
              <p>
                Вона є тимчасовим простором для тих спеціалістів, які поки що не знайшли власної чітко виділеної підкатегорії серед уже наявних напрямів.
              </p>
              <p>
                Ми розглядаємо цю категорію не як другорядну, а як живу точку спостереження та росту.
              </p>
              <p>
                Вона буде моніторитися з погляду того, які саме учасники в ній себе представляють, які напрями повторюються, які практики потребують окремої видимості.
              </p>
              <p>
                І надалі, якщо така потреба буде підтверджена, для цих учасників додаватимуться вже їхні окремі індивідуальні підкатегорії в професійному шарі платформи.
              </p>
            </div>
          </div>

          {/* REAL STAGE */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-foreground uppercase">
              Про реальний етап розвитку
            </h2>
            <div className="space-y-6">
              <p>
                Ми також чесно розуміємо: такі проєкти не народжуються за один день і не стають ідеально відполірованими з першого кроку.
              </p>
              <p>
                Кожен етап створення потребує часу, рішень, перевірок, витримки, технічної роботи і великої внутрішньої відданості.
              </p>
              <p>
                Тому we відкрито говоримо: не все відразу буде доведено до блиску в реалізації.
              </p>
              <p>
                Але для нас принципово важливо, щоб було видно головне:
              </p>
              <p className="text-foreground font-medium text-xl md:text-2xl italic leading-tight">
                за цим стоїть справжня праця, серйозний намір і надпотужна команда співзасновників та однодумців, які дивляться на цей шлях стратегічно, відповідально і в довгу.
              </p>
              <div className="py-6 md:py-10">
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-foreground mb-4 leading-[1.1]">
                  Ми будуємо не тимчасову історію.<br />
                  <span className="text-foreground/40">Ми закладаємо фундамент.</span>
                </h3>
              </div>
              <p>
                Фундамент екосистеми, де довіра має значення. Де шлях користувача має значення. Де статус не купується, а формується.
              </p>
              <p>
                Де можливості відкриваються не через випадковість, а через реальні дії. Де автоматизована логіка має допомагати зменшувати хаос, людський фактор і непрозорість.
              </p>
              <p>
                Де якість, комфорт і безпека є не додатком, а основою.
              </p>
            </div>
          </div>

          {/* INVITATION */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-foreground uppercase">
              Наше запрошення
            </h2>
            <div className="space-y-6">
              <p>
                Ми вдячні кожному, хто здатен побачити не лише поточний етап, а й сам масштаб задуму.
              </p>
              <p>
                Кожному, хто може оцінити не тільки результат у моменті, а й ті зусилля, віру і послідовність, які стоять за кожним рішенням і кожним кроком уперед.
              </p>
              <p>
                Ми будемо раді всім, хто доєднається до цієї екосистеми.
              </p>
              <p>
                Тим, хто відчуває близькість до цих сенсів.
              </p>
              <p>
                Тим, хто хоче не просто користуватися платформою, а разом із нами розвивати, наповнювати і втілювати в життя ідеї, що можуть стати важливими для всієї спільноти.
              </p>
              <div className="space-y-5 pt-4">
                <p className="text-foreground font-semibold text-xl">LECTOR — це більше, ніж платформа.</p>
                <p className="pl-6 border-l-[3px] border-accent/20 space-y-3 py-2 text-foreground/80 font-medium">
                  <span className="block">Це спільний рух.</span>
                  <span className="block">Це простір співтворення.</span>
                  <span className="block">Це повага до практики і до людей, які її несуть.</span>
                  <span className="block">Це екосистема довіри, реального шляху і поступового відкриття можливостей.</span>
                  <span className="block">Це місце, де значення має не штучний образ, а присутність.</span>
                  <span className="block">Це крок до нового, сильнішого, сучаснішого етапу для всієї галузі.</span>
                </p>
              </div>
              <div className="pt-6 space-y-3 italic opacity-80">
                <p>Нехай цей початок буде гідним.</p>
                <p>Нехай він буде сильним.</p>
                <p>Нехай у нас вистачить бачення, терпіння, енергії й масштабу мислення пройти цей шлях так, як він того заслуговує.</p>
              </div>
              <p className="pt-6 text-foreground font-medium text-lg">
                Дякуємо всім, хто з нами.
              </p>
            </div>
          </div>

          <div className="pt-16 pb-8 flex justify-center">
            <div className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground/90 relative inline-block">
              Стартуємо.
              <div className="absolute -bottom-2 md:-bottom-4 left-0 right-0 h-1 bg-accent rounded-full opacity-50"></div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
