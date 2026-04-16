'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  MapPin,
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
  Wallet,
  User,
  ChevronRight,
  Paperclip,
  Phone,
  PhoneOff,
  History,
  MessageCircle,
  Info
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
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AuthModal } from '@/components/auth-modal';
import { PageHero } from '@/components/page-hero';
import { FloatingStatusLink } from '@/components/floating-status-link';



const benefits = [
  {
    icon: Globe,
    title: 'Доступ до глобальної аудиторії',
    text: 'Працюйте з людьми з різних країн і відкривайте свої знання для ширшого світу, без мовних бар’єрів 24/7 з любого куточка світу.',
  },
  {
    icon: Layers,
    title: 'Гнучкий формат роботи',
    text: 'Обирайте той спосіб взаємодії, який підходить саме вам: консультації, події, повідомлення, продаж цифрових товарів та авторського контенту.',
  },
  {
    icon: Wallet,
    title: 'Зручний вивід коштів',
    text: 'Легко керуйте своїм балансом та виводьте кошти у зручний для вас спосіб. Керуйте зобов\'язаннями: хто винен вам і кому винні ви.',
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
];

const howItWorksSteps = [
  {
    step: 1,
    title: 'Створіть профіль',
    text: 'Додайте інформацію про себе, свій напрям, стиль роботи й ту цінність, яку ви даєте людям.',
  },
  {
    step: 2,
    title: 'Вкажіть вартість',
    text: 'Вкажіть: підкатегорію ніші, тип комунікації та цінову пропозицію. Опублікуйте.',
  },
  {
    step: 3,
    title: 'Додайте видимість',
    text: 'Публікуйте контент: пости, товарні пропозиції в стрічці та в профілі. Взаємодія з іншими просуває акаунт.',
  },
  {
    step: 4,
    title: 'Прийняти пропозицію',
    text: 'Обирай, з ким і як ти будеш взаємодіяти та яким типом комунікації.',
  },
  {
    step: 5,
    title: 'Монетизуйте свою цінність',
    text: 'Отримуйте та виводьте дохід, перетворюйте досвід та активність на вітрину компетентності.',
  },
];

const workFormats = [
  {
    icon: Video,
    title: 'Онлайн відеочат з мультимовним перекладачем',
    text: 'Живе спілкування у зручному форматі для персональної взаємодії.',
    detailsTitle: 'Онлайн відеочат з мультимовним перекладачем',
    detailsBody: [
      'Професіонал сам встановлює вартість 1 хвилини розмови, мінімальну тривалість сесії та підкатегорію, у якій цей офер буде доступний. Після створення офер одразу публікується в профілі спеціаліста і стає видимим для потенційних клієнтів.',
      'Коли професіонал переводить статус у режим доступний онлайн, користувачі бачать це в реальному часі і можуть ініціювати виклик негайно. Сума за розмову резервується наперед, а після завершення дзвінка зараховується на баланс спеціаліста за прозорим білінговим алгоритмом — точно відповідно до його тарифу, тривалості та умов оферу.',
      'Це знімає головний біль із неоплатами, фейковими домовленостями та ризиком працювати “всліпу”. Якщо у клієнта є баланс і виклик стартував, модель уже захищає професіонала. Ви не витрачаєте сили на з’ясування, хто серйозний, а хто ні — система робить це за Вас.',
      'Мультимовний переклад стирає бар’єри між країнами і ринками. Ви можете приймати клієнтів не тільки зі свого міста чи своєї країни, а з усього світу, не обмежуючись мовою спілкування. Це означає нову аудиторію, ширший попит, вищі чеки і реальну можливість продавати свою компетенцію на глобальному рівні.'
    ]
  },
  {
    icon: Calendar,
    title: 'Гнучкий календар',
    text: 'Створюйте сесії та події у зручний для вас час, керуючи власним календарем.',
    detailsTitle: 'Гнучкий календар',
    detailsBody: [
      'Професіонал сам керує своїм графіком: задає дні, години, тривалість сесій, доступні часові вікна та логіку запису. Ви не підлаштовуєтеся під хаос — Ви самі визначаєте рамки, у яких Вам зручно працювати.',
      'Коли спеціаліст створює офер у календарному форматі, клієнт під час купівлі резервує оплату наперед. Сума не “обіцяна”, а вже заброньована системою і чекає в безпечному статусі до моменту, коли професіонал прийме або відхилить запит.',
      'Це означає, що у Вас немає фейкових бронювань, порожніх обіцянок і даремно зайнятих слотів. Ви працюєте тільки з реальним попитом і реальними коштами. Для професіонала це комфорт, контроль над графіком і повна ясність: кожне підтверджене бронювання — це не шанс, а конкретний результат.',
      'Така модель особливо зручна для тих, хто хоче поєднати високий рівень сервісу, чіткий розклад і захищений дохід. А у зв’язці з мультимовною платформою це відкриває доступ до клієнтів із різних часових поясів і нових ринків без втрати контролю над своїм календарем.'
    ]
  },
  {
    icon: Users,
    title: 'Групові події',
    text: 'Створення тематичних зустрічей, подій або форматів для кількох учасників.',
    detailsTitle: 'Групові події',
    detailsBody: [
      'Групові події — це формат для спеціалістів із певним рівнем довіри та верифікації, які готові працювати на ширшу аудиторію. Професіонал створює подію, сам задає тему, дату, час, тривалість, вартість участі та потенційний масштаб аудиторії.',
      'Це може бути камерна подія на 100 людей або велика сесія на тисячі учасників. Один офер — і Ваша компетенція продається не одній людині, а цілій групі. Це вже не просто консультація, а інструмент масштабування експертності.',
      'Для професіонала це означає можливість багаторазово збільшувати дохід із одного формату взаємодії, збирати міжнародну аудиторію, працювати з високим рівнем охоплення і формувати статус лідера ніші. Платформа перетворює Вашу експертність на подію, до якої можуть приєднатися люди з різних країн.',
      'У мультимовному середовищі такий формат відкриває ще сильнішу перевагу: Ви не обмежені локальним ринком. Ви можете проводити події для міжнародної аудиторії, нарощувати впізнаваність і виходити на рівень, де Ваша експертність працює в масштабі.'
    ]
  },
  {
    icon: MessageSquare,
    title: 'Текстова взаємодія',
    text: 'Формат для тих, хто працює через текст, короткі відповіді або асинхронний контакт.',
    detailsTitle: 'Текстова взаємодія',
    detailsBody: [
      'Це класична текстова взаємодія в моделі 1 питання — 1 відповідь. Професіонал створює офер, задає свою вартість і правила формату, а клієнт надсилає запит у текстовому вигляді.',
      'У момент надсилання питання винагорода за цей офер уже резервується системою. Після того як спеціаліст дає відповідь, сума автоматично зараховується на його баланс. Тобто професіонал працює не “на довірі”, а в захищеній моделі, де кожне прийняте звернення вже забезпечене оплатою.',
      'Цей формат ідеально підходить для тих, хто хоче монетизувати знання без необхідності синхронізувати час, виходити в ефір чи проводити повноцінну сесію. Це спокійний, контрольований формат взаємодії, де Ви керуєте своєю енергією, ритмом роботи і навантаженням.',
      'А завдяки глобальній платформі Ваші відповіді можуть купувати клієнти з різних країн, не обмежуючись локальною аудиторією. Це простий і дуже сильний канал монетизації компетенції.'
    ]
  },
  {
    icon: File,
    title: 'Обмін файлами',
    text: 'Можливість передавати матеріали, розбори, рекомендації чи персональні файли.',
    detailsTitle: 'Обмін файлами',
    detailsBody: [
      'Це комбінований формат: чат плюс прикріплений файл. Він підходить для тих випадків, коли відповідь або послуга повинна містити не лише текст, а й конкретний матеріал — документ, розбір, добірку, схему, рекомендації, графіку чи інший артефакт.',
      'Білінг працює за тією ж захищеною логікою, що і в текстовій взаємодії: клієнт надсилає запит, система резервує оплату, а після виконання і передачі результату винагорода зараховується спеціалісту. Це означає, що професіонал не працює “в надії”, а передає матеріал у рамках уже захищеної оплати.',
      'Для спеціаліста це дуже зручна модель монетизації знань, коли частина цінності живе у файлі, структурі, персональному розборі або заздалегідь підготовленому матеріалі. Ви не просто відповідаєте — Ви створюєте артефакт, за який система чесно і безпечно проводить оплату.',
      'Цей формат особливо сильний для міжнародного ринку, бо цифровий матеріал зрозумілий, відтворюваний і масштабований. Ви можете продавати глибину своєї експертності у формі, яка не зникає после розмови, а залишається цінністю для клієнта.'
    ]
  },
  {
    icon: Package,
    title: 'Цифрові продукти',
    text: 'Продаж авторських матеріалів, гідів, практик або інших цифрових форматів.',
    detailsTitle: 'Цифрові продукти',
    detailsBody: [
      'Цифрові продукти — це особлива модель торгівлі компетенцією професіонала. Фактично Ви отримуєте власний інтернет-магазин цифрових артефактів, який відображається і на сторінці Вашого профілю, і в стрічці публікацій платформи.',
      'Це може бути доступ до текстових або графічних матеріалів, закритих практик, авторських методик, гідів, пакетів рекомендацій, сертифікатів, подарункових сесій, спеціальних добірок і будь-яких інших цифрових форматів, які мають цінність для Вашої аудиторії.',
      'Після оплати клієнт отримує заявлений доступ, а професіонал — зрозумілий і масштабований канал доходу. На відміну від разової взаємодії, цифровий продукт можна продавати багаторазово, не витрачаючи однаковий обсяг часу щоразу заново. Це вже не лише послуга, а повноцінний актив Вашої експертності.',
      'Для професіонала це один із найсильніших форматів росту: Ви працюєте не тільки руками й часом, а й інтелектуальним капіталом. У поєднанні з глобальною платформою, мультимовністю та міжнародною аудиторією це дає шанс виходити на нові ринки, піднімати середній чек і перетворювати знання на стабільну систему доходу.'
    ]
  },
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


const mockArchitects = [
  {
    id: '1',
    nickname: 'Майя А.',
    credo: '«Структура там, де панує хаос»',
    bio: 'Експерт з глибинної систематизації життєвих процесів. Понад 400 годин консультацій та супроводу. Моя система допомагає знайти опору, коли здається, що землю вибито з-під ніг.',
    subcategory: 'Human Design',
    expiryDate: '10 / 2026',
    countryName: 'Ukraine',
    countryCode: 'ua',
    language: 'Українська',
    avatarUrl: 'https://i.pravatar.cc/400?u=archstr1',
    icon: Users
  },
  {
    id: '2',
    nickname: 'Стефан Д.',
    credo: '«Карти не показують вирок, вони показують шлях»',
    bio: 'Таролог-аналітик із 10-річним стажем. Аналізую не заради розваги, а для стратегічного планування життя, бізнесу та особистих кордонів. Випускник європейської школи.',
    subcategory: 'Tarot',
    expiryDate: '02 / 2027',
    countryName: 'Poland',
    countryCode: 'pl',
    language: 'Polski',
    avatarUrl: 'https://i.pravatar.cc/400?u=archstr2',
    icon: Layers
  },
  {
    id: '3',
    nickname: 'Еліна В.',
    credo: '«Твій гороскоп — це інструкція до дії»',
    bio: 'Астролог, що працює через призму психології та коучингу. Допомагаю розкрити ваш вроджений потенціал та зрозуміти глибокі блоки, які заважають рухатися вперед у розвитку.',
    subcategory: 'Astrology',
    expiryDate: '12 / 2025',
    countryName: 'Germany',
    countryCode: 'de',
    language: 'Deutsch',
    avatarUrl: 'https://i.pravatar.cc/400?u=archstr3',
    icon: Star
  },
  {
    id: '4',
    nickname: 'Радомир',
    credo: '«Енергія завжди йде туди, куди спрямована увага»',
    bio: 'Провідник у світ медитативних практик та соматичного відновлення. Навчаю, як зберігати внутрішній спокій та ресурс навіть у процесі найвищої турбулентності.',
    subcategory: 'Spiritual Coaching',
    expiryDate: '05 / 2027',
    countryName: 'Spain',
    countryCode: 'es',
    language: 'English',
    avatarUrl: 'https://i.pravatar.cc/400?u=archstr4',
    icon: Award
  }
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

        {/* 2. SECTION “Це для вас, якщо Ви...” */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Це для вас, якщо Ви...
            </h2>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

              {/* Ліва картка: Підкатегорії (Масштабована компактність) */}
              <Card className="bg-background shadow-sm hover:shadow-md transition-shadow relative pt-7 pb-4 px-6 lg:pt-9 lg:pb-5 lg:px-7 border-border/40 h-full">
                <CheckCircle className="absolute top-4 right-5 h-5 w-5 text-accent flex-shrink-0 opacity-80" />
                <div className="flex flex-col space-y-1.5 mt-1">
                  {[
                    'Tarot', 'Astrology', 'Numerology', 'Energy Healing',
                    'Meditation & Mindfulness', 'Spiritual Coaching',
                    'Oracle Practices', 'Dream Reading', 'Human Design',
                    'Space Reading', 'Mentors'
                  ].map((cat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm lg:text-[0.95rem] font-light tracking-wide text-foreground/90">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-[0.45rem] shrink-0" />
                      <span>{cat}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-2.5 text-sm lg:text-[0.95rem] font-light tracking-wide text-foreground/90">
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-[0.45rem] shrink-0" />
                    <span>other</span>
                  </div>
                </div>
              </Card>

              {/* Центральна картка: Описові ролі (Масштабована компактність) */}
              <Card className="bg-background shadow-sm hover:shadow-md transition-shadow relative pt-7 pb-4 px-6 lg:pt-9 lg:pb-5 lg:px-7 border-border/40 h-full">
                <CheckCircle className="absolute top-4 right-5 h-5 w-5 text-accent flex-shrink-0 opacity-80" />
                <div className="flex flex-col space-y-3 mt-1">
                  {[
                    'практик енергетичних або інтуїтивних методик',
                    'медитативний або духовний провідник',
                    'консультант, який працює через знання, досвід і особисту практику',
                    'автор цифрових матеріалів у своїй ніші',
                    'володієте обмеженим знаннями'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm lg:text-[0.95rem] font-light tracking-wide leading-relaxed text-foreground/90">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-[0.55rem] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Права картка: Додаткові потреби та амбіції */}
              <Card className="bg-background shadow-sm hover:shadow-md transition-shadow relative pt-7 pb-4 px-6 lg:pt-9 lg:pb-5 lg:px-7 border-border/40 h-full min-h-[100px]">
                <CheckCircle className="absolute top-4 right-5 h-5 w-5 text-accent flex-shrink-0 opacity-80" />
                <div className="flex flex-col space-y-3 mt-1">
                  {[
                    'маєте потребу в значному збільшенні аудиторії',
                    'бажання реалізувати свої здібності поза межами фізичної присутності',
                    'глобальний обмін досвідом з лідерами ніші',
                    'є відповіді на питання, які не мають в інших місцях',
                    'маєте відповідь хто №1'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm lg:text-[0.95rem] font-light tracking-wide leading-relaxed text-foreground/90">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-[0.55rem] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>

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
                Все, що потрібно, щоб оформити свою експертність, вийти на глобальну аудиторію та перетворити знання на системну практику й дохід в одній екосистемі.<br />
                Безмежний потенціал для Твого апгрейду.
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

            <div className="mt-6 text-right pr-4 md:pr-8 lg:pr-12">
              <p className="text-xs lg:text-sm font-light tracking-wide text-foreground/50 italic">
                Почніть з того формату, який для Вас комфортний.
              </p>
            </div>
          </div>
        </section>

        {/* 4. SECTION “Як це працює” */}
        <section className="py-20 bg-card overflow-hidden">
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border/40 shadow-sm mb-6 bg-white transition-colors hover:border-accent/40 duration-300">
                      <span className="text-base font-medium text-foreground/70">{item.step}</span>
                    </div>
                    
                    {/* Text Block (Restored size and spacing) */}
                    <div className="flex flex-col space-y-2 px-1">
                      <h3 className="text-lg font-bold text-foreground tracking-tight leading-snug">
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

        {/* 5. SECTION “Формати роботи” */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Обирай, як саме тобі комфортно взаємодіяти з клієнтами та аудиторією
              </h2>
              <p className="text-lg text-muted-foreground">
                Типи комунікацій для тебе
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workFormats.map((format, index) => (
                <div key={index} className="relative">
                  {index === 1 && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 font-medium whitespace-nowrap">
                      монетизація
                    </div>
                  )}
                  <Card className="shadow-sm hover:shadow-lg transition-all bg-card/50 flex flex-col h-full">
                    <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                      <div className="bg-background p-2 rounded-lg border">
                        <format.icon className="h-6 w-6 text-accent" />
                      </div>
                      <CardTitle className="text-lg">{format.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow justify-between">
                      <p className="text-muted-foreground mb-4">{format.text}</p>

                      <div className="flex justify-end items-center mt-auto">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="flex items-center gap-1.5 text-[10px] hover:opacity-80 transition-opacity uppercase tracking-tight group font-medium">
                              <span className="text-muted-foreground/60 underline underline-offset-2 decoration-muted-foreground/40">деталі</span>
                              <span className="text-xl font-light leading-none text-black">+</span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="w-[calc(100vw-40px)] md:w-[480px] lg:w-[600px] bg-background/95 backdrop-blur-sm border shadow-xl p-6 text-[0.85rem] leading-relaxed text-muted-foreground overflow-y-auto max-h-[70vh] z-50"
                          >
                            <h4 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider">{(format as any).detailsTitle}</h4>
                            <div className="flex flex-col space-y-3">
                              {(format as any).detailsBody.map((para: string, i: number) => (
                                <p key={i}>{para}</p>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {customerBlock && customerBlock.isActive && (
          <section className="py-24 bg-card overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-12 gap-10 lg:gap-16 items-center">
                <div className="col-span-12 lg:col-span-5">
                  <div className="max-w-lg">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">
                      <span className="block mb-1">Знай свого замовника.</span>
                      <span className="block text-2xl md:text-3xl text-muted-foreground font-medium">Обирай з ким взаємодіяти.</span>
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed text-balance">
                      {customerBlock.sectionDescription}
                    </p>
                    <div className="space-y-3">
                      {customerBlock.bullets.map((bullet, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="mt-1 flex-shrink-0">
                            <ShieldCheck className="h-5 w-5 text-accent/60" />
                          </div>
                          <p className="text-md text-foreground/80">{bullet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-7 relative flex justify-center lg:justify-start">
                  <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-0">
                    
                    {/* Card 1: Static Visual Mirror Placeholder (Now on the LEFT) */}
                    <div className="relative z-0 w-full max-w-[280px] bg-background p-4 rounded-xl shadow-xl border border-border/40 flex flex-col sm:mt-16 scale-95 transition-all duration-500">
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                            +380 65 453 432
                          </span>
                        </div>

                        <div className="relative w-full aspect-[2.2/1] overflow-hidden rounded-lg border border-border/40 shadow-inner group bg-muted/20 flex items-center justify-center">
                          <span className="text-4xl font-light text-muted-foreground/30">?</span>
                        </div>

                        <div className="pt-0.5 flex items-center justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-base leading-none text-foreground truncate">_ _ _</h4>
                            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">_ _ _</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3.5">
                        <div className="bg-muted/30 p-2 rounded-lg border border-border/20 flex flex-col justify-center">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 leading-none">Рейтинг</p>
                          <div className="flex items-center gap-1 font-bold text-sm">
                            <Star className="w-3 h-3 text-muted-foreground/40" />
                            (?)
                          </div>
                        </div>
                        <div className="bg-muted/30 p-2 rounded-lg border border-border/20 flex flex-col justify-center">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 leading-none">Сесії</p>
                          <div className="flex items-center gap-1 font-bold text-sm">
                            <History className="w-3 h-3 text-muted-foreground/40" />
                            (?)
                          </div>
                        </div>
                        <div className="bg-muted/30 p-2 rounded-lg border border-border/20 flex flex-col justify-center">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 leading-none">Відгуки</p>
                          <div className="flex items-center gap-1 font-bold text-sm">
                            <MessageCircle className="w-3 h-3 text-muted-foreground/40" />
                            (?)
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1">
                        <div className="text-[11px] text-muted-foreground/80 leading-snug">
                          заброньовано <span className="font-bold text-muted-foreground/60">(?) хв.</span> професіонала
                        </div>
                        <div className="text-[11px] text-muted-foreground/80 leading-snug">
                          заброньовано винагорода <span className="font-bold text-muted-foreground/60">(?) _ _ _</span>
                        </div>
                      </div>

                      <div className="mt-3 p-2.5 rounded-lg border border-dashed border-border/60 bg-accent/2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3.5 h-3.5 border border-foreground/30 rounded-[2px] bg-background flex items-center justify-center">
                             <div className="w-1.5 h-1.5 bg-muted/20 rounded-[1px]" />
                          </div>
                          <Globe className="w-3.5 h-3.5 text-muted-foreground/30" />
                          <span className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-tight">_ _ _ _ _ _</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground/40 leading-none pl-[22px]">
                          мовна пара _ _ _
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[10px] uppercase tracking-wide text-muted-foreground/60 shrink-0">Інтереси:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {[1, 2].map(i => (
                              <Badge key={i} variant="outline" className="text-[9px] font-medium py-0 px-1.5 bg-muted/20 border-border/40 text-muted-foreground/40">
                                _ _ _
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/40">
                        <Button size="sm" variant="outline" className="h-8 text-[10px] text-muted-foreground border-border/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center gap-1.5 cursor-default">
                          <PhoneOff className="w-3 h-3 text-red-500/60" />
                          Відхилити
                        </Button>
                        <Button size="sm" className="h-8 text-[10px] bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 border shadow-none flex items-center gap-1.5 cursor-default">
                          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Phone className="w-2.5 h-2.5 text-white" />
                          </div>
                          Прийняти
                        </Button>
                      </div>
                    </div>

                    {/* Card 2: Existing Content (Main Floating Card - Now on the RIGHT with minimal overlap) */}
                    <div className="relative z-10 w-full max-w-[280px] bg-background p-4 rounded-xl shadow-2xl border border-border/60 flex flex-col sm:-ml-6 sm:mt-4 hover:shadow-accent/5 transition-all duration-500 hover:-translate-y-1">
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                            Замовник
                          </span>
                        </div>

                        <div className="relative w-full aspect-[2.2/1] overflow-hidden rounded-lg border border-border/40 shadow-inner group">
                          <img
                            src={customerBlock.imageUrl || "https://picsum.photos/seed/client1/400/200"}
                            alt={customerBlock.imageAlt}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        <div className="pt-0.5 flex items-center justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-base leading-none text-foreground truncate">{customerBlock.cardPersonName}</h4>
                            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{customerBlock.cardMetaText}</p>
                          </div>
                          {customerBlock.countryCode && (
                            <span className={`fi fi-${customerBlock.countryCode.toLowerCase()} w-5 h-3.5 shadow-sm rounded-[1px] shrink-0`} />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3.5">
                        <div className="bg-muted/30 p-2 rounded-lg border border-border/20 flex flex-col justify-center">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 leading-none">Рейтинг</p>
                          <div className="flex items-center gap-1 font-bold text-sm">
                            <Star className="w-3 h-3 text-accent fill-accent" />
                            {customerBlock.cardRatingValue}
                          </div>
                        </div>
                        <div className="bg-muted/30 p-2 rounded-lg border border-border/20 flex flex-col justify-center">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 leading-none">Сесії</p>
                          <div className="flex items-center gap-1 font-bold text-sm">
                            <History className="w-3 h-3 text-muted-foreground/60" />
                            {customerBlock.cardCompletedSessions}
                          </div>
                        </div>
                        <div className="bg-muted/30 p-2 rounded-lg border border-border/20 flex flex-col justify-center">
                          <p className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 leading-none">Відгуки</p>
                          <div className="flex items-center gap-1 font-bold text-sm">
                            <MessageCircle className="w-3 h-3 text-muted-foreground/60" />
                            {customerBlock.cardReviewsCount || 0}
                          </div>
                        </div>
                      </div>

                      {/* Booking Info Lines */}
                      {(customerBlock.reservedMinutes !== undefined || customerBlock.reservedReward !== undefined) && (
                        <div className="mt-3 space-y-1">
                          {customerBlock.reservedMinutes !== undefined && (
                            <div className="text-[11px] text-muted-foreground/80 leading-snug">
                              заброньовано <span className="font-bold text-foreground">{customerBlock.reservedMinutes} хв.</span> професіонала
                            </div>
                          )}
                          {customerBlock.reservedReward !== undefined && (
                            <div className="text-[11px] text-muted-foreground/80 leading-snug">
                              заброньовано винагорода <span className="font-bold text-foreground">{customerBlock.reservedReward} {customerBlock.rewardCurrencyLabel || 'кредитів'}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Translation Block */}
                      {customerBlock.translationEnabled && (
                        <div className="mt-3 p-2.5 rounded-lg border border-dashed border-border/60 bg-accent/2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3.5 h-3.5 border border-foreground/30 rounded-[2px] bg-background flex items-center justify-center">
                               <div className="w-1.5 h-1.5 bg-accent rounded-[1px]" />
                            </div>
                            <Globe className="w-3.5 h-3.5 text-accent/60" />
                            <span className="text-[11px] font-medium text-foreground/80 uppercase tracking-tight">застосувати перекладач</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground/60 leading-none pl-[22px]">
                            мовна пара {customerBlock.languagePair || 'англійська / іспанська'}
                          </div>
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[10px] uppercase tracking-wide text-muted-foreground/80 shrink-0">Інтереси:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {customerBlock.cardTags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-[9px] font-medium py-0 px-1.5 bg-muted/20 border-border/40">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/40">
                        <Button size="sm" variant="outline" className="h-8 text-[10px] text-muted-foreground border-border/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center gap-1.5">
                          <PhoneOff className="w-3 h-3 text-red-500/60" />
                          Відхилити
                        </Button>
                        <Button size="sm" className="h-8 text-[10px] bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 border shadow-none flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Phone className="w-2.5 h-2.5 text-white" />
                          </div>
                          Прийняти
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

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


        {/* 10. SECTION: Profile Mockup & Showcase */}
        {profileBlock && profileBlock.isActive && (
          <section className="py-24 bg-card/50 overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                  {profileBlock.sectionTitle}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-lg text-muted-foreground font-light">
                    {profileBlock.sectionDescription}
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-muted-foreground/40 hover:text-accent transition-colors p-1" aria-label="Info">
                        <Info className="h-4 w-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 text-sm leading-relaxed bg-background/95 backdrop-blur-sm border-border/40 shadow-xl rounded-xl">
                      <p className="text-foreground/90 font-medium">
                        На цьому екрані у стиснутому демонстраційному форматі показано, як профіль експерта та його основний функціонал виглядатимуть для інших користувачів платформи. Повна версія профілю буде значно ширшою за наповненням і можливостями: після реєстрації вона стане доступною для повного перегляду та заповнення всіх полів на 100%.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Showcase Container */}
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                  
                  {/* ZONE 1: Identity (Left - col-span-3) - Block A Card Surface */}
                  <div className="md:col-span-3 h-full">
                    <div className="h-full bg-background/80 border border-border/40 rounded-lg shadow-sm backdrop-blur-[1px] flex flex-col overflow-hidden">
                      {/* Static Visual Status Row */}
                      <div className="flex items-center gap-2 px-5 pt-5 pb-1 text-neutral-500">
                        <ShieldCheck className="w-3.5 h-3.5 opacity-90" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.08em] whitespace-nowrap truncate">Community Architect · Taro / England</span>
                      </div>

                      {/* Static Visual Profile Completion Accent */}
                      <div className="flex gap-1.5 w-full px-5 pt-2.5 pb-3">
                        <div className="h-[2.5px] flex-1 bg-violet-600 rounded-full" />
                        <div className="h-[2.5px] flex-1 bg-violet-600 rounded-full" />
                        <div className="h-[2.5px] flex-1 bg-violet-600 rounded-full" />
                        <div className="h-[2.5px] flex-1 bg-violet-600/20 rounded-full" />
                      </div>

                      <div className="relative group w-full border-y border-border/10">
                        <div className="relative w-full aspect-[1.5/1] overflow-hidden bg-muted/20">
                          <img 
                            src={profileBlock.identity?.avatarImageUrl || profileBlock.imageUrl} 
                            alt={profileBlock.identity?.displayName || profileBlock.cardPersonName} 
                            className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-[1.03]" 
                          />
                          
                          {/* Ultra-Thin Minimal Status Bar */}
                          {(profileBlock.identity?.statusLabel || profileBlock.cardStatusLabel || 'Online').toLowerCase().includes('online') && (
                            <div className="absolute bottom-0 left-0 right-0 bg-emerald-900/95 h-[12px] flex items-center justify-center text-[5.5px] font-black text-white uppercase tracking-[1.35em] pl-[1.35em] select-none backdrop-blur-sm border-t border-white/5">
                              ONLINE
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-6 pt-5 flex flex-col items-center md:items-start text-center md:text-left space-y-6 w-full">
                        <div className="space-y-3 w-full">
                          <div className="space-y-1">
                            <h3 className="text-2xl font-bold tracking-tight text-foreground">
                              {profileBlock.identity?.displayName || profileBlock.cardPersonName}
                            </h3>
                            {profileBlock.identity?.countryCode && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground/60 font-medium mt-1">
                                <MapPin className="h-3 w-3 opacity-60" />
                                <span className={`fi fi-${profileBlock.identity.countryCode.toLowerCase()} w-4 h-2.5 shadow-sm rounded-[1px] shrink-0`} />
                                <span className="uppercase">{profileBlock.identity.countryCode}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-[0.85rem] italic text-foreground/70 leading-relaxed font-normal">
                            {profileBlock.identity?.headline || profileBlock.cardHeadline}
                          </p>
                          
                          <div className="space-y-2 pt-2 border-t border-border/40">
                            <div className="flex items-center gap-2 text-[0.8rem] text-muted-foreground">
                              <Globe className="h-3.5 w-3.5 opacity-60" />
                              <span>{profileBlock.identity?.languages || profileBlock.cardLanguages}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[0.8rem] text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5 opacity-60" />
                              <span>{profileBlock.identity?.metaLine || 'В екосистемі з 2024'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ZONE 2: Main Showcase (Center - col-span-6) */}
                  <div className="md:col-span-6 flex flex-col gap-6">
                    {/* Specialization Row */}
                    <Card className="bg-background border-border/40 shadow-sm overflow-hidden min-h-[140px] flex flex-col justify-center px-8">
                       <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">Ключові напрямки</span>
                       </div>
                       <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                         {(profileBlock.specializations || profileBlock.cardDirections || []).map((spec, i) => (
                           <span 
                             key={i} 
                             className={`text-[0.95rem] transition-colors duration-200 ${
                               i === 0 
                                 ? "text-foreground font-bold border-b-2 border-accent pb-0.5 tracking-tight" 
                                 : "text-muted-foreground/60 font-medium"
                             }`}
                           >
                             {spec}
                           </span>
                         ))}
                       </div>
                    </Card>

                    {/* Interactions Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                      {(() => {
                        const baseInteractions = [
                          { type: 'text', topText: '', label: 'Чат сесія', subLabel: 'Отримайте відповідь', isVisible: true },
                          { type: 'video', topText: '', label: 'Відео виклик', subLabel: 'Отримайте відповідь', isVisible: true },
                          { type: 'file', topText: '', label: 'Аналіз файлу', subLabel: 'Отримайте відповідь', isVisible: true },
                          { type: 'calendar', topText: '', label: 'Календар', subLabel: 'Оберіть зручний час', isVisible: true }
                        ];
                        
                        const items = (profileBlock.interactions && profileBlock.interactions.length > 0)
                          ? [
                              ...profileBlock.interactions,
                              ...baseInteractions.slice(profileBlock.interactions.length)
                            ].map(i => ({ ...i, topText: i.topText || '' })) // Ensure topText exists
                            .slice(0, 4)
                          : baseInteractions;

                        return items.map((int, i) => {
                          if (!int.isVisible) return null;
                          const Icon = int.type === 'video' ? Video : int.type === 'file' ? Paperclip : int.type === 'calendar' ? Calendar : MessageSquare;
                          return (
                            <Card key={i} className="bg-background border-border/40 shadow-sm hover:shadow-md transition-all group cursor-pointer h-full">
                              <CardContent className="p-5 flex flex-col items-center text-center justify-center h-full">
                                {int.topText && (
                                  <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-muted-foreground/60 mb-3 truncate w-full">
                                    {int.topText}
                                  </div>
                                )}
                                <div className="bg-muted/30 p-2.5 rounded-xl mb-4 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                  <Icon className="h-5 w-5 opacity-60 group-hover:opacity-100" />
                                </div>
                                <h4 className="text-sm font-bold text-foreground mb-1">{int.label}</h4>
                                <p className="text-[10px] text-muted-foreground leading-tight uppercase tracking-wider">{int.subLabel}</p>
                              </CardContent>
                            </Card>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* ZONE 3: Mini Modules (Right - col-span-3) */}
                  <div className="md:col-span-3 flex flex-col gap-4">
                    {[
                      { key: 'publications', icon: BookOpen, data: profileBlock.rightModules?.publications },
                      { key: 'artifacts', icon: Package, data: profileBlock.rightModules?.artifacts },
                      { key: 'biography', icon: User, data: profileBlock.rightModules?.biography }
                    ].map((mod, i) => {
                      if (mod.data && !mod.data.isVisible) return null;
                      const Icon = mod.icon;
                      return (
                        <Card key={mod.key} className="bg-background/80 backdrop-blur-sm border-border/40 shadow-sm hover:border-accent/30 transition-colors group cursor-pointer flex-1 min-h-[100px] flex flex-col justify-center">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="bg-accent/5 p-2 rounded-[8px] border border-accent/10 border-none">
                              <Icon className="h-5 w-5 text-accent opacity-70" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-[0.85rem] font-bold text-foreground truncate">{mod.data?.title || (mod.key === 'publications' ? 'Публікації' : mod.key === 'artifacts' ? 'Артефакти' : 'Біографія')}</h5>
                              <p className="text-[0.7rem] text-muted-foreground truncate">{mod.data?.subtitle || 'Переглянути деталі'}</p>
                              <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[9px] uppercase tracking-widest font-bold text-accent">{mod.data?.hint || 'Відкрити'}</span>
                                <ChevronRight className="h-2.5 w-2.5 text-accent" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                </div>
              </div>
            </div>
          </section>
        )}


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



        {/* 11. Professionals Showcase */}
        {professionalsBlock && professionalsBlock.isActive && (
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-5xl mx-auto mb-3">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {professionalsBlock.sectionTitle}
                </h2>
                <p className="text-lg text-muted-foreground w-full max-w-4xl mx-auto">
                  {professionalsBlock.sectionDescription}
                </p>
              </div>

              {/* Новий преміальний сірий заголовок над картками */}
              <div className="text-center mb-5">
                <h3 className="text-xl md:text-2xl font-light uppercase tracking-[0.2em] text-muted-foreground/60">
                  Архітектори / Куратори
                </h3>
              </div>
              {isLoading ? <Skeleton className="h-96 w-full" /> : (
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full max-w-6xl mx-auto"
                >
                  <CarouselContent className="-ml-4">
                    {mockArchitects.map((pro) => {
                      const Icon = pro.icon;
                      return (
                        <CarouselItem key={pro.id} className="pl-4 md:basis-full lg:basis-1/2">
                          <div className="p-1 h-full">
                            <Card className="h-full flex flex-row overflow-hidden bg-background border border-border shadow-sm hover:shadow-md transition-all duration-300 rounded-[12px] group relative min-h-[260px]">
                              {/* Left: Premium Portrait Avatar */}
                              <div className="w-[120px] sm:w-[150px] md:w-[170px] shrink-0 relative bg-muted/20 border-r border-border/40">
                                <img src={pro.avatarUrl} alt={pro.nickname} className="w-full h-full object-cover filter brightness-[0.95] group-hover:brightness-100 transition-all duration-500" />
                              </div>

                              {/* Right: Structured Info Block */}
                              <div className="flex flex-col flex-grow p-4 md:p-5 relative min-w-0 bg-gradient-to-br from-background to-accent/5">
                                {/* Top Status Badge Row */}
                                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                                  <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] uppercase tracking-widest font-semibold text-accent border border-accent/20 bg-accent/5 px-2 py-1.5 rounded-[2px] shadow-sm">
                                    <Icon className="w-3.5 h-3.5" />
                                    {pro.subcategory}
                                  </div>
                                  <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold whitespace-nowrap">
                                    дійсний до {pro.expiryDate}
                                  </span>
                                </div>

                                {/* Identity & Credo */}
                                <div className="mb-3 border-b border-border/30 pb-3">
                                  <h3 className="text-xl md:text-2xl font-bold text-foreground truncate mb-1">
                                    {pro.nickname}
                                  </h3>
                                  <p className="text-xs md:text-sm font-serif italic text-foreground/80 line-clamp-2 pr-2">
                                    {pro.credo}
                                  </p>
                                </div>

                                {/* Bio */}
                                <p className="text-[13px] md:text-sm text-muted-foreground line-clamp-3 leading-relaxed w-full">
                                  {pro.bio}
                                </p>

                                {/* Registration Data Bottom */}
                                <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-y-2">
                                  <div className="flex items-center gap-3">
                                    <span className={`fi fi-${pro.countryCode} text-[22px] md:text-[24px] shadow-sm rounded-[2px]`} style={{ lineHeight: 1 }} />
                                    <div className="flex flex-col">
                                      <span className="text-[10px] md:text-[11px] font-bold text-muted-foreground/90 uppercase tracking-widest leading-none mb-1">
                                        {pro.countryName}
                                      </span>
                                      <span className="text-[8px] md:text-[9px] text-muted-foreground/60 uppercase tracking-[0.25em] leading-none">
                                        {pro.countryCode}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-[9px] font-semibold text-foreground/70 uppercase tracking-widest bg-muted/50 px-2 py-1 rounded-[2px]">
                                    {pro.language}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex left-[-50px]" />
                  <CarouselNext className="hidden sm:flex right-[-50px]" />
                </Carousel>
              )}
              {/* CTA #2: Замінено на 2 кнопки (форма + перехід) */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-16 w-full max-w-4xl mx-auto px-4">

                {/* Кнопка 1: Виклик форми */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="default" className="w-full md:w-auto h-14 px-8 font-semibold tracking-wide shadow-md">
                      Подати заявку на верифікацію куратор / архітектор
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Заявка на верифікацію</DialogTitle>
                      <DialogDescription>
                        Форма знаходиться в розробці. Тут будуть детальні поля для заявки на статус.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-16 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/60 rounded-lg bg-muted/30 my-4">
                      <span className="text-sm font-medium tracking-wide uppercase">[ Form Shell Placeholder ]</span>
                    </div>
                    <div className="flex justify-end gap-3 mt-2">
                      <Button variant="ghost" disabled>Скасувати</Button>
                      <Button type="submit" disabled>Відправити заявку</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Кнопка 2: Перехід на /architectors */}
                <Button size="lg" variant="secondary" className="w-full md:w-auto h-14 px-10 font-semibold tracking-wide border border-border/50 hover:bg-secondary/80" asChild>
                  <Link href="/architectors">
                    Куратори / архітектори платформи
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}



        {/* 7. NEW BLOCK: Safety, Support & Fair Play */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
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


