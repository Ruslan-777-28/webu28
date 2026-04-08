import { 
    Activity, 
    Heart, 
    TrendingUp, 
    Shield, 
    Repeat, 
    Award, 
    Globe, 
    Sparkles, 
    Star, 
    PenTool, 
    Clock, 
    Crown,
    Users,
    ShoppingBag,
    LucideIcon 
} from 'lucide-react';

export interface NominationItem {
    id: string;
    title: string;
    shortDescription: string;
    explanationReason: string;
    explanationHowToGet: string;
    icon: LucideIcon;
}

/**
 * ACTIVE NOMINATIONS for the Showcase Page (12 total)
 * Reordered and updated as per latest requirements.
 */
export const NOMINATIONS_DATA: NominationItem[] = [
    {
        id: 'expert_year',
        title: 'Експерт року',
        shortDescription: 'Одна з головних річних відзнак платформи.',
        explanationReason: 'За найсильнішу сумарну позицію, авторитет і результативність у межах року.',
        explanationHowToGet: 'Поєднати стабільну активність, сильну репутацію, попит і високий prestige-рівень протягом тривалого періоду.',
        icon: Star
    },
    {
        id: 'community_choice',
        title: 'Вибір спільноти',
        shortDescription: 'Відзнака за сильний інтерес і підтримку з боку аудиторії.',
        explanationReason: 'За високу увагу користувачів, позитивний відгук і сильні сигнали зацікавленості.',
        explanationHowToGet: 'Нарощувати видимість, взаємодію, збереження, перегляди та інші соціальні сигнали інтересу.',
        icon: Heart
    },
    {
        id: 'price_minute_year',
        title: 'Найдорожча реалізована хвилина на платформі',
        shortDescription: 'Статус за рекордну цінність професійної хвилини.',
        explanationReason: 'За найвищу зафіксовану цінність хвилини консультації або взаємодії протягом року.',
        explanationHowToGet: 'Сформувати настільки сильну професійну вагу та попит, щоб ваша цінність досягла рекордного рівня.',
        icon: Clock
    },
    {
        id: 'breakthrough_year',
        title: 'Відкриття року',
        shortDescription: 'Річна відзнака за найпомітніший прорив.',
        explanationReason: 'За найсильніше нове ім’я або найпомітніше відкриття в межах року.',
        explanationHowToGet: 'Показати настільки сильний прогрес і ріст, щоб стати одним із головних відкриттів періоду.',
        icon: Sparkles
    },
    {
        id: 'community_architect',
        title: 'Архітектор спільноти',
        shortDescription: 'Відзнака за найсильніший внесок у зростання та розширення спільноти платформи.',
        explanationReason: 'За значущий внесок у залучення нових користувачів або спеціалістів і розширення екосистеми платформи.',
        explanationHowToGet: 'Системно приводити в платформу нових учасників через реферальні механіки, промокоди, рекомендації або інші канали залучення.',
        icon: Users
    },
    {
        id: 'rising_star',
        title: 'Висхідна зірка',
        shortDescription: 'Статус швидкого росту й помітного прогресу.',
        explanationReason: 'За різкий позитивний ривок у розвитку профілю, попиту або присутності в підкатегорії.',
        explanationHowToGet: 'Показати помітне зростання за короткий період через якісний профіль, активність і сильну динаміку уваги до ваших пропозицій.',
        icon: TrendingUp
    },
    {
        id: 'customer_of_year',
        title: 'Замовник року',
        shortDescription: 'Відзнака за найвищу та найстабільнішу активність з боку замовника.',
        explanationReason: 'За найбільшу кількість сесій, замовлень або найпомітнішу регулярну взаємодію з експертами протягом періоду.',
        explanationHowToGet: 'Активно користуватися платформою як замовник, регулярно взаємодіяти з експертами та формувати стійкий попит у межах платформи.',
        icon: ShoppingBag
    },
    {
        id: 'return_magnet',
        title: 'Магніт повернень',
        shortDescription: 'Відзнака за сильне повернення аудиторії.',
        explanationReason: 'За повторні звернення, повернення користувачів і стійкий інтерес до профілю.',
        explanationHowToGet: 'Будувати цінність, до якої аудиторія хоче повертатися знову — через якість пропозицій, профілю та досвіду взаємодії.',
        icon: Repeat
    },
    {
        id: 'subcategory_legend',
        title: 'Легенда підкатегорії',
        shortDescription: 'Одна з найсильніших відзнак усередині конкретної підкатегорії.',
        explanationReason: 'За доведену вагу, впізнаваність і особливий статус у своїй підкатегорії.',
        explanationHowToGet: 'Стати знаковою фігурою у своїй ніші через стабільний результат, сильну присутність і довгу prestige-історію.',
        icon: Award
    },
    {
        id: 'international_expert',
        title: 'Міжнародний експерт',
        shortDescription: 'Статус для профілів із виходом за межі локальної аудиторії.',
        explanationReason: 'За міжнародну видимість, універсальність і сильну присутність поза локальним ринком.',
        explanationHowToGet: 'Розвивати профіль так, щоб він був релевантним і зрозумілим ширшій, міжмовній або міжнародній аудиторії.',
        icon: Globe
    },
    {
        id: 'author_year',
        title: 'Автор року',
        shortDescription: 'Річна відзнака за найсильніший контентний внесок.',
        explanationReason: 'За значущий контент, вплив на аудиторію та сильну авторську присутність.',
        explanationHowToGet: 'Регулярно створювати контент, який формує увагу, довіру та довготривалу цінність для спільноти.',
        icon: PenTool
    },
    {
        id: 'legend_year',
        title: 'Легенда року',
        shortDescription: 'Найвища prestige-відзнака року.',
        explanationReason: 'За особливий внесок, впізнаваність, силу образу та історичну вагу в межах року.',
        explanationHowToGet: 'Стати однією з ключових фігур платформи, чия присутність формує пам’ять, престиж і символічну вагу періоду.',
        icon: Crown
    }
];

/**
 * RESERVE NOMINATIONS (Inactive for Showcase Page)
 */
export const RESERVE_NOMINATIONS_DATA: NominationItem[] = [
    {
        id: 'top_practice',
        title: 'Топ практик',
        shortDescription: 'Статус сильної та стабільної присутності в підкатегорії.',
        explanationReason: 'За активну роботу, стабільний попит і сильну видимість у вибраній підкатегорії.',
        explanationHowToGet: 'Підтримувати активні офери, розвивати профіль і показувати високий рівень залучення та результативності в межах періоду.',
        icon: Activity
    },
    {
        id: 'trust_symbol',
        title: 'Символ довіри',
        shortDescription: 'Ознака стабільності, надійності та високої довіри.',
        explanationReason: 'За сильну репутацію, послідовність і відчуття надійності у взаємодії з аудиторією.',
        explanationHowToGet: 'Системно підтримувати якісний профіль, стабільну активність і високий рівень довіри в межах своєї ніші.',
        icon: Shield
    }
];
