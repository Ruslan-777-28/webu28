export type BonusRule = {
    id: string;
    platform: 'site' | 'app';
    title: string;
    description: string;
    amount: number | string;
    unit: 'балів' | 'бонусів' | 'credits';
    category: string;
    order: number;
    isActive: boolean;
};

export const bonusRules: BonusRule[] = [
    {
        id: 'registration',
        platform: 'site',
        title: 'Реєстрація профілю',
        description: 'Створення та активація вашого акаунту в екосистемі LECTOR.',
        amount: 'X',
        unit: 'бонусів',
        category: 'Основа',
        isActive: true,
        order: 1,
    },
    {
        id: 'referral_activation',
        platform: 'site',
        title: 'Запрошення друга',
        description: 'Бонус за кожного активованого користувача, що приєднався за вашим посиланням.',
        amount: '5+',
        unit: 'бонусів',
        category: 'Спільнота',
        isActive: true,
        order: 2,
    },
    {
        id: 'profile_50',
        platform: 'site',
        title: '50% заповнення профілю',
        description: 'Наповнення ключових блоків вашого профілю для кращої видимості.',
        amount: 10,
        unit: 'бонусів',
        category: 'Профіль',
        isActive: true,
        order: 3,
    },
    {
        id: 'profile_75',
        platform: 'site',
        title: '75% заповнення профілю',
        description: 'Детальне розкриття вашої експертизи та досвіду.',
        amount: 15,
        unit: 'бонусів',
        category: 'Профіль',
        isActive: true,
        order: 4,
    },
    {
        id: 'profile_90',
        platform: 'site',
        title: '90% заповнення профілю',
        description: 'Максимальна готовність вашої візитки до взаємодії.',
        amount: 20,
        unit: 'бонусів',
        category: 'Профіль',
        isActive: true,
        order: 5,
    },
    {
        id: 'first_post',
        platform: 'site',
        title: 'Перший пост',
        description: 'Публікація першого авторського матеріалу в публічному блозі.',
        amount: 10,
        unit: 'бонусів',
        category: 'Контент',
        isActive: true,
        order: 6,
    },
    // App Section
    {
        id: 'first_product',
        platform: 'app',
        title: 'Перший цифровий товар',
        description: 'Розміщення першого платного або безкоштовного ресурсу в додатку.',
        amount: 15,
        unit: 'бонусів',
        category: 'Додаток',
        isActive: true,
        order: 7,
    },
    {
        id: 'first_review',
        platform: 'app',
        title: 'Перший відгук',
        description: 'Написання змістовного зворотного зв’язку після взаємодії.',
        amount: 5,
        unit: 'бонусів',
        category: 'Додаток',
        isActive: true,
        order: 8,
    },
    {
        id: 'first_session',
        platform: 'app',
        title: 'Перша завершена сесія',
        description: 'Успішне проведення або отримання консультації через додаток.',
        amount: 20,
        unit: 'бонусів',
        category: 'Додаток',
        isActive: true,
        order: 9,
    },
];
