import React from 'react';
import { Metadata } from 'next';
import { PageCloseButton } from '@/components/page-close-button';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Вивід коштів | LECTOR',
  description: 'Як працюють виплати, утримання, перевірка та доступність коштів на платформі.',
};

export default function PayoutsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 lg:py-32 max-w-5xl relative">
        <PageCloseButton fallbackHref="/" />
        
        {/* HERO SECTION */}
        <div className="mb-16 md:mb-24 border-b border-border/40 pb-12">
          <div className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-accent mb-6">
            PAYOUTS
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground mb-8 leading-[0.9] uppercase">
            Вивід <br className="hidden md:block" /> коштів
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/80 font-light tracking-tight max-w-2xl">
            Як працюють виплати, утримання, перевірка та доступність коштів на платформі
          </p>
        </div>

        {/* CONTENT COLUMN */}
        <div className="max-w-3xl">
          
          {/* INTRODUCTION */}
          <section className="mb-16 md:mb-20">
            <div className="space-y-6 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
              <p>
                <span className="text-foreground font-medium">LECTOR</span> надає професіоналам можливість отримувати виплати за завершені платні взаємодії, цифрові продукти та інші дозволені формати монетизації, які підтримуються платформою.
              </p>
              <p>
                Ми прагнемо, щоб система виплат була зрозумілою, передбачуваною та безпечною як для професіоналів, так і для користувачів платформи. Саме тому вивід коштів пов’язаний не лише з фактом оплати, а й із завершенням відповідної взаємодії, перевіркою акаунта, дотриманням правил платформи та проходженням необхідних періодів утримання.
              </p>
            </div>
          </section>

          {/* SECTION 1 */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase mb-8">
              1. Хто може отримувати виплати
            </h2>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
              <p>Вивід коштів доступний користувачам, які:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>мають активний акаунт у good standing;</li>
                <li>пройшли базову або повну верифікацію, якщо вона потрібна для конкретного рівня доступу;</li>
                <li>додали коректний метод виводу коштів;</li>
                <li>дотримуються правил платформи, правил спільноти та вимог безпеки;</li>
                <li>не мають активних обмежень, блокувань, fraud-flags або незакритих спорів, які впливають на виплати.</li>
              </ul>
              <p className="bg-muted/30 p-4 border-l-2 border-accent/20 italic text-sm md:text-base">
                У деяких випадках LECTOR може вимагати розширену перевірку особи, платіжних даних або професійного статусу перед активацією або відновленням виплат.
              </p>
            </div>
          </section>

          {/* SECTION 2 */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase mb-8">
              2. Коли кошти стають доступними до виводу
            </h2>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
              <p>Не всі отримані кошти стають доступними до виводу миттєво.</p>
              <p>Як правило, кошти переходять у статус <span className="font-medium text-foreground">available for payout</span> після того, як:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>відповідна комунікація або послуга вважається завершеною;</li>
                <li>минув застосовний період утримання;</li>
                <li>не залишилося активних refund, dispute або chargeback ризиків за цією взаємодією;</li>
                <li>акаунт не потребує додаткової перевірки.</li>
              </ul>
              <p>До цього моменту кошти можуть відображатися як:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>pending;</li>
                <li>on hold;</li>
                <li>under review;</li>
                <li>reserved;</li>
                <li>available.</li>
              </ul>
            </div>
          </section>

          {/* SECTION 3 */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase mb-8">
              3. Період утримання і резерви
            </h2>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
              <p>Щоб захистити платформу, користувачів і професіоналів від шахрайства, передчасних виплат, dispute-сценаріїв, технічних помилок або зловживань, LECTOR може застосовувати:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2.5 shrink-0"></div><span>тимчасове утримання коштів;</span></div>
                <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2.5 shrink-0"></div><span>rolling reserve;</span></div>
                <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2.5 shrink-0"></div><span>fixed reserve;</span></div>
                <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2.5 shrink-0"></div><span>індивідуальні review holds;</span></div>
                <div className="flex gap-3 md:col-span-2"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2.5 shrink-0"></div><span>додаткові затримки для нових або high-risk акаунтів.</span></div>
              </div>
              <p className="mt-6">Резерв або hold може застосовуватися, зокрема, якщо:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>акаунт є новим;</li>
                <li>професіонал ще не має стабільної історії завершених взаємодій;</li>
                <li>є підвищений рівень refund або dispute активності;</li>
                <li>зафіксовано підозрілу активність;</li>
                <li>відбувається різке зростання обсягів транзакцій;</li>
                <li>платформа очікує завершення верифікації або перевірки документів.</li>
              </ul>
              <p className="pt-4 border-t border-border/40 text-sm md:text-base font-medium">
                LECTOR залишає за собою право визначати розумний строк утримання коштів залежно від ризик-профілю, типу взаємодії, категорії послуги, країни, способу виплати та історії акаунта.
              </p>
            </div>
          </section>

          {/* SECTION 4 */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase mb-8">
              4. Перші виплати для нових акаунтів
            </h2>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
              <p>Для нових професійних акаунтів перші виплати можуть надходити повільніше, ніж подальші.</p>
              <p>Це може бути пов’язано з:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>початковою верифікацією;</li>
                <li>перевіркою методу виводу;</li>
                <li>захистом від fraud-risk;</li>
                <li>внутрішнім probation period;</li>
                <li>очікуванням завершення першого циклу взаємодій.</li>
              </ul>
              <p>
                Після того як акаунт проходить початковий етап перевірки та демонструє стабільну коректну активність, строки виплат зазвичай стають більш передбачуваними.
              </p>
            </div>
          </section>

          {/* SECTION 5 */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase mb-8">
              5. Метод виводу коштів
            </h2>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
              <p>Щоб отримувати виплати, користувач має додати та підтримувати дійсний payout method, який підтримується платформою або платіжним партнером.</p>
              <p>LECTOR може підтримувати один або кілька варіантів:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>банківський рахунок;</li>
                <li>картковий payout;</li>
                <li>інтегрований payout provider;</li>
                <li>інші дозволені платіжні рішення.</li>
              </ul>
              <p className="bg-muted/10 p-6 border border-border/40 rounded-sm">
                Поки метод виводу не підтверджений або не готовий до прийому коштів, виплати можуть бути поставлені на паузу.
              </p>
              <p>Користувач несе відповідальність за:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>правильність реквізитів;</li>
                <li>актуальність payout-даних;</li>
                <li>доступ до свого методу виплат;</li>
                <li>відповідність місцевим вимогам, якщо вони застосовуються.</li>
              </ul>
            </div>
          </section>

          {/* SECTION 6 */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase mb-8">
              6. Верифікація для виплат
            </h2>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
              <p>Для активації або продовження виплат LECTOR може запросити:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 list-disc pl-5">
                <li className="marker:text-accent/50">повне ім’я;</li>
                <li className="marker:text-accent/50">дату народження;</li>
                <li className="marker:text-accent/50">адресу;</li>
                <li className="marker:text-accent/50">країну проживання або діяльності;</li>
                <li className="marker:text-accent/50">підтвердження телефону та email;</li>
                <li className="marker:text-accent/50">документи, що посвідчують особу;</li>
                <li className="marker:text-accent/50">selfie або liveness check;</li>
                <li className="md:col-span-2 marker:text-accent/50">податкову або бізнес-інформацію, якщо це потрібно;</li>
                <li className="md:col-span-2 marker:text-accent/50">інші відомості, які можуть бути необхідні для безпеки, legal compliance або роботи payout partner.</li>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border/40">
                <p className="mb-4">Якщо надані дані неповні, недійсні, не збігаються, не можуть бути верифіковані або викликають питання з боку платформи або платіжного партнера, LECTOR може:</p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>призупинити виплати;</li>
                  <li>тимчасово обмежити функції монетизації;</li>
                  <li>запросити повторну перевірку;</li>
                  <li>утримувати кошти до завершення review.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 7-8-9 (grouped for flow) */}
          <section className="space-y-16 md:space-y-24 mb-16 md:mb-24">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase mb-6">7. Мінімальна сума для виводу</h2>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
                <p>LECTOR може встановлювати мінімальну суму для виводу, технічні ліміти на одну виплату, денні, тижневі або місячні ліміти, а також різні правила для різних payout methods або юрисдикцій.</p>
                <p>Актуальні ліміти можуть відображатися в акаунті, payout settings або payout dashboard.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase mb-6">8. Комісії та витрати</h2>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
                <p>LECTOR може утримувати або відображати platform fee, payout processing fee, currency conversion fee, partner fee та інші застосовні технічні або фінансові витрати.</p>
                <p>Якщо такі суми застосовуються, вони мають бути відображені в payout logic, transaction breakdown або payout summary до підтвердження виводу, коли це технічно можливо.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase mb-6">9. Refunds, disputes і negative balance</h2>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
                <p>Якщо після нарахування коштів виникає refund, dispute, chargeback, скасування, технічна корекція, moderation action або порушення правил, LECTOR може:</p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>утримати частину коштів;</li>
                  <li>скоригувати доступний баланс;</li>
                  <li>тимчасово заморозити payout;</li>
                  <li>зарахувати суму в reserve;</li>
                  <li>сформувати negative balance;</li>
                  <li>списати відповідну суму з майбутніх надходжень.</li>
                </ul>
                <p className="bg-muted/30 p-4 border-l-2 border-accent/20 italic mt-4">
                  Якщо баланс акаунта стає від’ємним, наступні доходи можуть бути використані для його покриття до моменту відновлення позитивного стану.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 10-14 (grouped for flow) */}
          <section className="space-y-16 md:space-y-24 mb-16 md:mb-24 border-t border-border/40 pt-16 md:pt-24 opacity-90">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground uppercase mb-6">10. Порушення правил і обмеження виплат</h2>
              <p className="text-base text-muted-foreground/90 font-light leading-relaxed mb-4">
                Платформа може обмежити або зупинити виплати, якщо виявлено fraud signals або suspicious behavior, акаунт порушує правила спільноти, є спроби обійти політики платформи, використовується підроблена або чужа платіжна інформація, є серйозні скарги, dispute-patterns або moderation flags, або професіонал порушує payout, compliance або safety rules.
              </p>
              <p className="text-base text-muted-foreground/90 font-light leading-relaxed">
                У таких випадках LECTOR може провести додатковий review до ухвалення рішення щодо подальших виплат.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground uppercase mb-6">11. Податки і відповідальність користувача</h2>
              <p className="text-base text-muted-foreground/90 font-light leading-relaxed mb-4">
                Професіонал несе відповідальність за коректність своїх payout і податкових даних, декларування доходів, якщо це потрібно за його законодавством, сплату податків, зборів або інших обов’язкових платежів, а також дотримання місцевих вимог до самозайнятості, підприємницької діяльності або професійної практики.
              </p>
              <p className="text-base text-muted-foreground/90 font-light leading-relaxed">
                LECTOR може запитувати додаткову інформацію, якщо це потрібно для legal compliance, tax reporting або роботи платіжної інфраструктури.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground uppercase mb-6">12. Бонусні бали і внутрішні бонуси</h2>
              <p className="text-base text-muted-foreground/90 font-light leading-relaxed mb-4">
                Якщо на платформі використовуються бонусні бали, promotional credits, referral bonuses або інші внутрішні бонусні механіки, вони не обов’язково є грошовими коштами та не обов’язково підлягають прямому виводу.
              </p>
              <p className="text-base text-muted-foreground/90 font-light leading-relaxed">
                Можливість використання таких бонусів, порядок їх нарахування, строки дії та можливість або неможливість конвертації визначаються окремими правилами відповідної програми.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground uppercase mb-6">13. Строки фактичного зарахування</h2>
              <p className="text-base text-muted-foreground/90 font-light leading-relaxed mb-4">
                Після того як виплата була ініційована платформою або платіжним партнером, фактичний строк зарахування коштів може залежати від країни, банку, способу виплати, дня тижня, локальних банківських правил, святкових і неробочих днів, а також перевірок платіжного провайдера.
              </p>
              <p className="text-base text-foreground font-medium">
                LECTOR не гарантує миттєве зарахування в усіх випадках.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground uppercase mb-6">14. Зміни до правил виплат</h2>
              <p className="text-base text-muted-foreground/90 font-light leading-relaxed">
                LECTOR може змінювати ці правила, якщо це потрібно для безпеки, відповідності закону, змін у роботі платіжних партнерів, розвитку продукту, а також захисту спільноти та платформи. Оновлена версія починає діяти з моменту її публікації, якщо інше не зазначено окремо.
              </p>
            </div>
          </section>

          {/* CONTACT INFO */}
          <section className="mt-24 mb-16 p-10 bg-foreground/[0.02] border border-border/50 text-center space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">15. Підтримка щодо виплат</h2>
            <div className="text-base space-y-2 text-muted-foreground font-light max-w-lg mx-auto">
              <p>
                Якщо у вас виникли питання щодо статусу виплати, payout holds, failed payouts, verification review, disputes або payout restrictions, зверніться до служби підтримки платформи через доступні канали support.
              </p>
              <p className="text-accent pt-4 font-medium">Email: support@lector.global</p>
            </div>
          </section>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
