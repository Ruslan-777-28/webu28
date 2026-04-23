
'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  CheckCircle,
  Eye,
  MessageSquare,
  Users,
  Star,
  Sparkles,
  Heart,
  File,
  Search,
  BookOpen,
  PenSquare,
  Handshake,
  Calendar,
  Video,
  Package,
  History,
  ShieldCheck,
  Globe
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Footer from '@/components/layout/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { FaqItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHero } from '@/components/page-hero';
import { FloatingStatusLink } from '@/components/floating-status-link';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AuthModal } from '@/components/auth-modal';

const whyNeedItItems = [
    {
        icon: MessageSquare,
        title: 'Коли ви відчуваєте невизначеність',
        text: 'У моменти, коли звичні поради не працюють, а внутрішні питання про стосунки, рішення чи життєвий шлях потребують не просто інформації, а глибокого, спокійного погляду.',
    },
    {
        icon: Handshake,
        title: 'Коли вам потрібна персональна взаємодія',
        text: 'Замість загальних рекомендацій ви отримуєте живу, конфіденційну розмову, зосереджену на вашій унікальній ситуації, вашому запиті та вашому контексті.',
    },
    {
        icon: Eye,
        title: 'Коли важливо побачити новий погляд',
        text: 'Іноді розмова з правильною людиною допомагає побачити ситуацію під іншим кутом, відчути більше спокою і зрозуміти свій наступний крок набагато ясніше.',
    },
    {
        icon: Star,
        title: 'Коли ви шукаєте перевірених експертів',
        text: 'Ми об’єднали в одному просторі людей, які працюють через реальні знання, досвід, етичну практику та особисту глибину, щоб ви могли довіряти тим, до кого звертаєтесь.',
    },
     {
        icon: Sparkles,
        title: 'Коли ви втомилися від інформаційного хаосу',
        text: 'Замість того, щоб губитися між десятками розрізнених сторінок, каналів і випадкових порад, ви отримуєте структурований, спокійний простір для пошуку.',
    },
    {
        icon: Heart,
        title: 'Коли ви прагнете змістовної розмови',
        text: 'Платформа допомагає перейти від нескінченного перегляду контенту до осмисленої взаємодії, де кожна розмова має реальну цінність.',
    },
];

const registrationBenefits = [
    { icon: Search, title: 'Знаходьте “своїх” людей', text: 'Отримайте доступ до курованої спільноти експертів і практиків, щоб знайти того, хто резонує саме з вашим запитом і цінностями.' },
    { icon: Handshake, title: 'Отримуйте персональну підтримку', text: 'На відміну від загального контенту, тут ви отримуєте живу взаємодію, побудовану навколо вашої унікальної ситуації.' },
    { icon: MessageSquare, title: 'Обирайте комфортний формат', text: 'Відеодзвінок, текстова консультація чи асинхронний обмін повідомленнями — ви самі вирішуєте, як вам зручніше взаємодіяти.' },
    { icon: BookOpen, title: 'Користуйтесь екосистемою знань', text: 'Читайте, досліджуйте та зберігайте корисні матеріали, створені експертами платформи, в одному зручному просторі.' },
    { icon: Star, title: 'Формуйте своє коло довіри', text: 'Створюйте власне коло обраних експертів, напрямків і матеріалів, до яких ви завжди можете повернутися.' },
    { icon: Users, title: 'Будуйте довшу взаємодію', text: 'Повертайтеся до тих, хто вже допоміг вам побачити більше. Платформа сприяє побудові довготривалих стосунків, заснованих на довірі.' },
];

const howItWorksSteps = [
    { step: 1, title: 'Створіть акаунт', text: 'Зареєструйтесь, щоб відкрити доступ до повної взаємодії всередині платформи.' },
    { step: 2, title: 'Оберіть напрям або експерта', text: 'Досліджуйте категорії, профілі та матеріали, щоб знайти того, хто відповідає вашому запиту.' },
    { step: 3, title: 'Ознайомтесь із профілем і форматом роботи', text: 'Перегляньте подачу, зміст, стиль і доступні способи взаємодії.' },
    { step: 4, title: 'Розпочніть взаємодію', text: 'Оберіть той формат спілкування, який підходить саме вам. Натисніть виклик.' },
    { step: 5, title: 'Отримайте персональну цінність', text: 'Оцініть результат, компетентність реалізації запиту.' },
];

const interactionFormats = [
    { icon: Video, title: 'Живі консультації', text: 'Прямий відеозв’язок із експертом для персональної глибокої розмови.' },
    { icon: Calendar, title: 'Заплановані сесії', text: 'Зустрічі у визначений час для розгорнутого аналізу та роботи.' },
    { icon: Users, title: 'Групові події', text: 'Спільні події та сесії для взаємодії в колі однодумців.' },
    { icon: MessageSquare, title: 'Текстова взаємодія', text: 'Формат для тих, кому зручніше ставити запити й отримувати відповіді письмово.' },
    { icon: File, title: 'Матеріали та файли', text: 'Отримуйте додаткові рекомендації, розбори та інші корисні матеріали.' },
    { icon: Package, title: 'Цифровий контент', text: 'Досліджуйте корисні продукти, інструкції та матеріали від експертів платформи.' },
];

const useCases = [
    'коли потрібен новий погляд на ситуацію',
    'коли є важливе особисте питання',
    'коли хочеться зрозуміти внутрішній стан глибше',
    'коли потрібна жива підтримка, а не абстрактний контент',
    'коли хочеться знайти “свого” експерта',
    'коли важлива особиста, а не масова взаємодія',
];


export default function CommunityPage() {
    const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
    const [isLoadingFaq, setIsLoadingFaq] = useState(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    useEffect(() => {
        const fetchFaq = async () => {
            try {
                const faqQuery = query(
                    collection(db, 'faqItems'),
                    where('isActive', '==', true),
                    where('showOnCommunityPage', '==', true),
                    orderBy('sortOrder', 'asc')
                );

                const snapshot = await getDocs(faqQuery);
                const fetchedFaqs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as FaqItem));
                setFaqItems(fetchedFaqs);
            } catch (error) {
                console.error("Error fetching community FAQ items: ", error);
            } finally {
                setIsLoadingFaq(false);
            }
        };

        fetchFaq();
    }, []);

    return (
        <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
            <main className="flex flex-col w-full min-h-screen bg-background text-foreground">
                <Navigation />

                {/* 1. HERO SECTION */}
                <PageHero 
                    pageId="community"
                    fallbackHeadline="Знайдіть ясність у змістовній розмові"
                    fallbackSubheadline="LECTOR — це безпечний простір, де ви можете отримати персональну консультацію, новий погляд на ситуацію та живу взаємодію з перевіреними експертами, практиками й провідниками з усього світу."
                    fallbackButtonLabel="Зареєструватися"
                    fallbackButtonLink="/"
                    onButtonClick={() => setAuthModalOpen(true)}
                />

                {/* 10. SECTION “Для яких ситуацій...” (Moved up) */}
                <section className="pt-32 pb-20 bg-background">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                            Коли платформа може бути особливо корисною
                        </h2>
                        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {useCases.map((item, index) => (
                            <Card key={index} className="bg-card/70 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                                <span className="font-medium text-sm">{item}</span>
                                </CardContent>
                            </Card>
                            ))}
                        </div>
                    </div>
                </section>


                {/* 8. SECTION “Чому це краще...” (Moved up) */}
                <section className="pt-20 pb-10 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Більше, ніж нескінченний пошук у соцмережах
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Ми створили LECTOR, щоб ви могли перейти від споживання контенту до сфокусованої, змістовної взаємодії.
                            </p>
                            <p className="text-md">
                            Замість розрізнених сторінок, випадкових порад і хаосу в месенджерах ви отримуєте єдиний, надійний простір, де легко знайти експерта, обрати зручний формат і отримати реальну цінність. Це допомагає рухатися до відповідей спокійніше, точніше і з більшою довірою до процесу.
                            </p>
                            </div>
                            <div className="bg-background p-8 rounded-lg shadow-sm border space-y-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                                    <p className="text-md font-medium">Профілі, категорії й контент зібрані в одному місці.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                                    <p className="text-md font-medium">Легше знайти людину, яка резонує з вашим запитом.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                                    <p className="text-md font-medium">Менше інформаційного шуму, більше реального сенсу.</p>
                                </div>
                                 <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                                    <p className="text-md font-medium">Зручна, безпечна та цілісна взаємодія.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. SECTION “Як це працює” */}
                <section className="pt-10 pb-20 bg-card overflow-hidden">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-16 tracking-tight">
                            Як це працює
                        </h2>
                        <div className="relative max-w-5xl mx-auto">
                            {/* Horizontal connecting line (Desktop only) - Bisection height adjusted for h-12 circles */}
                            <div className="absolute top-6 left-[10%] right-[10%] hidden md:block h-[1px] bg-border/40 z-0" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-4 relative z-10">
                                {howItWorksSteps.map((item) => (
                                <div key={item.step} className="flex flex-col items-center">
                                    {/* Circle Marker (Corrective scale-up to h-12) */}
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border/40 shadow-sm mb-6 transition-colors hover:border-accent/40 duration-300">
                                        <span className="text-base font-medium text-foreground/70">{item.step}</span>
                                    </div>
                                    
                                    {/* Text Block (Restored size and spacing) */}
                                    <div className="flex flex-col space-y-2 px-1">
                                        <h3 className="text-lg font-bold text-foreground tracking-tight leading-snug md:min-h-[5rem] flex items-start justify-center">
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground text-[0.9rem] leading-relaxed font-light px-2">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. SECTION “Що ви отримуєте після реєстрації” */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Що відкриває для вас реєстрація
                            </h2>
                            <p className="text-lg text-muted-foreground">
                               Це не просто формальність, а вхід у повну екосистему для персональної взаємодії та росту.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {registrationBenefits.map((item, index) => (
                            <Card key={index} className="shadow-sm hover:shadow-lg transition-shadow">
                                <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                                    <div className="bg-background p-2 rounded-lg">
                                        <item.icon className="h-6 w-6 text-accent" />
                                    </div>
                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{item.text}</p>
                                </CardContent>
                            </Card>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* 6. CTA #1 */}
                <section className="pb-20 bg-background">
                    <div className="container mx-auto px-4 text-center">
                        <Button size="lg" onClick={() => setAuthModalOpen(true)}>Створити акаунт і почати</Button>
                    </div>
                </section>
                
                {/* 7. SECTION “Формати взаємодії” */}
                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Формати, у яких ви можете взаємодіяти
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Платформа дає свободу обирати той формат, у якому вам комфортно отримувати відповіді та підтримку.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {interactionFormats.map((format, index) => (
                            <div key={index} className="relative">
                                <Card className="shadow-sm hover:shadow-lg transition-all bg-card/50 flex flex-col h-full">
                                    <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                                        <div className="bg-background p-2 rounded-lg border">
                                            <format.icon className="h-6 w-6 text-accent" />
                                        </div>
                                        <CardTitle className="text-lg">{format.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-grow justify-start">
                                        <p className="text-muted-foreground">{format.text}</p>
                                    </CardContent>
                                </Card>
                            </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* NEW EXPERTS BLOCK */}
                <section className="py-24 bg-card overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 lg:mb-16 max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
                                <span className="block mb-2">Знайдіть свого експерта.</span>
                                <span className="block text-2xl md:text-3xl text-muted-foreground font-medium">Обирайте особистість, а не сторінку.</span>
                            </h2>
                            <p className="text-lg text-muted-foreground font-light leading-relaxed">
                                На платформі ви знаходите не випадковий контент, а людей, чий підхід, стиль і спосіб взаємодії можуть по-справжньому відгукнутися саме вам. Це допомагає обирати з більшою довірою і ясністю.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            
                            {/* Card 1 */}
                            <div className="bg-background/80 border border-border/40 rounded-xl shadow-sm overflow-hidden group hover:shadow-xl hover:border-border/60 transition-all duration-500 hover:-translate-y-1">
                                <div className="flex flex-row h-full">
                                    <div className="w-28 sm:w-32 shrink-0 border-r border-border/10 bg-muted/20 relative">
                                        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/90 backdrop-blur-sm border border-border/40 shadow-sm z-10">
                                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-500 opacity-90" />
                                            <span className="text-[7.5px] font-bold uppercase tracking-[0.08em] text-foreground/80">Verified</span>
                                        </div>
                                        <img src="https://i.pravatar.cc/400?u=archstr1" alt="Alina Zoryana" className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]" />
                                    </div>
                                    
                                    <div className="p-4 sm:p-5 flex flex-col flex-grow min-w-0">
                                        <div className="space-y-1 w-full">
                                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
                                                Alina Zoryana
                                            </h3>
                                            <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-bold text-accent truncate">
                                                Таролог, Астролог
                                            </p>
                                        </div>
                                        
                                        <p className="text-[0.8rem] sm:text-[0.85rem] text-muted-foreground mt-2 line-clamp-2 leading-snug flex-grow">
                                            Допомагаю знаходити відповіді через Таро та астрологію. Працюю з темами стосунків, внутрішніх змін і життєвих циклів.
                                        </p>

                                        <div className="mt-3 sm:mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
                                            <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-foreground">
                                                <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                                                4.9
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-medium text-muted-foreground uppercase tracking-wider bg-muted/30 px-2 py-1 rounded-md border border-border/30">
                                                <History className="w-3 h-3 opacity-70" />
                                                120+ сесій
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-background/80 border border-border/40 rounded-xl shadow-sm overflow-hidden group hover:shadow-xl hover:border-border/60 transition-all duration-500 hover:-translate-y-1">
                                <div className="flex flex-row h-full">
                                    <div className="w-28 sm:w-32 shrink-0 border-r border-border/10 bg-muted/20 relative">
                                        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/90 backdrop-blur-sm border border-border/40 shadow-sm z-10">
                                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-500 opacity-90" />
                                            <span className="text-[7.5px] font-bold uppercase tracking-[0.08em] text-foreground/80">Expert</span>
                                        </div>
                                        <img src="https://i.pravatar.cc/400?u=archstr2" alt="Ірина Вогник" className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]" />
                                    </div>
                                    
                                    <div className="p-4 sm:p-5 flex flex-col flex-grow min-w-0">
                                        <div className="space-y-1 w-full">
                                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
                                                Ірина Вогник
                                            </h3>
                                            <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-bold text-accent truncate">
                                                Нумеролог
                                            </p>
                                        </div>
                                        
                                        <p className="text-[0.8rem] sm:text-[0.85rem] text-muted-foreground mt-2 line-clamp-2 leading-snug flex-grow">
                                            Допомагаю побачити сильні сторони, внутрішні сценарії та напрям розвитку через аналіз чисел і персональні розбори.
                                        </p>

                                        <div className="mt-3 sm:mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
                                            <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-foreground">
                                                <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                                                4.8
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-medium text-muted-foreground uppercase tracking-wider bg-muted/30 px-2 py-1 rounded-md border border-border/30">
                                                <History className="w-3 h-3 opacity-70" />
                                                90+ сесій
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-background/80 border border-border/40 rounded-xl shadow-sm overflow-hidden group hover:shadow-xl hover:border-border/60 transition-all duration-500 hover:-translate-y-1 md:col-span-2 lg:col-span-1 max-w-xl mx-auto w-full lg:max-w-none">
                                <div className="flex flex-row h-full">
                                    <div className="w-28 sm:w-32 shrink-0 border-r border-border/10 bg-muted/20 relative">
                                        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/90 backdrop-blur-sm border border-border/40 shadow-sm z-10">
                                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-500 opacity-90" />
                                            <span className="text-[7.5px] font-bold uppercase tracking-[0.08em] text-foreground/80">Guided</span>
                                        </div>
                                        <img src="https://i.pravatar.cc/400?u=archstr3" alt="Максим Сидоренко" className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]" />
                                    </div>
                                    
                                    <div className="p-4 sm:p-5 flex flex-col flex-grow min-w-0">
                                        <div className="space-y-1 w-full">
                                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
                                                Максим Сидоренко
                                            </h3>
                                            <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-bold text-accent truncate">
                                                Енергопрактик
                                            </p>
                                        </div>
                                        
                                        <p className="text-[0.8rem] sm:text-[0.85rem] text-muted-foreground mt-2 line-clamp-2 leading-snug flex-grow">
                                            Працюю з відновленням внутрішнього балансу, стану і ясності через практики, живу присутність та індивідуальну взаємодію.
                                        </p>

                                        <div className="mt-3 sm:mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
                                            <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-foreground">
                                                <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                                                4.9
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-medium text-muted-foreground uppercase tracking-wider bg-muted/30 px-2 py-1 rounded-md border border-border/30">
                                                <History className="w-3 h-3 opacity-70" />
                                                140+ сесій
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>



                {/* 9. CTA #2 */}
                <section className="pb-20 bg-card">
                    <div className="container mx-auto px-4 text-center">
                        <Button variant="outline" size="lg" onClick={() => setAuthModalOpen(true)}>Відкрити доступ до платформи</Button>
                    </div>
                </section>

                {/* 3. SECTION “Чому людям це потрібно” */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Коли потрібна не випадкова думка, а справжня ясність
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {whyNeedItItems.map((item, index) => (
                            <Card key={index} className="text-center border-none shadow-none">
                                <CardContent className="p-6">
                                <div className="inline-flex items-center justify-center bg-card rounded-full p-3 mb-4">
                                    <item.icon className="h-8 w-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.text}</p>
                                </CardContent>
                            </Card>
                            ))}
                        </div>
                    </div>
                </section>


                {/* 11. FAQ SECTION */}
                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                            Поширені запитання
                        </h2>
                        {isLoadingFaq ? (
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ) : (
                            <Accordion type="single" collapsible className="w-full">
                                {faqItems.map((faq) => (
                                <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                                    <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                                    {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                    {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </section>

                {/* 12. FINAL CTA SECTION */}
                <section className="py-20 md:py-28 bg-background">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Зареєструйтесь, щоб перейти від пошуку до справжньої взаємодії
                        </h2>
                        <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-8">
                        Відкрийте доступ до експертів, живих відповідей і простору, де знання стають особистою цінністю.
                        </p>
                        <Button size="lg" onClick={() => setAuthModalOpen(true)}>Створити акаунт</Button>
                    </div>
                </section>
            </main>
            <Footer />
            <DialogContent>
                <AuthModal setOpen={setAuthModalOpen} />
            </DialogContent>
            <FloatingStatusLink docId="communityHeroMedia" />
        </Dialog>
    );
}
