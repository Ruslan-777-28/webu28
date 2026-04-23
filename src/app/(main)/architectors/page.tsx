'use client';

import React from 'react';
import { Navigation } from '@/components/navigation';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { WelcomeIntentSection } from '@/components/welcome-intent-section';

// 192 Countries list mapped to ISO alpha-2 codes
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

export default function ArchitectorsPage() {
    const [selectedCountry, setSelectedCountry] = React.useState<typeof COUNTRIES_DATA[0] | null>(null);

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden select-none">
            {/* 
                The Navigation component is sticky and has its own padding. 
                Using it here but keeping the overall header zone as compact as possible.
            */}
            <Navigation subtitle="Matrix Wall" />
            
            <div className="container max-w-[1400px] mx-auto px-1.5 pt-4">
                <WelcomeIntentSection />
            </div>

            <main className="flex-grow flex flex-col px-1.5 pb-1.5 min-h-0">
                <div className="pt-2 pb-4 flex justify-center items-center">
                    <h1 className="text-4xl md:text-5xl font-extralight tracking-widest uppercase text-muted-foreground/50 leading-none flex items-center">
                        <span>архітектори</span>
                        <span className="w-8 md:w-12"></span>
                        <span>платформи</span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="ml-4 p-1 rounded-full outline-none hover:bg-black/5 transition-colors opacity-30 hover:opacity-100" title="Інформація про розділ">
                                    <Info className="h-4 w-4 md:h-5 md:w-5" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent 
                                className="w-80 p-5 bg-white border border-border/40 shadow-2xl rounded-2xl text-xs leading-relaxed animate-in fade-in zoom-in-95 duration-200"
                                side="bottom"
                                align="center"
                                sideOffset={12}
                            >
                                <p className="mb-4 font-bold uppercase tracking-[0.2em] text-[9px] text-muted-foreground/50">
                                    Про матрицю
                                </p>
                                <div className="space-y-3 text-muted-foreground/80 font-normal normal-case tracking-normal">
                                    <p>
                                        На цьому екрані відображаються <span className="text-foreground font-medium">затверджені архітектори платформи</span> та <span className="text-foreground font-medium">претенденти</span>.
                                    </p>
                                    <p>
                                        Всередині кожної країни можна переглянути детальний розподіл архітекторів згідно з підкатегоріями бази знань.
                                    </p>
                                    <p>
                                        Поруч із прапором розміщується аватар <span className="text-foreground font-medium">Головного архітектора країни</span> поточного року. Він відповідає за всіх інших архітекторів своєї Ніші і є одним із 12 офіційних представників.
                                    </p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </h1>
                </div>

                {/* Grid Wall - 16 columns x 12 rows */}
                <div className="flex-1 min-h-0 bg-white">
                    <div 
                        className="grid h-full border-border/40"
                        style={{ 
                            gridTemplateColumns: 'repeat(16, minmax(0, 1fr))',
                            gridTemplateRows: 'repeat(12, minmax(0, 1fr))'
                        }}
                    >
                        {COUNTRIES_DATA.map((country, i) => {
                            const avatarSrc = `https://i.pravatar.cc/100?u=${country.code}-arch`;
                            
                            // Adaptive positioning logic
                            const isLeftHalf = (i % 16) < 8;
                            const isTopHalf = Math.floor(i / 16) < 6;

                            return (
                            <div 
                                key={i} 
                                className="relative bg-white hover:bg-slate-50 border-[0.5px] border-border/30 transition-colors duration-300 ease-out p-1 flex group cursor-pointer z-10 hover:z-50 overflow-visible w-full h-full"
                            >
                                {/* ---- 1. SMALL STATE (Always in cell) ---- */}
                                {/* Avatar Zone (Top-Left Anchored) */}
                                <div className="absolute top-[3px] left-[3px] sm:top-[4px] sm:left-[4px] flex flex-col items-start opacity-80 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-4 sm:w-10 sm:h-5 md:w-14 md:h-7 border-[0.5px] border-border/50 shadow-sm bg-muted overflow-hidden rounded-[1px] md:rounded-[2px] shrink-0">
                                        <img src={avatarSrc} alt="Architect" className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                {/* Country Zone (Top-Right Anchored) */}
                                <div className="absolute top-[3px] right-[3px] sm:top-[4px] sm:right-[4px] flex flex-col items-end opacity-80 group-hover:opacity-100 transition-opacity">
                                    <span className={`fi fi-${country.code} text-[12px] sm:text-[14px] md:text-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] rounded-none sm:rounded-[1px]`} style={{ lineHeight: 1 }} />
                                    <span className="text-[5px] sm:text-[6px] md:text-[7px] font-black text-muted-foreground/80 uppercase tracking-widest mt-0.5 mr-0.5 leading-none">
                                        {country.code}
                                    </span>
                                </div>

                                {/* ---- 2. ENLARGED / HOVER STATE (Floating Safe Preview Overlay) ---- */}
                                <div className={`
                                    absolute z-[100]
                                    w-[200px] md:w-[260px]
                                    h-[120px] md:h-[150px]
                                    bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-border/40
                                    rounded-xl
                                    opacity-0 pointer-events-none
                                    md:group-hover:opacity-100 md:group-hover:pointer-events-auto
                                    transition-all duration-300 ease-out
                                    flex justify-between items-stretch p-4 md:p-5
                                    scale-95 md:group-hover:scale-100 origin-center
                                    ${isLeftHalf ? 'md:left-[45%]' : 'md:right-[45%]'}
                                    ${isTopHalf ? 'md:top-[25%]' : 'md:bottom-[25%]'}
                                    hidden md:flex
                                `}>
                                    {/* Left Side: Persona */}
                                    <div className="flex flex-col items-start justify-between h-full w-1/2 pr-2">
                                        <div className="flex items-center gap-1.5 md:gap-2 whitespace-nowrap overflow-hidden">
                                            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground font-black leading-none truncate">
                                                NICK_A{(i+1).toString().padStart(2, '0')}
                                            </span>
                                            <span className="w-[1px] h-1.5 bg-border/60 shrink-0"></span>
                                            <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-muted-foreground/60 font-bold leading-none">
                                                {i % 4 === 0 ? 'претендент' : 'затверджено'}
                                            </span>
                                        </div>
                                        <div className="w-[60px] h-[45px] md:w-[80px] md:h-[60px] border-[0.5px] border-border/50 shadow-sm bg-muted overflow-hidden rounded-md shrink-0 my-2">
                                            <img src={avatarSrc} alt="Architect" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-[11px] md:text-[12px] uppercase tracking-widest text-foreground/90 font-black leading-none">
                                            куратор
                                        </span>
                                    </div>

                                    {/* Right Side: Action & Country */}
                                    <div className="flex flex-col items-end justify-between h-full w-1/2">
                                        <div className="flex flex-col items-end translate-y-1 md:translate-y-2">
                                            <span className={`fi fi-${country.code} text-[28px] md:text-[36px] shadow-sm rounded-[2px]`} style={{ lineHeight: 1 }} />
                                            <span className="text-[12px] md:text-[14px] font-black text-muted-foreground/80 uppercase tracking-widest mt-1.5 leading-none">
                                                {country.code}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedCountry(country); }}
                                            className="mt-auto translate-y-1.5 md:translate-y-2.5 bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent text-[9px] md:text-[10px] py-1.5 px-3 rounded uppercase font-bold tracking-widest transition-colors cursor-pointer shadow-sm whitespace-nowrap text-center"
                                        >
                                            12 архітекторів
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>

                {/* Country Architects Popup */}
                <Dialog open={!!selectedCountry} onOpenChange={(open) => !open && setSelectedCountry(null)}>
                    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8 bg-white border border-border/20 shadow-2xl rounded-2xl">
                        <DialogHeader className="mb-8 border-b border-border/20 pb-6 text-center md:text-left">
                            <DialogTitle className="text-xl md:text-2xl font-extralight tracking-widest uppercase text-foreground flex flex-col md:flex-row md:items-center gap-3">
                                <span className={`fi fi-${selectedCountry?.code} text-3xl shadow-sm rounded-sm mx-auto md:mx-0`} /> 
                                <div className="flex flex-col">
                                    <span>{selectedCountry?.name}</span>
                                    <span className="text-xs font-bold text-accent tracking-[0.2em] mt-1">— 12 АРХІТЕКТОРІВ В НІШІ</span>
                                </div>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                            {/* 12 demo architect placeholders explicitly tied to 12 subcategories */}
                            {SUBCATEGORIES.map((subcat, i) => (
                                <div key={i} className="flex flex-col items-center p-4 border border-border/30 rounded-xl hover:border-accent/30 hover:shadow-md transition-all bg-slate-50/50 h-full">
                                    <div className="w-16 h-14 shadow-sm border border-white overflow-hidden rounded-md bg-muted mb-3 relative shrink-0">
                                        <img src={`https://i.pravatar.cc/150?u=${selectedCountry?.code}-demo-${i}`} className="w-full h-full object-cover" alt="Architect" />
                                        {i === 0 && (
                                            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent shadow-sm" title="Куратор країни" />
                                        )}
                                    </div>
                                    <div className="text-center w-full flex-1 flex flex-col justify-between">
                                        <div>
                                            <p className="text-[11px] font-black text-foreground uppercase tracking-wider mb-[2px]">Учасник {(i+1).toString().padStart(2, '0')}</p>
                                            <p className="text-[10px] font-medium text-muted-foreground/80 leading-snug">
                                                {subcat}
                                            </p>
                                        </div>
                                        <div className="pt-3 mt-auto">
                                            <p className={`text-[8px] uppercase tracking-widest font-bold py-1 px-1.5 rounded-[2px] w-full text-center ${i % 3 === 0 ? 'text-accent bg-accent/10 border border-accent/20' : 'text-muted-foreground/60 bg-border/20 border border-border/10'}`}>
                                                {i % 3 === 0 ? 'Затверджено' : 'Претендент'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
