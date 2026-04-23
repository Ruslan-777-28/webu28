'use client';

import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import { PageCloseButton } from '@/components/page-close-button';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Handshake, Building2, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { UnifiedContactForm } from '@/components/unified-contact-form';

interface ContactSettings {
  contactIntro?: string;
  generalEmail?: string;
  supportEmail?: string;
  showDirectEmails?: boolean;
}

export default function ContactHubPage() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'siteSettings', 'contact'));
        if (docSnap.exists()) {
          setSettings(docSnap.data() as ContactSettings);
        }
      } catch (err) {
        console.error("Error loading contact settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="relative flex-grow container mx-auto px-4 py-16 md:py-24 lg:py-32 max-w-6xl">
        <PageCloseButton fallbackHref="/" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Form Hub */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <div className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-accent mb-6">
                Direct Line
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-8 leading-[1.1]">
                Зв’язок з LECTOR
              </h1>
              
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-4 w-3/4 max-w-sm" />
                </div>
              ) : (
                <div className="text-lg md:text-xl text-muted-foreground/80 font-light leading-relaxed max-w-2xl whitespace-pre-wrap">
                  {settings?.contactIntro || 'Залиште своє повідомлення, і ми повернемося до вас найближчим часом. Ми поважаємо ваш час та увагу.'}
                </div>
              )}
            </div>

            <div className="bg-card border border-border/30 rounded-2xl shadow-sm relative overflow-hidden">
              <UnifiedContactForm 
                variant="general"
                hideHeader
                className="p-2 md:p-4"
              />

              {!isLoading && settings?.showDirectEmails && settings?.generalEmail && (
                 <div className="pb-10 pt-2 text-center">
                    <p className="text-sm text-muted-foreground/60 mb-2">Або напишіть нам напряму:</p>
                    <a href={`mailto:${settings.generalEmail}`} className="text-foreground tracking-wide font-medium hover:text-accent transition-colors">
                      {settings.generalEmail}
                    </a>
                 </div>
              )}
            </div>
          </div>

          {/* Right Column: Routing Cards */}
          <div className="lg:col-span-5 space-y-6 pt-2 lg:pt-16">
             <Link 
               href="/partnerships" 
               className="group block bg-card border border-border/30 rounded-2xl p-6 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
             >
                <div className="w-12 h-12 bg-accent/10 rounded-xl mb-6 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                   <Handshake className="h-6 w-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-3">
                  Партнерства та співпраця
                </h3>
                <p className="text-muted-foreground/80 font-light mb-6 text-sm md:text-base">
                  Для ділових пропозицій, медіа-колаборацій та стратегічних ініціатив. Створюємо цінність разом.
                </p>
                <div className="flex items-center text-accent text-sm font-bold uppercase tracking-widest">
                  Детальніше <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
             </Link>

             <Link 
               href="/architects/apply" 
               className="group block bg-card border border-border/30 rounded-2xl p-6 hover:border-foreground/40 hover:shadow-xl transition-all duration-300"
             >
                <div className="w-12 h-12 bg-foreground/5 rounded-xl mb-6 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform duration-300">
                   <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-3">
                  Заявка на статус архітектора
                </h3>
                <p className="text-muted-foreground/80 font-light mb-6 text-sm md:text-base">
                  Офіційна процедура верифікації експертів. Долучіться до розбудови екосистеми як куратор напряму.
                </p>
                <div className="flex items-center text-foreground text-sm font-bold uppercase tracking-widest">
                  Подати заявку <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
             </Link>

             <Link 
               href="/support" 
               className="group block bg-card border border-border/30 rounded-2xl p-6 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
             >
                <div className="w-12 h-12 bg-accent/5 rounded-xl mb-6 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                   <LifeBuoy className="h-6 w-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-3">
                  Підтримка та технічні питання
                </h3>
                <p className="text-muted-foreground/80 font-light mb-6 text-sm md:text-base">
                  Виникли труднощі або технічні помилки? Наша команда допоможе вирішити будь-яке питання в роботі платформи.
                </p>
                <div className="flex items-center text-accent text-sm font-bold uppercase tracking-widest">
                  Написати у підтримку <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
             </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
