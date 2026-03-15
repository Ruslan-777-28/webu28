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
  ChevronRight,
  CircleDollarSign,
  File,
  Globe,
  Layers,
  Megaphone,
  MessageSquare,
  Package,
  Rocket,
  Star,
  Users,
  Video,
  Calendar,
  Zap
} from 'lucide-react';
import React from 'react';
import Footer from '@/components/layout/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const forYouItems = [
    'астролог',
    'таролог',
    'нумеролог',
    'духовний наставник',
    'практик енергетичних або інтуїтивних методик',
    'медитативний або духовний провідник',
    'консультант, який працює через знання, досвід і особисту практику',
    'автор цифрових матеріалів у своїй ніші',
];

const benefits = [
    {
        icon: Globe,
        title: 'Глобальна аудиторія',
        text: 'Працюйте з людьми з різних країн і відкривайте свої знання для ширшого світу.',
    },
    {
        icon: Layers,
        title: 'Гнучкий формат роботи',
        text: 'Обирайте той спосіб взаємодії, який підходить саме вам: консультації, події, повідомлення, цифрові продукти.',
    },
    {
        icon: CircleDollarSign,
        title: 'Монетизація знань',
        text: 'Перетворюйте досвід, інтуїцію та експертність на реальну й зрозумілу цінність для клієнта.',
    },
    {
        icon: Star,
        title: 'Особистий бренд',
        text: 'Створюйте професійний профіль, формуйте довіру й вибудовуйте власну присутність у платформі.',
    },
    {
        icon: Megaphone,
        title: 'Контент і публічність',
        text: 'Діліться думками, матеріалами й сенсами, щоб вас знаходили не випадково, а усвідомлено.',
    },
    {
        icon: Rocket,
        title: 'Простий старт',
        text: 'Почніть з того формату, який для вас природний, і розвивайте свою модель роботи поступово.',
    },
];

const howItWorksSteps = [
    {
        step: 1,
        title: 'Створіть профіль',
        text: 'Додайте інформацію про себе, свій напрям, стиль роботи й ту цінність, яку ви даєте людям.',
    },
    {
        step: 2,
        title: 'Оформіть свої пропозиції',
        text: 'Вкажіть, які консультації, формати взаємодії або цифрові продукти ви хочете пропонувати.',
    },
    {
        step: 3,
        title: 'Станьте видимими для аудиторії',
        text: 'Ваш профіль, категорії, контент і присутність у платформі допомагають клієнтам знаходити вас за конкретним запитом.',
    },
    {
        step: 4,
        title: 'Проводьте взаємодію у зручному форматі',
        text: 'Відео, повідомлення, файли, події чи цифрові продукти — залежно від того, як ви хочете працювати.',
    },
    {
        step: 5,
        title: 'Монетизуйте свою цінність',
        text: 'Отримуйте дохід завдяки змістовній взаємодії, де ваш досвід і знання стають реальною користю для іншої людини.',
    },
];

const workFormats = [
    { icon: Video, title: 'Онлайн консультації', text: 'Живе спілкування у зручному форматі для персональної взаємодії.' },
    { icon: Calendar, title: 'Заплановані сесії', text: 'Робота за попереднім записом і у визначений час.' },
    { icon: Users, title: 'Групові події', text: 'Створення тематичних зустрічей, подій або форматів для кількох учасників.' },
    { icon: MessageSquare, title: 'Повідомлення та текстова взаємодія', text: 'Формат для тих, хто працює через текст, короткі відповіді або асинхронний контакт.' },
    { icon: File, title: 'Обмін файлами', text: 'Можливість передавати матеріали, розбори, рекомендації чи персональні файли.' },
    { icon: Package, title: 'Цифрові продукти', text: 'Продаж авторських матеріалів, гідів, файлів, практик або інших цифрових форматів.' },
];

const comparisonPoints = [
    'Профіль, контент і взаємодія в одному місці',
    'Не потрібно збирати все вручну між месенджерами та соцмережами',
    'Легше будувати довіру і професійну подачу',
    'Легше масштабувати свою практику',
    'Зручніше працювати з міжнародною аудиторією',
    'Менше хаосу, більше структури',
];

const brandPoints = ['профіль', 'публікації', 'цифрові матеріали', 'публічна подача', 'розвиток власного стилю'];

const monetizationPaths = [
    { title: 'Консультації', text: 'Персональна взаємодія з клієнтами у вибраному форматі.' },
    { title: 'Комунікаційні пропозиції', text: 'Окремі формати роботи, які ви оформлюєте як власні офери.' },
    { title: 'Цифрові продукти', text: 'Продаж авторських матеріалів і цифрового контенту.' },
    { title: 'Повторні звернення', text: 'Формування довшої взаємодії та власної мікроекосистеми навколо вашої практики.' },
];

const faqItems = [
    {
        question: 'Хто може стати професіоналом на платформі?',
        answer: 'Платформа відкрита для експертів, практиків і провідників, чия цінність ґрунтується на знаннях, досвіді, особистій практиці та змістовній взаємодії з людьми.',
    },
    {
        question: 'Чи обов’язково мати велику аудиторію, щоб почати?',
        answer: 'Ні. Платформа створена не лише для тих, хто вже має велику видимість, а й для тих, хто хоче професійно оформити свою присутність і поступово зростати.',
    },
    {
        question: 'У яких форматах я зможу працювати?',
        answer: 'Ви зможете обирати різні моделі взаємодії: консультації, події, текстове спілкування, обмін файлами та цифрові продукти.',
    },
    {
        question: 'Чи можна працювати з міжнародною аудиторією?',
        answer: 'Так. Платформа задумана як глобальний простір без географічних обмежень і з перспективою глибшої міжнародної взаємодії.',
    },
    {
        question: 'Чи можу я продавати свої цифрові матеріали?',
        answer: 'Так. Платформа передбачає можливість пропонувати й продавати цифрові продукти як окрему частину вашої експертної присутності.',
    },
    {
        question: 'Чи можна поєднувати різні формати роботи?',
        answer: 'Так. Ви не обмежені одним сценарієм і можете будувати власну модель взаємодії відповідно до свого стилю й напряму.',
    },
];

export default function ProPage() {
  return (
    <>
      <main className="flex flex-col w-full min-h-screen bg-background text-foreground">
        <Navigation />
        
        {/* 1. HERO SECTION */}
        <section className="py-20 md:py-32 text-center bg-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute h-full w-full bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>
          <div className="container mx-auto px-4 relative">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Монетизуйте свої знання без кордонів
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
              Створюйте власні пропозиції, консультуйте клієнтів з усього світу та перетворюйте досвід, інтуїцію й експертність на реальний дохід у зручному для вас форматі.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg">Стати професіоналом</Button>
              <Button size="lg" variant="outline">
                Подивитися, як це працює
              </Button>
            </div>
          </div>
        </section>

        {/* 2. SECTION “Це для вас, якщо ви...” */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Це для вас, якщо ви...
            </h2>
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {forYouItems.map((item, index) => (
                <Card key={index} className="bg-background shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="font-medium text-sm">{item}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 3. SECTION “Що ви отримуєте на платформі” */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Що ви отримуєте на платформі
              </h2>
              <p className="text-lg text-muted-foreground">
                Все, що потрібно для того, щоб оформити свою цінність, вийти на аудиторію та перетворити знання на системну практику й дохід.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center border-none shadow-none">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center bg-card rounded-full p-3 mb-4">
                      <benefit.icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* 4. SECTION “Як це працює” */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Як це працює
            </h2>
            <div className="relative max-w-5xl mx-auto flex flex-col gap-12">
              <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-border md:block" />
              {howItWorksSteps.map((item) => (
                <div key={item.step} className="relative flex items-start gap-6 pl-12 md:pl-16">
                  <div className="absolute left-0 top-1.5 flex h-12 w-12 items-center justify-center rounded-full bg-background border shadow-sm">
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
        
        {/* 5. SECTION “Формати роботи” */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Формати роботи на платформі
              </h2>
              <p className="text-lg text-muted-foreground">
                Ви самі обираєте, як саме будувати взаємодію з клієнтами та аудиторією.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workFormats.map((format, index) => (
                <Card key={index} className="shadow-sm hover:shadow-lg transition-shadow">
                  <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                      <div className="bg-card p-2 rounded-lg">
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

        {/* 6. SECTION “Чому це більше, ніж робота через соцмережі...” */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Більше, ніж хаотична робота через соцмережі
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Платформа допомагає зібрати вашу присутність, взаємодію та цінність в одному місці.
                </p>
                <p className="text-md">
                  Замість розрізнених каналів, випадкових повідомлень і хаотичної присутності в різних сервісах ви отримуєте простір, де профіль, формати взаємодії, публічність і монетизація поєднані в одну зрозумілу систему. Це допомагає виглядати професійніше, працювати спокійніше й вибудовувати довшу довіру з аудиторією.
                </p>
              </div>
              <div className="bg-background p-8 rounded-lg shadow-sm border space-y-4">
                {comparisonPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <p className="text-md font-medium">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. SECTION: Profile Mockup & Personal Brand */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Так вас бачитимуть користувачі платформи
              </h2>
              <p className="text-lg text-muted-foreground">
                Ваш профіль — це не просто сторінка, а професійна подача вашої експертності, стилю, напрямів роботи та формату взаємодії.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                    <div className="flex-shrink-0">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                            <AvatarImage src="https://picsum.photos/seed/expert1/200" alt="Alina Zoryana"/>
                            <AvatarFallback>AZ</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-foreground">Alina Zoryana</h3>
                        <p className="text-muted-foreground mt-1">Допомагаю знайти відповіді через Таро та астрологію. 10+ років практики.</p>
                        <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Globe className="h-4 w-4" />
                                Українська, English
                            </span>
                            <span className="text-border">|</span>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <span>Online</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="font-semibold text-foreground mb-3">Напрямки:</h4>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Таро</Badge>
                        <Badge variant="secondary">Астрологія</Badge>
                        <Badge variant="secondary">Нумерологія</Badge>
                        <Badge variant="secondary">Стосунки</Badge>
                        <Badge variant="secondary">Карти долі</Badge>
                    </div>
                </div>
                <div className="mt-8 border-t border-border pt-6">
                     <Button className="w-full" size="lg">Замовити консультацію</Button>
                </div>
            </div>
          </div>
        </section>

        {/* 8. SECTION “Монетизація” */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Кілька шляхів монетизації в одній екосистемі
              </h2>
              <p className="text-lg text-muted-foreground">
                Платформа підтримує не один спосіб заробітку, а кілька моделей, які можна поєднувати між собою.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {monetizationPaths.map((path, index) => (
                <Card key={index} className="shadow-sm hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-accent" />
                      {path.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{path.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FAQ SECTION */}
        <section className="py-20 bg-background">
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
        <section className="py-20 md:py-28 bg-card">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ваші знання вже мають цінність
            </h2>
            <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-8">
              Дайте їм простір, аудиторію та правильний формат монетизації.
            </p>
            <Button size="lg">Приєднатися як професіонал</Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
