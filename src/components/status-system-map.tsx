'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  ShieldCheck, 
  Users, 
  Award, 
  ArrowRight, 
  Star, 
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatusSystemMap() {
  const sections = [
    {
      id: 'presence',
      title: 'Рівні присутності профілю',
      description: 'Показує, наскільки повно і змістовно представлений ваш профіль в екосистемі LECTOR.',
      status: 'live',
      icon: Users,
      items: [
        { label: 'Базовий', desc: 'Мінімальна інформація для ідентифікації.' },
        { label: 'Відкритий', desc: 'Додано основні дані та напрями роботи.' },
        { label: 'Наповнений', desc: 'Профіль містить біографію та активні послуги.' },
        { label: 'Сильний', desc: 'Високий рівень деталізації та візуального наповнення.' },
        { label: 'Повний', desc: 'Максимально розкритий профіль з усіма артефактами.' },
      ],
      cta: { label: 'Посилити профіль', href: '/user' }
    },
    {
      id: 'trust',
      title: 'Рівні довіри',
      description: 'Система верифікації, що підтверджує вашу ідентичність та професійний статус.',
      status: 'live',
      icon: ShieldCheck,
      items: [
        { label: 'Підтверджений акаунт', desc: 'Верифікація контактних даних (Email/Phone).' },
        { label: 'Підтверджена особа', desc: 'Документальне підтвердження особистості.' },
        { label: 'Активний професіонал', desc: 'Наявність реальних послуг та успішних взаємодій.' },
        { label: 'Перевірено платформою', desc: 'Найвищий рівень довіри та ручна верифікація.' },
      ],
      cta: { label: 'Рівні довіри', href: '/trust-verification' }
    },
    {
      id: 'roles',
      title: 'Особливі ролі',
      description: 'Статусно-рольові відмінності для активних учасників та провідників спільноти.',
      status: 'hybrid',
      icon: Star,
      items: [
        { label: 'Архітектор', desc: 'Учасник Sprint-програми, що будує мережу довіри.', status: 'live' },
        { label: 'Community Architect', desc: 'Особливий статус для модераторів та провідників.', status: 'live' },
        { label: 'Куратор', desc: 'Експерт з найвищим рівнем репутації та впливу.', status: 'prestige' },
      ],
      cta: { label: 'Про Sprint-програму', href: '/referral-sprint-program' }
    },
    {
      id: 'prestige',
      title: 'Визнання та нагороди',
      description: 'Публічний шар престижу: номінації, сезонні відзнаки та Hall of Fame.',
      status: 'prestige',
      icon: Award,
      items: [
        { label: 'Номінації', desc: 'Відзнаки за конкретні досягнення в категоріях.' },
        { label: 'Сезонні відзнаки', desc: 'Фіксація успіхів за певний проміжок часу.' },
        { label: 'Hall of Fame', desc: 'Реєстр легендарних учасників екосистеми.' },
      ],
      cta: { label: 'Вітрина нагород', href: '/status/nominations' }
    }
  ];

  return (
    <div className="space-y-12 mb-20">
      {/* Intro Header */}
      <div className="space-y-4 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground">
          Карта статусів LECTOR
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Статус у LECTOR — це багатогранна система, яка поєднує вашу присутність, рівень довіри, 
          соціальну роль та публічне визнання. Використовуйте цю карту, щоб розуміти свій поточний стан 
          та можливості для зростання.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.id} className="bg-muted/30 border-muted overflow-hidden flex flex-col group hover:bg-muted/40 transition-colors duration-500">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-background border border-muted/20 flex items-center justify-center text-accent/80 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <section.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground/90">
                      {section.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={cn(
                        "text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded border",
                        section.status === 'live' ? "bg-emerald-500/5 text-emerald-500/70 border-emerald-500/10" : 
                        section.status === 'hybrid' ? "bg-amber-500/5 text-amber-500/70 border-amber-500/10" :
                        "bg-blue-500/5 text-blue-500/70 border-blue-500/10"
                      )}>
                        {section.status === 'live' ? 'Live Layer' : section.status === 'hybrid' ? 'Hybrid / Live' : 'Prestige Layer'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                {section.description}
              </p>

              <div className="space-y-4 flex-1">
                {section.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start group/item">
                    <div className="h-5 w-5 rounded-full border border-muted/30 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:border-accent/40 transition-colors">
                      <div className="h-1.5 w-1.5 rounded-full bg-muted/30 group-hover/item:bg-accent/40 transition-colors" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-foreground/80">
                          {item.label}
                        </span>
                        {(item as any).status === 'prestige' && (
                          <Sparkles className="w-2.5 h-2.5 text-blue-400 opacity-60" />
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-muted/10">
                <Button asChild variant="ghost" size="sm" className="w-full justify-between h-9 text-[10px] font-black uppercase tracking-widest hover:bg-muted/5 group/btn">
                  <Link href={section.cta.href}>
                    {section.cta.label}
                    <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover/btn:translate-x-1 group-hover/btn:opacity-100 transition-all" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection to Points */}
      <Card className="bg-accent/5 border-accent/10 overflow-hidden">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="h-16 w-16 rounded-2xl bg-background border border-accent/20 flex items-center justify-center text-accent shadow-sm shrink-0">
            <Zap className="h-8 w-8" />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h3 className="text-xl font-black uppercase tracking-tight text-foreground">
              Бали та Статус: Енергія та Форма
            </h3>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Бали (Bonus Balance) відображають вашу динаміку активності та вклад у розвиток спільноти в реальному часі. 
              Статус — це зафіксований результат вашого шляху: рівень довіри, глибина присутності та визнання. 
              Разом вони формують вашу вагу в екосистемі LECTOR.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link href="/rewards" className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                Система балів <ChevronRight className="w-3 h-3" />
              </Link>
              <Link href="/trust-verification" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 hover:text-foreground transition-all">
                Рівні довіри <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
