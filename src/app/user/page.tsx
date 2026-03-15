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
import React from 'react';

const whyNeedItItems = [
    {
        icon: MessageSquare,
        title: 'Важливі питання',
        text: 'Стосунки, особисті рішення, внутрішні зміни, життєві цикли та моменти невизначеності часто потребують не шуму, а глибшого погляду.',
    },
    {
        icon: Handshake,
        title: 'Персональна взаємодія',
        text: 'Замість загальних порад ви отримуєте увагу до вашої ситуації, вашого запиту і вашого контексту.',
    },
    {
        icon: Eye,
        title: 'Новий погляд',
        text: 'Розмова з правильною людиною допомагає побачити більше, відчути спокійніше і зрозуміти напрямок ясніше.',
    },
    {
        icon: Star,
        title: 'Доступ до експертів',
        text: 'В одному просторі зібрані люди, які працюють через знання, досвід, практику та особисту глибину.',
    },
     {
        icon: Sparkles,
        title: 'Менше хаосу',
        text: 'Не потрібно шукати між десятками розрізнених сторінок, каналів і випадкових рекомендацій.',
    },
    {
        icon: Heart,
        title: 'Більше змісту',
        text: 'Платформа допомагає перейти від безкінечного перегляду до осмисленої взаємодії.',
    },
];

const registrationBenefits = [
    { icon: Search, title: 'Доступ до експертів', text: 'Знаходьте фахівців і практиків, які відповідають саме вашому запиту.' },
    { icon: Handshake, title: 'Персональні консультації', text: 'Отримуйте не загальні слова, а живу взаємодію, побудовану навколо вашої ситуації.' },
    { icon: MessageSquare, title: 'Зручні формати спілкування', text: 'Обирайте той спосіб взаємодії, який підходить саме вам.' },
    { icon: BookOpen, title: 'Контент і матеріали', text: 'Читайте, досліджуйте й зберігайте корисний зміст у межах однієї екосистеми.' },
    { icon: Star, title: 'Обрані люди й напрямки', text: 'Формуйте власний простір інтересів, експертів і матеріалів.' },
    { icon: Users, title: 'Довша взаємодія', text: 'Повертавайтеся до тих, хто вже допоміг вам побачити більше й відчути ясніше.' },
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

const faqItems = [
    {
        question: 'Для кого створена платформа?',
        answer: 'Для людей, які шукають не випадкові поради, а глибшу, персональну й змістовну взаємодію з експертами, практиками та провідниками.',
    },
    {
        question: 'Чи потрібно одразу знати, кого саме я шукаю?',
        answer: 'Ні. Платформа якраз і допомагає дослідити напрямки, профілі та зміст, щоб поступово знайти того, хто підходить саме вам.',
    },
    {
        question: 'Чи можу я обрати зручний формат спілкування?',
        answer: 'Так. Платформа підтримує різні сценарії взаємодії, щоб кожен користувач міг знайти комфортний для себе формат.',
    },
    {
        question: 'Чи підходить це для міжнародної аудиторії?',
        answer: 'Так. Платформа задумана як глобальний простір без географічних обмежень і з фокусом на доступність взаємодії.',
    },
    {
        question: 'Чому варто зареєструватися?',
        answer: 'Реєстрація відкриває доступ до повного функціоналу платформи: профілів, взаємодії, персональних форматів, матеріалів і подальшої екосистеми користування.',
    },
    {
        question: 'Чим це відрізняється від звичайного перегляду контенту?',
        answer: 'Тут ідеться не лише про споживання інформації, а про особисту взаємодію, реальні запити, змістовний контакт і персональну цінність.',
    },
];

export default function CommunityPage() {
    return (
        <main className="flex flex-col w-full min-h-screen bg-background text-foreground">
            <Navigation />

            {/* 1. HERO SECTION */}
            <section className="py-20 md:py-32 text-center bg-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>
                <div className="container mx-auto px-4 relative">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Знайдіть відповіді, які справді мають значення
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
                        Отримуйте персональні консультації, глибші інсайти та живу взаємодію з експертами, практиками й провідниками з усього світу — без мовних і географічних бар’єрів.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button size="lg">Зареєструватися</Button>
                        <Button size="lg" variant="outline">
                            Дослідити платформу
                        </Button>
                    </div>
                </div>
            </section>

            {/* 2. SECTION “Що тут відбувається” */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                     <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Що таке LECTOR
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        LECTOR — це простір, де люди знаходять не випадковий контент, а живу взаємодію з тими, чия цінність ґрунтується на знаннях, досвіді, інтуїції та особистій практиці. Тут можна звернутися із власним запитом, знайти експерта під конкретну ситуацію, отримати нове бачення і пройти шлях до ясності через змістовну розмову, матеріали або інші формати взаємодії.
                    </p>
                </div>
            </section>

             {/* 3. SECTION “Чому людям це потрібно” */}
            <section className="py-20 bg-white">
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
                            <div className="inline-flex items-center justify-center bg-muted/50 rounded-full p-3 mb-4">
                                <item.icon className="h-8 w-8 text-primary" />
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
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Що відкриває реєстрація
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Реєстрація — це не формальність, а вхід у повну екосистему взаємодії.
                        </p>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {registrationBenefits.map((item, index) => (
                        <Card key={index} className="shadow-sm hover:shadow-lg transition-shadow">
                            <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                                <div className="bg-muted/50 p-2 rounded-lg">
                                    <item.icon className="h-6 w-6 text-primary" />
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
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Як це працює
                    </h2>
                    <div className="relative max-w-5xl mx-auto flex flex-col gap-12">
                        <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-border md:block" />
                        {howItWorksSteps.map((item) => (
                        <div key={item.step} className="relative flex items-start gap-6 pl-12 md:pl-16">
                            <div className="absolute left-0 top-1.5 flex h-12 w-12 items-center justify-center rounded-full bg-background border shadow-sm">
                                <span className="text-xl font-bold text-primary">{item.step}</span>
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
            
            {/* 6. SECTION “Формати взаємодії” */}
            <section className="py-20 bg-muted/30">
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
                                <div className="bg-muted/50 p-2 rounded-lg">
                                    <format.icon className="h-6 w-6 text-primary" />
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

            {/* 7. SECTION “Чому це краще...” */}
             <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Більше, ніж нескінченний пошук у соцмережах
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Платформа збирає людей, зміст і взаємодію в один зрозумілий простір.
                        </p>
                        <p className="text-md">
                           Замість випадкових сторінок, розрізнених порад, нескінченних повідомлень і хаотичного пошуку ви отримуєте простір, де можна зрозуміло знайти напрям, експерта, формат взаємодії та потрібний зміст. Це допомагає рухатися спокійніше, точніше і з більшою довірою до того, що ви обираєте.
                        </p>
                        </div>
                        <div className="bg-card p-8 rounded-lg shadow-sm border space-y-4">
                             <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                <p className="text-md font-medium">не потрібно шукати все вручну</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                <p className="text-md font-medium">профілі, категорії й контент зібрані в одному місці</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                <p className="text-md font-medium">легше знайти людину під свій запит</p>
                            </div>
                             <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                <p className="text-md font-medium">менше шуму, більше сенсу</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                <p className="text-md font-medium">зручніша й цілісніша взаємодія</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* 8. SECTION “Для яких ситуацій...” */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Коли платформа може бути особливо корисною
                    </h2>
                    <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {useCases.map((item, index) => (
                        <Card key={index} className="bg-background/70 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="font-medium text-sm">{item}</span>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* 9. FAQ SECTION */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    Поширені запитання
                </h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                        {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                        {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                    ))}
                </Accordion>
                </div>
            </section>

            {/* 10. FINAL CTA SECTION */}
            <section className="py-20 md:py-28 bg-muted/30">
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
    );
}
    