'use client';

import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import { PageCloseButton } from '@/components/page-close-button';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactSettings {
  architectsIntro?: string;
  architectsEmail?: string;
  showDirectEmails?: boolean;
}

const COUNTRIES_DATA = [
  { code: 'ad', name: 'Andorra' }, { code: 'ae', name: 'UAE' }, { code: 'af', name: 'Afghanistan' }, { code: 'ag', name: 'Antigua' },
  { code: 'al', name: 'Albania' }, { code: 'am', name: 'Armenia' }, { code: 'ao', name: 'Angola' }, { code: 'ar', name: 'Argentina' },
  { code: 'at', name: 'Austria' }, { code: 'au', name: 'Australia' }, { code: 'az', name: 'Azerbaijan' }, { code: 'ba', name: 'Bosnia' },
  { code: 'bb', name: 'Barbados' }, { code: 'bd', name: 'Bangladesh' }, { code: 'be', name: 'Belgium' }, { code: 'bf', name: 'Burkina Faso' },
  { code: 'bg', name: 'Bulgaria' }, { code: 'bh', name: 'Bahrain' }, { code: 'bi', name: 'Burundi' }, { code: 'bj', name: 'Benin' },
  { code: 'bn', name: 'Brunei' }, { code: 'bo', name: 'Bolivia' }, { code: 'br', name: 'Brazil' }, { code: 'bs', name: 'Bahamas' },
  { code: 'bt', name: 'Bhutan' }, { code: 'bw', name: 'Botswana' }, { code: 'by', name: 'Belarus' }, { code: 'bz', name: 'Belize' },
  { code: 'ca', name: 'Canada' }, { code: 'cd', name: 'DR Congo' }, { code: 'cf', name: 'CAR' }, { code: 'cg', name: 'Congo' },
  { code: 'ch', name: 'Switzerland' }, { code: 'ci', name: 'Ivory Coast' }, { code: 'cl', name: 'Chile' }, { code: 'cm', name: 'Cameroon' },
  { code: 'cn', name: 'China' }, { code: 'co', name: 'Colombia' }, { code: 'cr', name: 'Costa Rica' }, { code: 'cu', name: 'Cuba' },
  { code: 'cv', name: 'Cabo Verde' }, { code: 'cy', name: 'Cyprus' }, { code: 'cz', name: 'Czechia' }, { code: 'de', name: 'Germany' },
  { code: 'dj', name: 'Djibouti' }, { code: 'dk', name: 'Denmark' }, { code: 'dm', name: 'Dominica' }, { code: 'do', name: 'Dominican Rep.' },
  { code: 'dz', name: 'Algeria' }, { code: 'ec', name: 'Ecuador' }, { code: 'ee', name: 'Estonia' }, { code: 'eg', name: 'Egypt' },
  { code: 'er', name: 'Eritrea' }, { code: 'es', name: 'Spain' }, { code: 'et', name: 'Ethiopia' }, { code: 'fi', name: 'Finland' },
  { code: 'fj', name: 'Fiji' }, { code: 'fm', name: 'Micronesia' }, { code: 'fr', name: 'France' }, { code: 'ga', name: 'Gabon' },
  { code: 'gb', name: 'UK' }, { code: 'gd', name: 'Grenada' }, { code: 'ge', name: 'Georgia' }, { code: 'gh', name: 'Ghana' },
  { code: 'gm', name: 'Gambia' }, { code: 'gn', name: 'Guinea' }, { code: 'gq', name: 'Eq. Guinea' }, { code: 'gr', name: 'Greece' },
  { code: 'gt', name: 'Guatemala' }, { code: 'gw', name: 'Guinea-Bissau' }, { code: 'gy', name: 'Guyana' }, { code: 'hn', name: 'Honduras' },
  { code: 'hr', name: 'Croatia' }, { code: 'ht', name: 'Haiti' }, { code: 'hu', name: 'Hungary' }, { code: 'id', name: 'Indonesia' },
  { code: 'ie', name: 'Ireland' }, { code: 'il', name: 'Israel' }, { code: 'in', name: 'India' }, { code: 'iq', name: 'Iraq' },
  { code: 'ir', name: 'Iran' }, { code: 'is', name: 'Iceland' }, { code: 'it', name: 'Italy' }, { code: 'jm', name: 'Jamaica' },
  { code: 'jo', name: 'Jordan' }, { code: 'jp', name: 'Japan' }, { code: 'ke', name: 'Kenya' }, { code: 'kg', name: 'Kyrgyzstan' },
  { code: 'kh', name: 'Cambodia' }, { code: 'ki', name: 'Kiribati' }, { code: 'km', name: 'Comoros' }, { code: 'kn', name: 'St. Kitts' },
  { code: 'kp', name: 'North Korea' }, { code: 'kr', name: 'South Korea' }, { code: 'kw', name: 'Kuwait' }, { code: 'kz', name: 'Kazakhstan' },
  { code: 'la', name: 'Laos' }, { code: 'lb', name: 'Lebanon' }, { code: 'lc', name: 'St. Lucia' }, { code: 'li', name: 'Liechtenstein' },
  { code: 'lk', name: 'Sri Lanka' }, { code: 'lr', name: 'Liberia' }, { code: 'ls', name: 'Lesotho' }, { code: 'lt', name: 'Lithuania' },
  { code: 'lu', name: 'Luxembourg' }, { code: 'lv', name: 'Latvia' }, { code: 'ly', name: 'Libya' }, { code: 'ma', name: 'Morocco' },
  { code: 'mc', name: 'Monaco' }, { code: 'md', name: 'Moldova' }, { code: 'me', name: 'Montenegro' }, { code: 'mg', name: 'Madagascar' },
  { code: 'mh', name: 'Marshall Is.' }, { code: 'mk', name: 'North Macedonia' }, { code: 'ml', name: 'Mali' }, { code: 'mm', name: 'Myanmar' },
  { code: 'mn', name: 'Mongolia' }, { code: 'mr', name: 'Mauritania' }, { code: 'mt', name: 'Malta' }, { code: 'mu', name: 'Mauritius' },
  { code: 'mv', name: 'Maldives' }, { code: 'mw', name: 'Malawi' }, { code: 'mx', name: 'Mexico' }, { code: 'my', name: 'Malaysia' },
  { code: 'mz', name: 'Mozambique' }, { code: 'na', name: 'Namibia' }, { code: 'ne', name: 'Niger' }, { code: 'ng', name: 'Nigeria' },
  { code: 'ni', name: 'Nicaragua' }, { code: 'nl', name: 'Netherlands' }, { code: 'no', name: 'Norway' }, { code: 'np', name: 'Nepal' },
  { code: 'nz', name: 'New Zealand' }, { code: 'om', name: 'Oman' }, { code: 'pa', name: 'Panama' },
  { code: 'pe', name: 'Peru' }, { code: 'pg', name: 'PNG' }, { code: 'ph', name: 'Philippines' }, { code: 'pk', name: 'Pakistan' },
  { code: 'pl', name: 'Poland' }, { code: 'pt', name: 'Portugal' }, { code: 'py', name: 'Paraguay' },
  { code: 'qa', name: 'Qatar' }, { code: 'ro', name: 'Romania' }, { code: 'rs', name: 'Serbia' }, { code: 'ru', name: 'Russia' },
  { code: 'rw', name: 'Rwanda' }, { code: 'sa', name: 'Saudi Arabia' }, { code: 'sb', name: 'Solomon Is.' }, { code: 'sc', name: 'Seychelles' },
  { code: 'sd', name: 'Sudan' }, { code: 'se', name: 'Sweden' }, { code: 'sg', name: 'Singapore' }, { code: 'si', name: 'Slovenia' },
  { code: 'sk', name: 'Slovakia' }, { code: 'sl', name: 'Sierra Leone' }, { code: 'sm', name: 'San Marino' }, { code: 'sn', name: 'Senegal' },
  { code: 'so', name: 'Somalia' }, { code: 'sr', name: 'Suriname' }, { code: 'ss', name: 'South Sudan' }, { code: 'st', name: 'Sao Tome' },
  { code: 'sv', name: 'El Salvador' }, { code: 'sy', name: 'Syria' }, { code: 'sz', name: 'Eswatini' }, { code: 'td', name: 'Chad' },
  { code: 'tg', name: 'Togo' }, { code: 'th', name: 'Thailand' }, { code: 'tj', name: 'Tajikistan' }, { code: 'tl', name: 'Timor-Leste' },
  { code: 'tm', name: 'Turkmenistan' }, { code: 'tn', name: 'Tunisia' }, { code: 'to', name: 'Tonga' }, { code: 'tr', name: 'Turkey' },
  { code: 'tt', name: 'Trinidad' }, { code: 'tw', name: 'Taiwan' }, { code: 'tz', name: 'Tanzania' },
  { code: 'ua', name: 'Ukraine' }, { code: 'ug', name: 'Uganda' }, { code: 'us', name: 'USA' }, { code: 'uy', name: 'Uruguay' },
  { code: 'uz', name: 'Uzbekistan' }, { code: 'vc', name: 'St. Vincent' }, { code: 've', name: 'Venezuela' },
  { code: 'vn', name: 'Vietnam' }, { code: 'vu', name: 'Vanuatu' }, { code: 'ws', name: 'Samoa' }, { code: 'ye', name: 'Yemen' },
  { code: 'za', name: 'South Africa' }, { code: 'zm', name: 'Zambia' }, { code: 'zw', name: 'Zimbabwe' }, { code: 'xk', name: 'Kosovo' }
];

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

export default function ArchitectApplyPage() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    category: '',
    profileLink: '',
    description: '',
    motivation: '',
    extraLinks: ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.country || !formData.category || !formData.description || !formData.motivation) {
      setErrorMsg('Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await addDoc(collection(db, 'contactSubmissions'), {
        type: 'architect_application',
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

          <div className="bg-card border border-border/30 rounded-2xl p-6 md:p-12 shadow-sm relative overflow-hidden">
            {isSuccess ? (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                 <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                    <div className="w-6 h-6 rounded-full bg-foreground animate-pulse" />
                 </div>
                 <h3 className="text-3xl font-bold tracking-tighter mb-4 text-foreground">Заявку прийнято. Дякуємо.</h3>
                 <p className="text-muted-foreground/80 font-light max-w-md mx-auto leading-relaxed text-lg">
                    Команда LECTOR уважно розгляне вашу інформацію та зв'яжеться з вами за вказаним email щодо подальших кроків верифікації.
                 </p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Прізвище та ім'я / Public Name *</label>
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full bg-background border border-border/50 rounded-lg px-4 py-3.5 placeholder-muted-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
                      placeholder="Як вас знає аудиторія"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Email для зв'язку *</label>
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="w-full bg-background border border-border/50 rounded-lg px-4 py-3.5 placeholder-muted-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
                      placeholder="your@email.com"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Країна представництва *</label>
                   <select 
                     name="country" value={formData.country} onChange={handleChange} required
                     className="w-full bg-background border border-border/50 rounded-lg px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors text-foreground appearance-none"
                   >
                     <option value="" disabled>Оберіть країну</option>
                     {COUNTRIES_DATA.sort((a,b) => a.name.localeCompare(b.name)).map(c => (
                       <option key={c.code} value={c.code}>{c.name}</option>
                     ))}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Ніша / Категорія *</label>
                   <select 
                     name="category" value={formData.category} onChange={handleChange} required
                     className="w-full bg-background border border-border/50 rounded-lg px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors text-foreground appearance-none"
                   >
                     <option value="" disabled>Оберіть вашу нішу</option>
                     {SUBCATEGORIES.sort().map(sub => (
                       <option key={sub} value={sub}>{sub}</option>
                     ))}
                   </select>
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Посилання на ваш профіль (Instagram / LinkedIn / Website)</label>
                 <input 
                   type="text" name="profileLink" value={formData.profileLink} onChange={handleChange}
                   className="w-full bg-background border border-border/50 rounded-lg px-4 py-3.5 placeholder-muted-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
                   placeholder="https://..."
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Коротко про вашу практику та досвід *</label>
                 <textarea 
                   name="description" value={formData.description} onChange={handleChange} required rows={4}
                   className="w-full bg-background border border-border/50 rounded-lg px-4 py-3.5 placeholder-muted-foreground/30 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                   placeholder="Розкажіть про свою експертизу, роки практики..."
                 ></textarea>
              </div>

              <div className="space-y-2">
                 <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Чому ви бажаєте стати архітектором LECTOR? *</label>
                 <textarea 
                   name="motivation" value={formData.motivation} onChange={handleChange} required rows={3}
                   className="w-full bg-background border border-border/50 rounded-lg px-4 py-3.5 placeholder-muted-foreground/30 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                   placeholder="Яку місію ви вбачаєте в цій ролі..."
                 ></textarea>
              </div>

              <div className="space-y-2">
                 <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Додаткові матеріали чи посилання</label>
                 <textarea 
                   name="extraLinks" value={formData.extraLinks} onChange={handleChange} rows={2}
                   className="w-full bg-background border border-border/50 rounded-lg px-4 py-3.5 placeholder-muted-foreground/30 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                   placeholder="Статті, відео, відгуки..."
                 ></textarea>
              </div>
              
              {errorMsg && <div className="text-sm text-destructive">{errorMsg}</div>}

              <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-12 bg-foreground text-background font-bold py-4 rounded-lg uppercase tracking-widest text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Надсилання...' : 'Подати заявку'}
                  </button>
              </div>
            </form>

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
