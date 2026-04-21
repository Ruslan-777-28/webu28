'use client';

import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import { PageCloseButton } from '@/components/page-close-button';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactSettings {
  supportIntro?: string;
  supportEmail?: string;
  showDirectEmails?: boolean;
}

export default function SupportPage() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await addDoc(collection(db, 'contactSubmissions'), {
        type: 'support',
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMsg('Виникла помилка. Спробуйте пізніше.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="relative flex-grow container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <PageCloseButton fallbackHref="/contact" />

        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-accent mb-6">
              Support Center
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-8 leading-[1.1]">
              Підтримка
            </h1>
            
            {isLoading ? (
              <div className="space-y-3 mx-auto">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            ) : (
              <div className="text-lg text-muted-foreground/80 font-light leading-relaxed whitespace-pre-wrap">
                {settings?.supportIntro || 'Виникли технічні питання або проблеми в роботі платформи? Розкажіть нам про це, і наша команда технічної підтримки допоможе якнайшвидше.'}
              </div>
            )}
          </div>

          <div className="bg-card border border-border/30 rounded-2xl p-6 md:p-12 shadow-sm relative overflow-hidden">
            {isSuccess ? (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                 <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                    <div className="w-6 h-6 rounded-full bg-accent animate-pulse" />
                 </div>
                 <h3 className="text-3xl font-bold tracking-tighter mb-4 text-foreground">Ваше звернення отримано. Дякуємо.</h3>
                 <p className="text-muted-foreground/80 font-light max-w-md mx-auto leading-relaxed text-lg">
                    Команда LECTOR опрацює його та повернеться з відповіддю у відповідному форматі.
                 </p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Ім'я *</label>
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full bg-background border border-border/50 rounded-lg px-4 py-3.5 placeholder-muted-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
                      placeholder="Ваше ім'я"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Email *</label>
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="w-full bg-background border border-border/50 rounded-lg px-4 py-3.5 placeholder-muted-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
                      placeholder="your@email.com"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Тема звернення</label>
                 <input 
                   type="text" name="subject" value={formData.subject} onChange={handleChange}
                   className="w-full bg-background border border-border/50 rounded-lg px-4 py-3.5 placeholder-muted-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
                   placeholder="Коротко про суть проблеми"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Опис проблеми *</label>
                 <textarea 
                   name="message" value={formData.message} onChange={handleChange} required rows={6}
                   className="w-full bg-background border border-border/50 rounded-lg px-4 py-3.5 placeholder-muted-foreground/30 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                   placeholder="Детально опишіть, що саме працює не так або з чим виникли труднощі..."
                 ></textarea>
              </div>
              
              {errorMsg && <div className="text-sm text-destructive">{errorMsg}</div>}

              <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-12 bg-foreground text-background font-bold py-4 rounded-lg uppercase tracking-widest text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Надсилання...' : 'Надіслати запит'}
                  </button>
              </div>
            </form>

            {!isLoading && settings?.showDirectEmails && settings?.supportEmail && (
               <div className="mt-12 pt-8 border-t border-border/30 text-center">
                  <p className="text-sm text-muted-foreground/60 mb-2">Direct email служби підтримки:</p>
                  <a href={`mailto:${settings.supportEmail}`} className="text-foreground tracking-wide font-medium hover:text-accent transition-colors">
                    {settings.supportEmail}
                  </a>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
