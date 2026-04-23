'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Fingerprint, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { useUser } from '@/hooks/use-auth';
import { getUserTrustState } from '@/lib/trust/get-user-trust-state';
import { TrustStrip } from '@/components/profile/trust-strip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';

type StepStatus = 'obtained' | 'available' | 'not_available' | 'action_required';

interface TrustLevelStep {
  level: number;
  title: string;
  icon: any;
  description: string;
  requirements: { label: string; met: boolean }[];
  status: StepStatus;
  statusLabel: string;
}

export default function TrustVerificationPage() {
  const { user, profile, loading: isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow container mx-auto max-w-3xl p-4 md:p-8 space-y-6 pt-10">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-36 w-full rounded-2xl" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Приватний розділ</h1>
          <p className="text-muted-foreground max-w-xs">Ця сторінка доступна лише для зареєстрованих користувачів.</p>
          <Link href="/" className="mt-6 text-primary font-bold hover:underline">На головну</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const trustState = getUserTrustState(profile);
  const currentLevel = trustState.level;
  const v = profile.verification;

  // Define the 4 levels with exact parity to app
  const steps: TrustLevelStep[] = [
    {
      level: 1,
      title: "Підтверджений акаунт",
      icon: ShieldCheck,
      description: "Перший крок до довіри спільноти. Підтвердьте ваші контактні дані для безпечної взаємодії.",
      requirements: [
        { label: "Електронна пошта підтверджена", met: !!v?.emailVerified },
        { label: "Номер телефону підтверджено", met: !!v?.phoneVerified },
        { label: "Завершено базове налаштування профілю", met: !!profile.displayName },
      ],
      status: currentLevel >= 1 ? 'obtained' : 'action_required',
      statusLabel: currentLevel >= 1 ? 'Отримано' : 'Потрібні кроки'
    },
    {
      level: 2,
      title: "Підтверджена особа",
      icon: Fingerprint,
      description: "Додаткове підтвердження особи за запитом системи для забезпечення вищих стандартів безпеки.",
      requirements: [
        { label: "Перевірка документів (KYC) за запитом", met: v?.identityVerificationStatus === 'verified' },
        { label: "Відсутність порушень на платформі", met: v?.noModerationFlags !== false },
      ],
      status: v?.identityVerificationStatus === 'verified' 
        ? 'obtained' 
        : (currentLevel === 1 ? 'available' : 'not_available'),
      statusLabel: v?.identityVerificationStatus === 'verified' 
        ? 'Отримано' 
        : (currentLevel === 1 ? 'Наступний етап' : 'Ще не доступно')
    },
    {
      level: 3,
      title: "Активний професіонал",
      icon: Briefcase,
      description: "Статус для тих, хто активно надає послуги та має успішні підтверджені взаємодії.",
      requirements: [
        { label: "Наявність активних професійних пропозицій", met: (v?.activeProfessionalOffersCount || 0) > 0 },
        { label: "Досвід успішних платних сесій", met: (v?.completedPaidInteractions || 0) > 0 },
        { label: "Позитивний рейтинг та відгуки", met: !!profile.profileMetrics?.professional },
      ],
      status: currentLevel >= 3 ? 'obtained' : (currentLevel >= 2 ? 'available' : 'not_available'),
      statusLabel: currentLevel >= 3 ? 'Отримано' : (currentLevel >= 2 ? 'Наступний етап' : 'Ще не доступно')
    },
    {
      level: 4,
      title: "Перевірено платформою",
      icon: Award,
      description: "Найвищий статус довіри, що надається на основі стабільної історії та бездоганної репутації.",
      requirements: [
        { label: "Повна верифікація від платформи", met: v?.publicTrustState === 'platform_verified' },
        { label: "Тривала історія бездоганної роботи", met: (v?.accountAgeDays || 0) > 90 },
        { label: "Відсутність системних ризиків", met: !!v?.noRefundRisk },
      ],
      status: currentLevel === 4 ? 'obtained' : 'not_available',
      statusLabel: currentLevel === 4 ? 'Отримано' : 'Ще не доступно'
    }
  ];

  const ecosystemLinks = [
    { href: '/rewards', label: 'Система балів', desc: 'Динаміка активності' },
    { href: '/status', label: 'Status Hub', desc: 'Визнання та ролі' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-grow container mx-auto max-w-4xl p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pt-10">
        {/* Hero Header */}
        <section className="relative overflow-hidden rounded-[32px] border border-primary/10 bg-card/40 backdrop-blur-md p-6 md:p-12 shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1.5 overflow-hidden">
            <TrustStrip profile={profile} />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mt-4">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                Довіра і верифікація
              </h1>
              <p className="text-muted-foreground max-w-md font-medium text-lg leading-snug">
                Спеціальна система рівнів для прозорої взаємодії та безпеки у спільноті LECTOR.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
              <div className={cn(
                "px-6 py-3 rounded-2xl font-black text-xl shadow-lg border border-white/10 uppercase tracking-tight",
                currentLevel === 4 ? "bg-[#C5A059] text-white" : "bg-primary/5 text-primary"
              )}
              style={currentLevel < 4 ? { color: trustState.color, borderColor: `${trustState.color}20` } : {}}
              >
                {trustState.label}
              </div>
              <div className="flex flex-col items-center md:items-end opacity-60">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Рівень {currentLevel} з 4
                </span>
                <div className="flex gap-1 mt-1.5">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={cn(
                            "h-1 w-6 rounded-full transition-all",
                            i <= currentLevel ? "bg-primary" : "bg-muted"
                        )} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Note */}
        <div className="p-5 rounded-3xl bg-muted/5 border border-muted/20 flex gap-5 items-start">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-primary" />
          </div>
          <div className="text-sm space-y-1.5 pt-0.5">
            <p className="font-black uppercase tracking-wider text-[11px]">Про систему рівнів</p>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Ваш рівень довіри оновлюється автоматично на основі активності та верифікації. 
              У системі LECTOR довіра працює у зв'язці з <Link href="/rewards" className="text-primary hover:underline">балами</Link> (активність) та <Link href="/status" className="text-primary hover:underline">статусом</Link> (визнання), формуючи вашу повну репутацію.
            </p>
          </div>
        </div>

        {/* Progress Path */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
             <div className="h-4 w-1 bg-primary rounded-full" />
             <h2 className="text-2xl font-black uppercase tracking-tight">Етапи зростання</h2>
          </div>
          
          <div className="grid gap-4">
            {steps.map((step) => (
              <Card 
                key={step.level}
                className={cn(
                  "group relative overflow-hidden transition-all duration-300 border-muted/20 rounded-3xl",
                  step.status === 'obtained' ? "bg-muted/5 border-primary/10 shadow-sm" : "bg-card/50",
                  step.status === 'not_available' && "grayscale-[0.5] opacity-60"
                )}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Icon Column */}
                    <div className={cn(
                      "w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 border border-white/10 shadow-xl transition-transform group-hover:scale-105 duration-500",
                      step.status === 'obtained' ? "bg-primary text-white" : "bg-muted/20 text-muted-foreground"
                    )}>
                      <step.icon className="w-10 h-10" />
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Рівень {step.level}</span>
                            <CardTitle className="text-2xl font-black uppercase tracking-tight">{step.title}</CardTitle>
                          </div>
                          <CardDescription className="text-base font-medium leading-relaxed max-w-xl">{step.description}</CardDescription>
                        </div>
                        
                        <div className="flex shrink-0">
                          {step.status === 'obtained' ? (
                            <Badge variant="outline" className="bg-green-500/5 text-green-600 border-green-500/20 gap-2 py-2 px-4 rounded-full font-black text-xs uppercase tracking-wider">
                              <CheckCircle2 className="w-4 h-4" />
                              {step.statusLabel}
                            </Badge>
                          ) : step.status === 'available' ? (
                            <Badge variant="outline" className="bg-indigo-500/5 text-indigo-600 border-indigo-500/20 gap-2 py-2 px-4 rounded-full font-black text-xs uppercase tracking-wider">
                              <Clock className="w-4 h-4" />
                              {step.statusLabel}
                            </Badge>
                          ) : step.status === 'action_required' ? (
                            <Badge variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-500/20 gap-2 py-2 px-4 rounded-full font-black text-xs uppercase tracking-wider">
                              <AlertCircle className="w-4 h-4" />
                              {step.statusLabel}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-slate-500/5 text-slate-500 border-slate-500/10 gap-2 py-2 px-4 rounded-full font-black text-xs uppercase tracking-wider opacity-60">
                              <Circle className="w-4 h-4" />
                              {step.statusLabel}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-y-3 gap-x-12 pt-6 border-t border-muted/10">
                        {step.requirements.map((req, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            {req.met ? (
                              <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-muted/20 flex items-center justify-center shrink-0">
                                <Circle className="w-3.5 h-3.5 text-muted-foreground/30" />
                              </div>
                            )}
                            <span className={cn(
                              "text-sm font-bold tracking-tight",
                              req.met ? "text-foreground" : "text-muted-foreground opacity-70"
                            )}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <footer className="text-center space-y-4 py-12">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-40">
            Система верифікації працює у автоматичному режимі. Всі дані захищені протоколами LECTOR.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link 
              href="/" 
              className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
            >
              На головну
            </Link>
            <Link 
              href="/profile" 
              className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
            >
              Мій профіль
            </Link>
            {ecosystemLinks.map(link => (
              <Link 
                key={link.href}
                href={link.href}
                className="text-xs font-black text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                {link.label}
              </Link>
            ))}
          </div>
        </footer>
      </main>

      <Footer />
    </div>
  );
}
