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
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronsUp,
  CircleDollarSign,
  File,
  Globe,
  Handshake,
  Layers,
  Megaphone,
  MessageSquare,
  Package,
  PenSquare,
  Repeat,
  Rocket,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  Video,
  Wallet
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
        icon: Repeat,
        title: 'Один акаунт — дві ролі',
        text: 'Ваш профіль дає можливість бути і професіоналом, і замовником, досліджуючи платформу з обох боків.',
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
    { icon: Calendar, title: 'Гнучкий календар', text: 'Створюйте сесії та події у зручний для вас час, керуючи власним календарем.' },
    { icon: Users, title: 'Групові події', text: 'Створення тематичних зустрічей, подій або форматів для кількох учасників.' },
    { icon: MessageSquare, title: 'Текстова взаємодія', text: 'Формат для тих, хто працює через текст, короткі відповіді або асинхронний контакт.' },
    { icon: File, title: 'Обмін файлами', text: 'Можливість передавати матеріали, розбори, рекомендації чи персональні файли.' },
    { icon: Package, title: 'Цифрові продукти', text: 'Продаж авторських матеріалів, гідів, файлів, практик або інших цифрових форматів.' },
];

const growthBenefits = [
    {
        icon: TrendingUp,
        title: 'Видимість у категорії',
        text: 'Зростайте у своїй ніші завдяки активності, якості взаємодії та довірі користувачів.',
    },
    {
        icon: Award,
        title: 'Репутація, яка працює на вас',
        text: 'Ваш шлях у платформі формує репутаційну вагу, що підсилює довіру і вибір на вашу користь.',
    },
    {
        icon: ChevronsUp,
        title: 'Бути серед тих, кого обирають першими',
        text: 'Професіонал може не просто бути присутнім, а рухатися до сильної позиції у своїй категорії.',
    },
    {
        icon: Activity,
        title: 'Екосистема, що стимулює розвиток',
        text: 'Активність, стабільна присутність і якісний сервіс перетворюються на відчутне зростання всередині платформи.',
    },
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
    { icon: Video, title: 'Консультації', text: 'Персональна взаємодія з клієнтами у вибраному форматі.' },
    { icon: Globe, title: 'Глобальний дохід', text: 'Доступ до міжнародної аудиторії підвищує попит і потенціал вашого чека.' },
    { icon: Package, title: 'Цифрові продукти', text: 'Продаж авторських матеріалів і цифрового контенту.' },
    { icon: Wallet, title: 'Зручний вивід коштів', text: 'Легко керуйте своїми заробітками та виводьте кошти у зручний для вас спосіб.' },
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

const professionals = [
    {
        avatar: 'https://picsum.photos/seed/expert2/200',
        name: 'Олена Коваль',
        specialization: 'Таролог, Астропсихолог',
        description: 'Допомагаю знайти ясність у стосунках і кар’єрі через глибокий аналіз карт та натальної карти.',
    },
    {
        avatar: 'https://picsum.photos/seed/expert3/200',
        name: 'Максим Сидоренко',
        specialization: 'Енергопрактик, Провідник медитацій',
        description: 'Працюю з енергетичним полем для відновлення балансу та гармонії. Проводжу індивідуальні та групові сесії.',
    },
    {
        avatar: 'https://picsum.photos/seed/expert4/200',
        name: 'Ірина Вогник',
        specialization: 'Нумеролог',
        description: 'Розкриваю потенціал особистості через аналіз чисел. Складаю персональні прогнози та матриці долі.',
    },
    {
        avatar: 'https://picsum.photos/seed/expert5/200',
        name: 'Сергій Ткач',
        specialization: 'Духовний наставник',
        description: 'Супроводжую на шляху особистісного зростання, допомагаю знайти відповіді на глибокі життєві питання.',
    },
    {
        avatar: 'https://picsum.photos/seed/expert6/200',
        name: 'Анна Лисенко',
        specialization: 'Human Design',
        description: 'Читаю бодіграфи, допомагаю зрозуміти свою унікальну природу та стратегію прийняття рішень.',
    },
];


export default function ProPage() {
  return (
    <>
      <main className="flex flex-col w-full min-h-screen bg-background text-foreground">
        <Navigation />
        
        {/* 1. HERO SECTION */}
        <section className="py-20 md:py-32 text-center bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-backgroundAlt/50">
             <div className="absolute h-full w-full bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-30"></div>
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
                <Card key={index} className="text-center border-none shadow-none bg-transparent">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center bg-card rounded-full p-3 mb-4 border">
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
                <Card key={index} className="shadow-sm hover:shadow-lg transition-shadow bg-card/50">
                  <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                      <div className="bg-background p-2 rounded-lg border">
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

        {/* 6. SECTION: Know Your Customer */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Знай свого замовника
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Платформа допомагає бачити не лише запит, а й контекст людини, з якою ви починаєте взаємодію, посилюючи довіру та усвідомленість рішень.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <p className="text-md font-medium">Рейтинг замовника, що формується на основі взаємодій.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <p className="text-md font-medium">Кількість завершених сесій та історія активності.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <p className="text-md font-medium">Відгуки, залишені іншими професіоналами.</p>
                  </div>
                </div>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm border">
                <CardTitle className="mb-4 text-xl">Профіль Замовника</CardTitle>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://picsum.photos/seed/client1/100" />
                    <AvatarFallback>ІК</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">Ірина Коваленко</h4>
                    <p className="text-sm text-muted-foreground">Учасник спільноти з 2024</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-card p-3 rounded-md border">
                    <p className="text-muted-foreground text-xs">Рейтинг</p>
                    <div className="flex items-center gap-1 font-bold text-lg">
                      <Star className="w-5 h-5 text-accent fill-accent" />
                      4.9
                    </div>
                  </div>
                  <div className="bg-card p-3 rounded-md border">
                    <p className="text-muted-foreground text-xs">Завершено сесій</p>
                    <p className="font-bold text-lg">14</p>
                  </div>
                </div>
                <div className="mt-4">
                    <h5 className="font-semibold mb-2 text-sm">Основні інтереси:</h5>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">астрологія</Badge>
                        <Badge variant="outline">Human Design</Badge>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. SECTION: Visibility & Growth */}
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ставайте помітними у своїй ніші
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Платформа враховує активність, якість взаємодії, довіру та результати, формуючи видимість професіонала всередині екосистеми. Це створює простір не лише для монетизації, а й для реального зростання статусу та імені.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {growthBenefits.map((benefit, index) => (
                        <Card key={index} className="text-center border-none shadow-none bg-transparent">
                            <CardContent className="p-6">
                                <div className="inline-flex items-center justify-center bg-card rounded-full p-3 mb-4 border">
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


        {/* 8. SECTION “Чому це більше, ніж робота через соцмережі...” */}
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

        {/* 9. SECTION: Profile Mockup & Personal Brand */}
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
                        <Avatar className="h-24 w-24 border-4 border-card shadow-md">
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
                        <Badge variant="outline">Таро</Badge>
                        <Badge variant="outline">Астрологія</Badge>
                        <Badge variant="outline">Нумерологія</Badge>
                        <Badge variant="outline">Стосунки</Badge>
                        <Badge variant="outline">Карти долі</Badge>
                    </div>
                </div>
                <div className="mt-8 border-t border-border pt-6">
                     <Button className="w-full" size="lg">Замовити консультацію</Button>
                </div>
            </div>
          </div>
        </section>

        {/* 10. Professionals Showcase */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Професіонали, які вже з нами
              </h2>
              <p className="text-lg text-muted-foreground">
                Платформа вже об’єднує людей, які працюють через знання, досвід, інтуїцію й особисту практику. Тут формується жива екосистема експертів і провідників з різних напрямів.
              </p>
            </div>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent className="-ml-4">
                {professionals.map((pro, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="h-full flex flex-col items-center text-center p-8 bg-background border-border shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <Avatar className="h-20 w-20 mb-4 border-2 border-border">
                          <AvatarImage src={pro.avatar} alt={pro.name} />
                          <AvatarFallback>{pro.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold text-foreground mb-1">{pro.name}</h3>
                        <p className="text-sm font-medium text-accent mb-4">{pro.specialization}</p>
                        <p className="text-sm text-muted-foreground text-center flex-grow">
                          {pro.description}
                        </p>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex left-[-50px]" />
              <CarouselNext className="hidden sm:flex right-[-50px]" />
            </Carousel>
          </div>
        </section>

        {/* 11. SECTION “Монетизація” */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Кілька шляхів монетизації в одній екосистемі
              </h2>
              <p className="text-lg text-muted-foreground">
                Доступ до глобальної аудиторії підвищує попит, а гнучкі інструменти дозволяють легко перетворювати свою цінність на дохід.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {monetizationPaths.map((path, index) => (
                <Card key={index} className="shadow-sm hover:shadow-lg transition-shadow bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                       <div className="bg-background p-2 rounded-lg border">
                          <path.icon className="h-6 w-6 text-accent" />
                       </div>
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

        {/* 12. FAQ SECTION */}
        <section className="py-20 bg-card">
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

        {/* 13. FINAL CTA SECTION */}
        <section className="py-20 md:py-28 bg-background">
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

    
