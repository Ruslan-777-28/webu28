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
    LifeBuoy,
    Megaphone,
    MessageSquare,
    Package,
    PenSquare,
    Repeat,
    Rocket,
    Scale,
    ShieldCheck,
    Star,
    TrendingUp,
    Users,
    Video,
    Wallet
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Footer from '@/components/layout/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { collection, doc, getDoc, getDocs, orderBy, query, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { FaqItem, ProHowUsersSeeYouBlock, ProKnowYourCustomerBlock, ProProfessionalItem, ProProfessionalsBlock } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AuthModal } from '@/components/auth-modal';
import { PageHero } from '@/components/page-hero';
import { FloatingStatusLink } from '@/components/floating-status-link';

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
        title: 'Вихід на глобальну сцену',
        text: 'Працюйте з людьми з різних країн і відкривайте свої знання для ширшого світу, без мовних бар’єрів.',
    },
    {
        icon: Layers,
        title: 'Гнучкий формат роботи',
        text: 'Обирайте той спосіб взаємодії, який підходить саме вам: консультації, події, повідомлення, цифрові продукти.',
    },
    {
        icon: CircleDollarSign,
        title: 'Преміальний дохід',
        text: 'Перетворюйте досвід, інтуїцію та експертність на реальну й зрозумілу цінність для клієнта.',
    },
    {
        icon: Star,
        title: 'Професійний бренд',
        text: 'Створюйте потужний профіль, формуйте довіру й вибудовуйте власну репутаційну вагу в платформі.',
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
    { icon: Package, title: 'Цифрові продукти', text: 'Продаж авторських матеріалів, гідів, практик або інших цифрових форматів.' },
];

const safetyAndSupportItems = [
    {
        icon: ShieldCheck,
        title: 'Безпека та конфіденційність',
        text: 'Ваші дані та взаємодія з клієнтами захищені. Ми гарантуємо конфіденційність і безпеку платежів.',
    },
    {
        icon: LifeBuoy,
        title: 'Підтримка на кожному кроці',
        text: 'Наша команда готова допомогти вам з будь-якими технічними чи організаційними питаннями.',
    },
    {
        icon: Scale,
        title: 'Прозорі та чесні правила',
        text: 'Ми беремо лише невелику комісію з успішних транзакцій. Жодних прихованих платежів або складних умов.',
    },
];

const growthBenefits = [
    {
        icon: TrendingUp,
        title: 'Видимість у категорії',
        text: 'Зростайте у своїй ніші завдяки активності, якості взаємодії та довірі користувачів. LECTOR — це меритократія.',
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

const monetizationPaths = [
    { icon: Video, title: 'Консультації', text: 'Персональна взаємодія з клієнтами у вибраному форматі.' },
    { icon: Globe, title: 'Глобальний дохід', text: 'Доступ до міжнародної аудиторії підвищує попит і потенціал вашого чека.' },
    { icon: Package, title: 'Цифрові продукти', text: 'Продаж авторських матеріалів і цифрового контенту.' },
    { icon: Wallet, title: 'Зручний вивід коштів', text: 'Легко керуйте своїми заробітками та виводьте кошти у зручний для вас спосіб.' },
];

export default function ProPage() {
    const [customerBlock, setCustomerBlock] = useState<ProKnowYourCustomerBlock | null>(null);
    const [profileBlock, setProfileBlock] = useState<ProHowUsersSeeYouBlock | null>(null);
    const [professionalsBlock, setProfessionalsBlock] = useState<ProProfessionalsBlock | null>(null);
    const [professionalItems, setProfessionalItems] = useState<ProProfessionalItem[]>([]);
    const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const proPageRef = doc(db, 'sitePages', 'pro');
                const contentBlocksRef = collection(proPageRef, 'contentBlocks');

                // 1. Fetch content blocks
                const [customerSnap, profileSnap, proSnap] = await Promise.all([
                    getDoc(doc(contentBlocksRef, 'know-your-customer')),
                    getDoc(doc(contentBlocksRef, 'how-users-see-you')),
                    getDoc(doc(contentBlocksRef, 'professionals-already-with-us'))
                ]);

                if (customerSnap.exists()) setCustomerBlock(customerSnap.data() as ProKnowYourCustomerBlock);
                if (profileSnap.exists()) setProfileBlock(profileSnap.data() as ProHowUsersSeeYouBlock);
                
                if (proSnap.exists()) {
                    setProfessionalsBlock(proSnap.data() as ProProfessionalsBlock);
                    const itemsSnap = await getDocs(query(collection(proSnap.ref, 'items'), orderBy('sortOrder', 'asc')));
                    const items = itemsSnap.docs.map(d => ({ ...d.data(), id: d.id } as ProProfessionalItem));
                    setProfessionalItems(items.filter(item => item.isActive));
                }

                // 2. Fetch FAQ items
                const faqQuery = query(
                    collection(db, 'faqItems'),
                    where('isActive', '==', true),
                    where('showOnProPage', '==', true),
                    orderBy('sortOrder', 'asc'),
                    limit(5)
                );
                const faqSnap = await getDocs(faqQuery);
                const fetchedFaqs = faqSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as FaqItem));
                setFaqItems(fetchedFaqs);

            } catch (error) {
                console.error("Error fetching pro page data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
        
        const timer = setTimeout(() => setIsLoading(false), 3000); // Fail-safe loading indicator

        return () => {
            clearTimeout(timer);
        }
    }, []);

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
      <main className="flex flex-col w-full min-h-screen bg-background text-foreground">
        <Navigation />
        
        {/* 1. HERO SECTION */}
        <PageHero 
            pageId="pro"
            fallbackHeadline="Монетизуйте свою цінність без кордонів"
            fallbackSubheadline="Створюйте власні пропозиції, консультуйте клієнтів з усього світу та перетворюйте досвід, інтуїцію й експертність на преміальний дохід у зручному для вас форматі."
            fallbackButtonLabel="Приєднатися до професіоналів"
            fallbackButtonLink="/" 
        />

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

        {/* 3. SECTION “Що ви отримуєте на платформі” (Strengthened) */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Інструменти для вашого успіху та росту
              </h2>
              <p className="text-lg text-muted-foreground">
                Все, що потрібно, щоб оформити свою цінність, вийти на глобальну аудиторію та перетворити знання на системну практику й дохід.
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
        {customerBlock && customerBlock.isActive && (
            <section className="py-20 bg-card">
              <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      {customerBlock.sectionTitle}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      {customerBlock.sectionDescription}
                    </p>
                    <div className="space-y-4">
                        {customerBlock.bullets.map((bullet, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <ShieldCheck className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                                <p className="text-md font-medium">{bullet}</p>
                            </div>
                        ))}
                    </div>
                  </div>
                  <div className="bg-background p-6 rounded-lg shadow-sm border">
                    <CardTitle className="mb-4 text-xl">{customerBlock.cardTitle}</CardTitle>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={customerBlock.imageUrl || "https://picsum.photos/seed/client1/100"} alt={customerBlock.imageAlt}/>
                        <AvatarFallback>{customerBlock.cardPersonName?.slice(0,2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-lg">{customerBlock.cardPersonName}</h4>
                        <p className="text-sm text-muted-foreground">{customerBlock.cardMetaText}</p>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-card p-3 rounded-md border">
                        <p className="text-muted-foreground text-xs">Рейтинг</p>
                        <div className="flex items-center gap-1 font-bold text-lg">
                          <Star className="w-5 h-5 text-accent fill-accent" />
                          {customerBlock.cardRatingValue}
                        </div>
                      </div>
                      <div className="bg-card p-3 rounded-md border">
                        <p className="text-muted-foreground text-xs">Завершено сесій</p>
                        <p className="font-bold text-lg">{customerBlock.cardCompletedSessions}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                        <h5 className="font-semibold mb-2 text-sm">Основні інтереси:</h5>
                        <div className="flex flex-wrap gap-2">
                           {customerBlock.cardTags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        )}
        
        {/* 7. NEW BLOCK: Safety, Support & Fair Play */}
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Безпека, підтримка та прозорі правила гри
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Ми будуємо простір, заснований на довірі, де кожен учасник почувається захищеним і впевненим.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {safetyAndSupportItems.map((item, index) => (
                        <Card key={index} className="shadow-sm hover:shadow-lg transition-shadow bg-card/50 border">
                            <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                                <div className="bg-background p-2 rounded-lg border">
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

        {/* 8. SECTION: Visibility & Growth (Strengthened) */}
        <section className="py-20 bg-card">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ставайте помітними у своїй ніші
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Платформа враховує активність, якість взаємодії та довіру, формуючи репутаційну вагу професіонала всередині екосистеми. Це створює простір не лише для монетизації, а й для реального зростання статусу та імені.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {growthBenefits.map((benefit, index) => (
                        <Card key={index} className="text-center border-none shadow-none bg-transparent">
                            <CardContent className="p-6">
                                <div className="inline-flex items-center justify-center bg-background rounded-full p-3 mb-4 border">
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


        {/* 9. SECTION “Чому це більше, ніж робота через соцмережі...” (Strengthened) */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Більше, ніж хаотична робота через соцмережі
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Платформа допомагає зібрати вашу присутність, взаємодію та цінність в єдину професійну систему.
                </p>
                <p className="text-md">
                  Замість розрізнених каналів і випадкових повідомлень ви отримуєте простір, де профіль, формати взаємодії, публічність і монетизація поєднані в одну зрозумілу екосистему. Це допомагає виглядати професійніше, працювати спокійніше й вибудовувати довшу довіру з аудиторією.
                </p>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-sm border space-y-4">
                {[
                    'Профіль, контент і взаємодія в одному місці',
                    'Не потрібно збирати все вручну між месенджерами та соцмережами',
                    'Легше будувати довіру і професійну подачу',
                    'Простіше масштабувати свою практику',
                    'Зручніше працювати з міжнародною аудиторією',
                    'Менше хаосу, більше структури та статусу',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <p className="text-md font-medium">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 10. SECTION: Profile Mockup & Personal Brand */}
        {profileBlock && profileBlock.isActive && (
            <section className="py-20 bg-card">
              <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {profileBlock.sectionTitle}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {profileBlock.sectionDescription}
                  </p>
                </div>

                <div className="max-w-2xl mx-auto bg-background p-6 sm:p-8 rounded-xl shadow-lg border border-border">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                        <div className="flex-shrink-0">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                                <AvatarImage src={profileBlock.imageUrl} alt={profileBlock.imageAlt}/>
                                <AvatarFallback>{profileBlock.cardPersonName?.slice(0,2)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-foreground">{profileBlock.cardPersonName}</h3>
                            <p className="text-muted-foreground mt-1">{profileBlock.cardHeadline}</p>
                            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Globe className="h-4 w-4" />
                                    {profileBlock.cardLanguages}
                                </span>
                                <span className="text-border">|</span>
                                {profileBlock.cardStatusLabel && (
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                        </span>
                                        <span>{profileBlock.cardStatusLabel}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-semibold text-foreground mb-3">Напрямки:</h4>
                        <div className="flex flex-wrap gap-2">
                             {profileBlock.cardDirections.map(dir => <Badge key={dir} variant="outline">{dir}</Badge>)}
                        </div>
                    </div>
                    <div className="mt-8 border-t border-border pt-6">
                         <Button className="w-full" size="lg">{profileBlock.cardButtonLabel}</Button>
                    </div>
                </div>
              </div>
            </section>
        )}

        {/* 11. Professionals Showcase */}
        {professionalsBlock && professionalsBlock.isActive && professionalItems.length > 0 && (
            <section className="py-20 bg-background">
              <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {professionalsBlock.sectionTitle}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {professionalsBlock.sectionDescription}
                  </p>
                </div>
                {isLoading ? <Skeleton className="h-96 w-full"/> : (
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full max-w-6xl mx-auto"
                >
                  <CarouselContent className="-ml-4">
                    {professionalItems.map((pro) => (
                      <CarouselItem key={pro.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                          <Card className="h-full flex flex-col items-center text-center p-8 bg-card border-border shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <Avatar className="h-20 w-20 mb-4 border-2 border-border">
                              <AvatarImage src={pro.imageUrl} alt={pro.name} />
                              <AvatarFallback>{pro.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold text-foreground mb-1">{pro.name}</h3>
                            <p className="text-sm font-medium text-accent mb-4">{pro.roleLine}</p>
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
                )}
                 {/* CTA #2 */}
                <div className="text-center mt-16">
                    <DialogTrigger asChild>
                        <Button size="lg" variant="default">Приєднатися до професіоналів</Button>
                    </DialogTrigger>
                </div>
              </div>
            </section>
        )}

        {/* 12. SECTION “Монетизація” (Strengthened) */}
        <section className="py-20 bg-card">
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
                <Card key={index} className="shadow-sm hover:shadow-lg transition-shadow bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                       <div className="bg-card p-2 rounded-lg border">
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

        {/* 13. FAQ SECTION (Strengthened) */}
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    Поширені запитання
                </h2>
                {isLoading ? <Skeleton className="h-64 w-full" /> : (
                    <>
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
                        {faqItems.length > 0 && (
                             <div className="text-center mt-12">
                                <Button asChild variant="outline">
                                    <Link href="/faq">
                                        Більше відповідей
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>

        {/* 14. FINAL CTA SECTION */}
        <section className="py-20 md:py-28 bg-card">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ваші знання вже мають цінність
            </h2>
            <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-8">
              Дайте їм професійний простір, глобальну аудиторію та гідний формат монетизації.
            </p>
            <DialogTrigger asChild>
                <Button size="lg">Приєднатися до професіоналів</Button>
            </DialogTrigger>
          </div>
        </section>
      </main>
      <Footer />
      <DialogContent>
        <AuthModal setOpen={setAuthModalOpen} />
      </DialogContent>
      <FloatingStatusLink docId="proHeroMedia" />
    </Dialog>
  );
}
