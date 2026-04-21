import React from 'react';
import { Metadata } from 'next';
import { PageCloseButton } from '@/components/page-close-button';
import { Navigation } from '@/components/navigation';
import { CheckCircle, ArrowRight, Layers, Sparkles, MessageSquare, ShieldCheck, Zap, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Roadmap | LECTOR',
  description: 'Етапи розвитку нашої екосистеми: від фундаменту до глобального інтелекту.',
};

const roadmapStages = [
  {
    id: 'q3-2026',
    quarter: 'Q3 2026',
    title: 'Foundation Layer',
    description: 'Закладка архітектурного фундаменту та запуск базових механізмів екосистеми.',
    deliverables: [
      'Запуск ядра платформи та інтеграція з Firebase',
      'Система базової ідентифікації користувачів та експертів',
      'Затвердження візуальної мови та преміум-дизайну',
      'Перший набір курованих категорій знань'
    ],
    icon: Layers,
    color: 'bg-accent/10',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'q4-2026',
    quarter: 'Q4 2026',
    title: 'Trust & Editorial',
    description: 'Впровадження систем довіри та розвиток едіторіал-складової контенту.',
    deliverables: [
      'Система Trust Verification (рівні 1-3)',
      'Розширені профілі експертів з історією досягнень',
      'Запуск редакційного блогу та CMS для авторів',
      'Механізми модерації та публікації контенту'
    ],
    icon: ShieldCheck,
    color: 'bg-background',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'q1-2027',
    quarter: 'Q1 2027',
    title: 'Interaction Expansion',
    description: 'Перехід до активної взаємодії: зв’язок, діалог та спільні сесії.',
    deliverables: [
      'Система прямих повідомлень (Direct Messaging)',
      'Інтеграція нативного відеозв’язку для сесій',
      'Соціальний шар: коментарі, поширення та обране',
      'Покращена навігація по матеріалах експертів'
    ],
    icon: MessageSquare,
    color: 'bg-accent/10',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'q2-2027',
    quarter: 'Q2 2027',
    title: 'Reputation & Governance',
    description: 'Масштабування через статуси та управління якістю спільноти.',
    deliverables: [
      'Запуск програми Community Architect',
      'Система глобальної репутації та заслуг',
      'Зал слави (Hall of Fame) та вітрина номінацій',
      'Механізми децентралізованої модерації'
    ],
    icon: Sparkles,
    color: 'bg-background',
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'q3-2027',
    quarter: 'Q3 2027',
    title: 'Ecosystem Depth',
    description: 'Професійні інструменти для експертів та глобальні фінансові потоки.',
    deliverables: [
      'Розширений набір інструментів монетизації',
      'Система бронювання та календарного планування',
      'Підтримка міжнародних платежів через ConnectU',
      'Глибока аналітика для професійних акаунтів'
    ],
    icon: Zap,
    color: 'bg-accent/10',
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536ad34?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'q4-2027',
    quarter: 'Q4 2027',
    title: 'Platform Intelligence',
    description: 'Інтелектуальне з’єднання контекстів та глобальне масштабування.',
    deliverables: [
      'AI- Discover: розумний пошук на основі контексту запиту',
      'Автоматизація крос-платформної взаємодії',
      'Глобальний індекс знань екосистеми LECTOR',
      'Вихід на рівень повної автономності платформи'
    ],
    icon: Globe,
    color: 'bg-background',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="relative flex-grow">
        <PageCloseButton fallbackHref="/" />
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 border-b border-border/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-accent mb-6">
                Strategic Path
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground mb-6 leading-[0.9]">
                Roadmap
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground/80 font-light leading-relaxed max-w-2xl">
                Наша подорож від створення фундаменту знань до побудови глобального інтелектуального простору. Шлях, де кожна деталь має значення.
              </p>
            </div>
          </div>
        </section>

        {/* ROADMAP STAGES (COMPACT GRID) */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-7xl mx-auto">
              {roadmapStages.map((stage) => (
                <div key={stage.id} className="group flex flex-col bg-card border border-border/20 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-accent/5 hover:border-border/40 transition-all duration-500">
                  
                  {/* Visual Header - Compact aspect ratio */}
                  <div className="relative aspect-[21/9] w-full overflow-hidden border-b border-border/10">
                    <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-1000 z-10" />
                    <img 
                      src={stage.image} 
                      alt={stage.title} 
                      className="w-full h-full object-cover grayscale brightness-[0.9] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-[1.02] group-hover:scale-100"
                    />
                    <div className="absolute top-4 left-4 z-20 flex items-center">
                      <div className="bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-md text-xs font-bold tracking-[0.1em] text-foreground font-mono shadow-sm uppercase border border-border/20">
                        {stage.quarter}
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-8 md:p-10 flex flex-col flex-grow">
                    <div className="mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-foreground leading-tight mb-3">
                        {stage.title}
                      </h2>
                      <p className="text-base text-muted-foreground/90 font-light leading-relaxed">
                        {stage.description}
                      </p>
                    </div>

                    <div className="mt-auto space-y-4 pt-6 border-t border-border/20">
                      {stage.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 group/item">
                          <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-accent mt-0.5 flex-shrink-0 opacity-50 group-hover/item:opacity-100 transition-opacity" />
                          <span className="text-sm md:text-base text-foreground/80 font-light group-hover/item:text-foreground transition-colors">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 md:py-32 bg-background border-t border-border/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-foreground mb-8 max-w-2xl mx-auto">
              Ставайте частиною майбутнього вже сьогодні
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="px-8 py-4 bg-accent text-white rounded-full font-bold text-lg hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/20">
                Долучитися до спільноти
              </button>
              <button className="flex items-center gap-2 text-foreground font-bold text-lg hover:text-accent transition-colors">
                Дізнатися більше <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
