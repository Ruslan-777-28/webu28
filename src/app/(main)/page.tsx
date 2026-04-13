'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Power as PowerIcon, Info, MoveRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { useUser } from '@/hooks/use-auth';
import { UserNav } from '@/components/user-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AuthModal } from '@/components/auth-modal';
import { HeroCircleMedia } from '@/components/hero-circle-media';
import { Navigation } from '@/components/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HomeStatusLink } from '@/components/home-status-link';

export default function HomePage() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  const subcategories = [
    { slug: 'tarot', label: 'tarot', align: 'justify-center pr-8', weight: 'large', color: 'text-sidebar-foreground/45', description: 'фахівці з таро, читачі карт, практики символічних розкладів, інтерпретатори життєвих ситуацій, стосунків, вибору шляху та внутрішніх станів через систему карт.' },
    { slug: 'astrology', label: 'astrology', align: 'justify-start pl-2 md:pl-4', weight: 'large', color: 'text-sidebar-foreground/95', description: 'астрологи, консультанти з натальної карти, сумісності, транзитів, життєвих циклів, періодів змін, особистих схильностей і космічних впливів.' },
    { slug: 'numerology', label: 'numerology', align: 'justify-end pr-4 md:pr-10', weight: 'large', color: 'text-sidebar-foreground/40', description: 'нумерологи, спеціалісти з числа долі, життєвого шляху, персональних циклів, аналізу дат народження, імен та числових кодів людини.' },
    { slug: 'energy-practices', label: 'energy practices', align: 'justify-start pl-10 md:pl-16', weight: 'compact', color: 'text-sidebar-foreground/95', description: 'енергопрактики, майстри балансування стану, фахівці з чакральної гармонізації, відновлення ресурсу, тонкої чутливості, роботи з внутрішньою енергією та відчуттям потоку.' },
    { slug: 'meditation', label: 'meditation / mindfulness', align: 'justify-center pl-6 md:pl-10', weight: 'compact', color: 'text-sidebar-foreground/50', description: 'практики медитації, усвідомленості, внутрішнього заземлення, ментального балансу, концентрації, емоційного розвантаження та уважної присутності в собі.' },
    { slug: 'spiritual-coaching', label: 'spiritual coaching', align: 'justify-start pl-0 md:pl-2', weight: 'compact', color: 'text-sidebar-foreground/90', description: 'духовні наставники, провідники особистісного росту, спеціалісти з внутрішньої опори, сенсів, життєвого напрямку, самопізнання та м’якого особистого супроводу.' },
    { slug: 'oracle-practices', label: 'oracle practices', align: 'justify-end pr-6 md:pr-12', weight: 'compact', color: 'text-sidebar-foreground/50', description: 'практики оракульних систем, інтуїтивні консультанти, провідники через символічні послання, оракульні колоди, образні системи та ритуальні способи отримання підказок.' },
    { slug: 'dream-reading', label: 'dream reading', align: 'justify-center pr-2 md:pr-4', weight: 'compact', color: 'text-sidebar-foreground/90', description: 'фахівці з тлумачення снів, символіки підсвідомості, повторюваних сюжетів, внутрішніх сигналів, емоційних образів та прихованих сенсів сновидінь.' },
    { slug: 'human-design', label: 'human design', align: 'justify-start pl-8 md:pl-14', weight: 'compact', color: 'text-sidebar-foreground/55', description: 'спеціалісти з Human Design, які допомагають зрозуміти тип, стратегію, авторитет, природні особливості людини, її спосіб прийняття рішень і взаємодії зі світом.' },
    { slug: 'space-reading', label: 'space reading', align: 'justify-end pr-2 md:pr-8', weight: 'compact', color: 'text-sidebar-foreground/90', description: 'практики, що працюють із відчуттям простору, енергетикою місць, атмосферою дому чи середовища, сприйняттям просторових впливів та гармонізацією оточення.' },
    { slug: 'mentors', label: 'mentors', align: 'justify-start pl-4 md:pl-8', weight: 'large', color: 'text-sidebar-foreground/50', description: 'наставники, досвідчені провідники, консультанти з особистого розвитку, підтримки, переосмислення досвіду, вибору напрямку та проходження складних життєвих етапів.' },
    { slug: 'other', label: '...', align: 'justify-center', weight: 'large', color: 'text-sidebar-foreground/80', description: 'інші спеціалісти суміжних або нішевих напрямів, які не входять до основного списку: авторські методики, змішані практики, рідкісні системи та індивідуальні підходи.' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Left Block */}
      <div className="relative w-full md:flex-grow md:min-w-0 bg-white flex flex-col" style={{ flexBasis: '85%' }}>
        <Navigation hideBalance />
        
        {/* Main content area */}
        <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-center md:gap-16 w-full">
                {/* Circle */}
                <div className="relative w-[350px] h-[350px] md:w-[443px] md:h-[443px] flex-shrink-0">
                    <div className="absolute inset-0 rounded-full border border-border pointer-events-none z-10" />
                    <HeroCircleMedia />
                </div>
                {/* Timer */}
                <div className="flex-shrink-0 mt-8 md:mt-0">
                    <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-sm text-muted-foreground mb-2">час=енергія</p>
                        <CountdownTimer />
                        <p className="text-xs text-muted-foreground mt-2">до старту залишилось</p>
                    </div>
                </div>
            </div>
             {/* Text Block */}
            <div className="text-center text-sm text-muted-foreground max-w-5xl mt-12">
                <h2 className="text-2xl font-bold mb-8 text-foreground text-center max-w-4xl mx-auto">ВІДКРИЙ ДОСТУП ДО ЗНАНЬ БЕЗ КОРДОНІВ 24/7</h2>
                <p className="mb-4">
Платформа створена для людей, які шукають відповіді на важливі питання про стосунки, життєві рішення, особистий розвиток і власний шлях. Тут можна отримати персональні консультації, нове бачення ситуації та глибші інсайти у зручному форматі спілкування з експертами й практиками з усього світу. Ідея сервісу проста: коли час, компетенція, досвід та знання поєднуються у змістовній розмові, виникає справжня цінність для обох сторін. Платформа відкриває доступ до живої взаємодії без мовних і географічних бар’єрів, допомагає знайти фахівця під конкретний запит і створює простір для глибшого пізнання, підтримки та нових рішень. Це екосистема обміну живою енергією, сенсами та знаннями, де кожна розмова може стати точкою ясності, підтримки й нового напрямку.
                </p>
            </div>
        </main>

      </div>
      
      {/* Right Block */}
      <div className="w-full md:w-1/5 bg-sidebar relative z-10 flex flex-col">
        {/* Balance Area at the top of Sidebar */}
        <div className="p-6 md:p-8 flex justify-end items-center">
            <div className="flex items-center gap-2">
                <Link 
                    href="/referral-sprint-program"
                    className="text-xl md:text-2xl font-thin tracking-tighter text-sidebar-foreground/50 font-mono hover:text-sidebar-foreground transition-colors cursor-pointer"
                    title="Referral Sprint Program"
                >
                    000 000.00
                </Link>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="p-1 hover:bg-white/5 rounded-full transition-colors outline-none group">
                            <Info className="h-3.5 w-3.5 text-sidebar-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4 text-[11px] leading-relaxed animate-in fade-in zoom-in duration-200" align="end" sideOffset={12}>
                        <div className="space-y-2">
                            <p className="font-bold uppercase tracking-widest text-[10px]">Bonus Credits</p>
                             <p className="text-muted-foreground">
                               Внутрішній індикатор Вашої активності в еквіваленті бонусних кредитів. Нараховується платформою за вклад у розвиток спільноти: реферальну активність, публікації, рейтинг учасника та участь у партнерських програмах.
                               Використовуються виключно для активації преміум-опцій та цифрових сервісів усередині екосистеми LECTOR. Внутрішній ресурс для використання тільки в межах платформи.
                             </p>
                             <p className="text-[10px] text-accent font-medium italic">Обмін енергоінформаційних цінностей у реальному часі.</p>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
        <div className="flex-grow flex flex-col justify-center items-start pb-8 md:pb-12 overflow-y-auto w-full overflow-x-hidden">
            <div className="flex flex-col items-stretch gap-y-3 w-full px-4 md:px-8">
                <TooltipProvider delayDuration={150}>
                    {subcategories.map(({ slug, label, description, weight, align, color }) => {
                        
                        // Stark typography hierarchy logic
                        let typographyClasses = "";
                        if (weight === 'large') {
                            typographyClasses = `text-[14px] md:text-[15px] font-light tracking-[0.25em] ${color}`;
                        } else {
                            // compact
                            typographyClasses = `text-[10.5px] md:text-[11.5px] font-light tracking-[0.1em] ${color}`;
                        }

                        // Special tweak for the "..." item to ensure it feels like a large icon
                        if (slug === 'other') {
                            typographyClasses = `text-[22px] md:text-[26px] font-normal tracking-[0.3em] ${color} pt-1`;
                        }

                        return (
                            <Tooltip key={slug}>
                                <TooltipTrigger asChild>
                                    <button className={cn("text-left outline-none group w-full flex", align)}>
                                        <span className={cn(
                                            "transition-colors duration-700 ease-out",
                                            "group-hover:text-white group-focus-visible:text-white",
                                            typographyClasses
                                        )}>
                                            {label}
                                        </span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent 
                                    side="left" 
                                    align="center"
                                    sideOffset={20}
                                    className="max-w-[260px] bg-sidebar/95 border border-white/10 px-4 py-3 shadow-xl backdrop-blur-md rounded-sm"
                                >
                                    <p className="text-xs font-light leading-[1.6] tracking-wide text-sidebar-foreground/95 text-left">
                                        {description}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </TooltipProvider>
            </div>
            <HomeStatusLink />
        </div>

      </div>
    </div>
  );
}
