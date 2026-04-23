'use client';

import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import { PageCloseButton } from '@/components/page-close-button';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { UnifiedContactForm } from '@/components/unified-contact-form';

interface ContactSettings {
  architectsIntro?: string;
  architectsEmail?: string;
  showDirectEmails?: boolean;
}



export default function ArchitectApplyPage() {
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
      <main className="relative flex-grow container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <PageCloseButton fallbackHref="/contact" />

        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-accent mb-6">
              Status Apply
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-8 leading-[1.1]">
              Статус Архітектора
            </h1>
            
            {isLoading ? (
              <div className="space-y-3 mx-auto">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            ) : (
              <div className="text-lg text-muted-foreground/80 font-light leading-relaxed whitespace-pre-wrap">
                {settings?.architectsIntro || 'Офіційна процедура верифікації експертів. Після затвердження ви стаєте куратором своєї ніші у вашій країні та представляєте платформу на своєму ринку.'}
              </div>
            )}
          </div>

          <div className="bg-card border border-border/30 rounded-2xl shadow-sm relative overflow-hidden">
            <UnifiedContactForm 
                variant="architect_application"
                hideHeader
            />

            {!isLoading && settings?.showDirectEmails && settings?.architectsEmail && (
               <div className="mt-12 pt-8 border-t border-border/30 text-center">
                  <p className="text-sm text-muted-foreground/60 mb-2">Для додаткових питань щодо статусу:</p>
                  <a href={`mailto:${settings.architectsEmail}`} className="text-foreground tracking-wide font-medium hover:text-accent transition-colors">
                    {settings.architectsEmail}
                  </a>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
