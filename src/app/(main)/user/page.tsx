
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
  Calendar
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
    { step: 4, title: 'Розпочніть взаємодію', text: 'Оберіть той формат спілкування, який підходить саме вам.' },
    { step: 5, title: 'Отримайте персональну цінність', text: 'Від живої розмови до матеріалів і нових інсайтів — усе будується навколо вашого реального запиту.' },
];

const interactionFormats = [
    { icon: Users, title: 'Живі консультації', text: 'Прямий контакт із експертом у форматі живої взаємодії.' },
    { icon: Calendar, title: 'Заплановані сесії', text: 'Зустрічі у визначений час для глибшої, зосередженої роботи.' },
    { icon: PenSquare, title: 'Текстова взаємодія', text: 'Формат для тих, кому зручніше ставити запити й отримувати відповіді письмово.' },
    { icon: File, title: 'Матеріали та файли', text: 'Отримуйте додаткові рекомендації, розбори та інші корисні матеріали.' },
    { icon: BookOpen, title: 'Цифровий контент', text: 'Досліджуйте корисні продукти й матеріали, створені експертами платформи.' },
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
        <>
            <main className="flex flex-col w-full min-h-screen bg-background text-foreground">
                <Navigation />

                {/* 1. HERO SECTION */}
                <PageHero 
                    pageId="community"
                    fallbackHeadline="Знайдіть ясність у змістовній розмові"
                    fallbackSubheadline="LECTOR — це безпечний простір, де ви можете отримати персональну консультацію, новий погляд на ситуацію та живу взаємодію з перевіреними експертами, практиками й провідниками з усього світу."
                    fallbackButtonLabel="Зареєструватися"
                    fallbackButtonLink="/"
                />

                {/* 2. SECTION “Що таке LECTOR” */}
                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                           Що таке LECTOR і для кого він створений
                        </h2>
                        <p className="text-lg text-muted-foreground">
                           LECTOR — це курована екосистема, де люди знаходять не просто інформацію, а живу, змістовну взаємодію з перевіреними експертами. Це простір для тих, хто шукає персональні відповіді, підтримку в періоди змін або глибше розуміння власного шляху, і цінує безпечний, конфіденційний та професійний підхід.
                        </p>
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

                {/* 4. SECTION “Що ви отримуєте після реєстрації” */}
                <section className="py-20 bg-card">
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
                
                {/* 5. SECTION “Як це працює” */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                            Як це працює
                        </h2>
                        <div className="relative max-w-5xl mx-auto flex flex-col gap-12">
                            <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-border md:block" />
                            {howItWorksSteps.map((item) => (
                            <div key={item.step} className="relative flex items-start gap-6 pl-12 md:pl-16">
                                <div className="absolute left-0 top-1.5 flex h-12 w-12 items-center justify-center rounded-full bg-card border shadow-sm">
                                    <span className="text-xl font-bold text-accent">{item.step}</span>
                                </div>
                                <div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground max-w-2xl">{item.text}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* 6. CTA #1 */}
                <section className="pb-20 bg-background">
                    <div className="container mx-auto px-4 text-center">
                        <Button size="lg">Створити акаунт і почати</Button>
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
                            <Card key={index} className="shadow-sm hover:shadow-lg transition-shadow">
                                <CardHeader className="flex-row items-center gap-4 space-y-0">
                                    <div className="bg-background p-2 rounded-lg">
                                        <format.icon className="h-6 w-6 text-accent" />
                                    </div>
                                    <CardTitle className="text-lg">{format.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{format.text}</p>
                                </CardContent>
                            </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* NEW EXPERTS BLOCK */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Знайдіть свого експерта
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                На платформі ви знаходите не випадкові сторінки, а людей, чий підхід, стиль і спосіб взаємодії можуть по-справжньому відгукнутися саме вам. Це допомагає обирати не навмання, а з більшою довірою і ясністю.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <Card className="text-center shadow-md hover:shadow-xl transition-shadow">
                                <CardContent className="p-8">
                                    <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-border">
                                    <AvatarImage src="https://picsum.photos/seed/alina/150" />
                                    <AvatarFallback>AZ</AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-xl font-bold">Alina Zoryana</h3>
                                    <p className="text-sm text-accent font-medium mb-2">Таролог, Астролог</p>
                                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold">4.9</span>
                                        <span>·</span>
                                        <span>120+ сесій</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                    Допомагаю знаходити відповіді через Таро та астрологію. Працюю з темами стосунків, внутрішніх змін і життєвих циклів.
                                    </p>
                                </CardContent>
                            </Card>
                             <Card className="text-center shadow-md hover:shadow-xl transition-shadow">
                                <CardContent className="p-8">
                                    <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-border">
                                    <AvatarImage src="https://picsum.photos/seed/irina/150" />
                                    <AvatarFallback>ІВ</AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-xl font-bold">Ірина Вогник</h3>
                                    <p className="text-sm text-accent font-medium mb-2">Нумеролог</p>
                                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold">4.8</span>
                                        <span>·</span>
                                        <span>90+ сесій</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                    Допомагаю побачити сильні сторони, внутрішні сценарії та напрям розвитку через аналіз чисел і персональні розбори.
                                    </p>
                                </CardContent>
                            </Card>
                             <Card className="text-center shadow-md hover:shadow-xl transition-shadow">
                                <CardContent className="p-8">
                                    <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-border">
                                    <AvatarImage src="https://picsum.photos/seed/maksym/150" />
                                    <AvatarFallback>МС</AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-xl font-bold">Максим Сидоренко</h3>
                                    <p className="text-sm text-accent font-medium mb-2">Енергопрактик, Провідник медитацій</p>
                                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold">4.9</span>
                                        <span>·</span>
                                        <span>140+ сесій</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                    Працюю з відновленням внутрішнього балансу, стану і ясності через практики, живу присутність та індивідуальну взаємодію.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* 8. SECTION “Чому це краще...” */}
                <section className="py-20 bg-card">
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

                {/* 9. CTA #2 */}
                <section className="pb-20 bg-card">
                    <div className="container mx-auto px-4 text-center">
                        <Button variant="outline" size="lg">Відкрити доступ до платформи</Button>
                    </div>
                </section>


                {/* 10. SECTION “Для яких ситуацій...” */}
                <section className="py-20 bg-background">
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
                        <Button size="lg">Створити акаунт</Button>
                    </div>
                </section>
            </main>
            <Footer />
            <FloatingStatusLink docId="communityHeroMedia" />
        </>
    );
}
