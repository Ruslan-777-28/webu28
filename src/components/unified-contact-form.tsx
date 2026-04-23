'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ContactFormVariant = 'general' | 'architect_application' | 'partnership' | 'support';

interface UnifiedContactFormProps {
  variant: ContactFormVariant;
  title?: string;
  description?: string;
  successTitle?: string;
  successDescription?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  className?: string;
  hideHeader?: boolean;
}

const SUBCATEGORIES = [
  'Tarot',
  'Astrology',
  'Numerology',
  'Energy Healing',
  'Meditation & Mindfulness',
  'Spiritual Coaching',
  'Oracle Practices',
  'Dream Reading',
  'Human Design',
  'Space Reading',
  'Mentors',
  'Channelling'
];

export function UnifiedContactForm({
  variant,
  title,
  description,
  successTitle,
  successDescription,
  onSuccess,
  onClose,
  className,
  hideHeader = false
}: UnifiedContactFormProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    subject: '',
    message: '',
    contact: '',
    country: '',
    category: '',
    experience: '',
    motivation: '',
    profileLink: '',
    curatorInterest: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email) {
      setErrorMsg('Будь ласка, заповніть обов\'язкові поля');
      return;
    }

    if (variant === 'architect_application' && (!formData.country || !formData.category || !formData.experience || !formData.motivation)) {
        setErrorMsg('Будь ласка, заповніть всі обов\'язкові поля для заявки');
        return;
    }

    if (variant === 'general' && !formData.message) {
        setErrorMsg('Будь ласка, введіть повідомлення');
        return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const submissionData: any = {
        type: variant,
        name: formData.name,
        email: formData.email,
        createdAt: serverTimestamp(),
        status: 'new'
      };

      if (variant === 'architect_application') {
        submissionData.subject = 'Заявка на статус архітектора';
        submissionData.contact = formData.contact;
        submissionData.country = formData.country;
        submissionData.category = formData.category;
        submissionData.profileLink = formData.profileLink;
        submissionData.curatorInterest = formData.curatorInterest ? 'Так' : 'Ні';
        submissionData.message = `Досвід: ${formData.experience}\n\nМотивація: ${formData.motivation}`;
        // Also keep raw fields for record
        submissionData.experience = formData.experience;
        submissionData.motivation = formData.motivation;
      } else {
        submissionData.subject = formData.subject || (variant === 'support' ? 'Технічна підтримка' : 'Загальне питання');
        submissionData.message = formData.message;
      }

      await addDoc(collection(db, 'contactSubmissions'), submissionData);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg('Виникла помилка. Спробуйте пізніше.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("p-10 text-center animate-in fade-in zoom-in duration-300", className)}>
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 mx-auto">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold tracking-tighter mb-4 text-foreground">
            {successTitle || (variant === 'architect_application' ? 'Заявку прийнято' : 'Повідомлення надіслано')}
        </h3>
        <p className="text-muted-foreground font-light leading-relaxed mb-8">
            {successDescription || (variant === 'architect_application' 
                ? 'Ми отримали вашу заявку на статус архітектора. Команда LECTOR зв\'яжеться з вами найближчим часом.' 
                : 'Ваше звернення отримано. Ми опрацюємо його та повернемося з відповіддю найближчим часом.')}
        </p>
        {onClose ? (
            <Button onClick={onClose} className="w-full h-12 uppercase tracking-widest font-bold">
                Зрозуміло
            </Button>
        ) : !onSuccess && (
            <Button onClick={() => setIsSuccess(false)} variant="outline" className="h-12 px-8 uppercase tracking-widest font-bold">
                Надіслати ще раз
            </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {!hideHeader && (title || description) && (
        <div className="p-8 pb-4 border-b border-border/20">
          {variant === 'architect_application' && (
            <div className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-2">Verification Flow</div>
          )}
          {title && <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-foreground">{title}</h2>}
          {description && <p className="text-muted-foreground font-light text-base pt-2 leading-relaxed">{description}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">Ім'я *</label>
            <input
              type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
              placeholder="Ваше ім'я"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">Email *</label>
            <input
              type="email" name="email" value={formData.email} onChange={handleChange} required
              className="w-full bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {variant === 'architect_application' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">Телефон / Telegram *</label>
                <input
                  type="text" name="contact" value={formData.contact} onChange={handleChange} required
                  className="w-full bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                  placeholder="@username або +380..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">Країна *</label>
                <input
                  type="text" name="country" value={formData.country} onChange={handleChange} required
                  className="w-full bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                  placeholder="Країна представництва"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">Основний напрям / спеціалізація *</label>
              <select
                name="category" value={formData.category} onChange={handleChange} required
                className="w-full bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
              >
                <option value="" disabled>Оберіть напрям</option>
                {SUBCATEGORIES.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
                <option value="Other">Інше</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">Досвід / коротко про себе *</label>
              <textarea
                name="experience" value={formData.experience} onChange={handleChange} required rows={3}
                className="w-full bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors resize-none"
                placeholder="Розкажіть про свою практику..."
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">Чому претендуєте на статус архітектора? *</label>
              <textarea
                name="motivation" value={formData.motivation} onChange={handleChange} required rows={2}
                className="w-full bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors resize-none"
                placeholder="Ваша мета в проекті..."
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">Посилання на профілі / сайт (optional)</label>
              <input
                type="text" name="profileLink" value={formData.profileLink} onChange={handleChange}
                className="w-full bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="flex items-start gap-4 p-5 bg-accent/[0.02] border border-border/60 rounded-xl transition-all duration-300 hover:border-accent/30 hover:bg-accent/[0.04] group">
              <div className="pt-1">
                <input
                  type="checkbox"
                  name="curatorInterest"
                  id="curatorInterest"
                  checked={formData.curatorInterest}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-border bg-background text-accent focus:ring-accent accent-accent cursor-pointer"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="curatorInterest" className="text-sm font-bold text-foreground cursor-pointer select-none tracking-tight">
                  Готовий(-а) у майбутньому розглядатися на роль куратора
                </label>
                <p className="text-[12px] text-muted-foreground/80 font-light leading-relaxed">
                  Ця позначка означає вашу відкритість до подальшого розгляду на кураторську роль. У майбутньому саме серед архітекторів платформи формуватиметься коло кандидатів на статус куратора у відповідній країні.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">Тема</label>
              <input
                type="text" name="subject" value={formData.subject} onChange={handleChange}
                className="w-full bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="Коротко про суть питання"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">Повідомлення *</label>
              <textarea
                name="message" value={formData.message} onChange={handleChange} required rows={5}
                className="w-full bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors resize-none"
                placeholder="Деталі вашого звернення..."
              ></textarea>
            </div>
          </>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 text-destructive text-xs font-medium animate-in slide-in-from-top-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 uppercase tracking-widest font-bold shadow-lg shadow-accent/10"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Надсилання...
            </>
          ) : (
            variant === 'architect_application' ? 'Подати заявку' : 'Надіслати звернення'
          )}
        </Button>
      </form>
    </div>
  );
}
