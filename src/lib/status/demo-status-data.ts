import { StatusAwardDefinition, SnapshotMetadata, StatusAwardRecord } from './types';

// Used in selectors to simulate the default target profile
export const DEMO_CONFIG = {
    demoProfileTargetId: 'usr1' // Translates to Super маріо from previous setup
};

export const DEMO_AWARD_DEFINITIONS: StatusAwardDefinition[] = [
    {
        id: 'voice_of_season',
        title: 'Топ практик',
        shortLabel: 'Топ',
        description: 'Найбільш впливовий експерт сезону за алгоритмічними показниками активності та залученості.',
        layerType: 'seasonal',
        assignmentType: 'algorithmic',
        rarity: 'rare',
        icon: 'Mic',
        displayPriority: 2,
        visibleInProfile: true,
        visibleInLegend: true,
        active: true,
        eligibleForHallOfFame: true,
        explanationType: 'Сезонний статус',
        explanationReason: 'за сильну й стабільну активність у вибраній підкатегорії та помітний попит на пропозиції.',
        explanationHowToGet: 'статус надається користувачам, які входять до числа найсильніших практиків періоду за поєднанням активних оферів, видимості та результативності.'
    },
    {
        id: 'trust_symbol',
        title: 'Вибір спільноти',
        shortLabel: 'Вибір',
        description: 'Присвоюється за виняткову кількість позитивних відгуків та високий рівень утримання.',
        layerType: 'permanent',
        assignmentType: 'hybrid',
        rarity: 'legendary',
        icon: 'Shield',
        displayPriority: 1,
        visibleInProfile: true,
        visibleInLegend: true,
        active: true,
        eligibleForHallOfFame: true,
        explanationType: 'Соціальний / community статус',
        explanationReason: 'за високий інтерес аудиторії, позитивну увагу та помітний відгук з боку користувачів.',
        explanationHowToGet: 'статус надається профілям, які отримали сильну реакцію спільноти за переглядами, збереженнями, взаємодіями або іншими сигналами інтересу.'
    },
    {
        id: 'most_discussed',
        title: 'Найбільш обговорюваний профіль',
        description: 'Профіль, який згенерував найбільшу кількість змістовних дискусій у спільноті.',
        layerType: 'snapshot',
        assignmentType: 'algorithmic',
        rarity: 'common',
        icon: 'MessageCircle',
        displayPriority: 3,
        visibleInProfile: true,
        visibleInLegend: true,
        active: true,
        eligibleForHallOfFame: true
    },
    {
        id: 'return_magnet',
        title: 'Магніт повернень',
        description: 'Експерт із найвищим відсотком повторних сесій протягом кварталу.',
        layerType: 'seasonal',
        assignmentType: 'algorithmic',
        rarity: 'rare',
        icon: 'Repeat',
        displayPriority: 4,
        visibleInProfile: true,
        visibleInLegend: true,
        active: true,
        eligibleForHallOfFame: true
    },
    {
        id: 'season_breakthrough',
        title: 'Висхідна зірка',
        shortLabel: 'Зірка',
        description: 'Редакційна відзнака за найшвидший якісний ріст на платформі.',
        layerType: 'seasonal',
        assignmentType: 'editorial',
        rarity: 'rare',
        icon: 'TrendingUp',
        displayPriority: 2,
        visibleInProfile: true,
        visibleInLegend: true,
        active: true,
        eligibleForHallOfFame: true,
        explanationType: 'Сезонний статус розвитку',
        explanationReason: 'за швидкий ріст видимості та сильний прогрес у підкатегорії.',
        explanationHowToGet: 'статус отримують користувачі, які за короткий період показали помітний ривок у розвитку профілю, контенту або попиту на свої пропозиції.'
    },
    {
        id: 'subcategory_legend',
        title: 'Легенда року',
        shortLabel: 'Легенда',
        description: 'Найвища постійна нагорода за видатний багаторічний внесок у розвиток свого напряму.',
        layerType: 'permanent',
        assignmentType: 'editorial',
        rarity: 'unique',
        icon: 'Crown',
        displayPriority: 1,
        visibleInProfile: true,
        visibleInLegend: true,
        active: true,
        eligibleForHallOfFame: true,
        explanationType: 'Річна престижна відзнака',
        explanationReason: 'за особливо сильний внесок, впізнаваність та статус у своїй підкатегорії протягом року.',
        explanationHowToGet: 'відзнака присвоюється користувачам, які стали знаковими фігурами періоду та увійшли до Hall of Fame платформи.'
    },
    {
        id: 'platform_pick',
        title: 'Вибір платформи',
        description: 'Особлива відзнака від команди LECTOR за відповідність найвищим стандартам якості.',
        layerType: 'yearly',
        assignmentType: 'editorial',
        rarity: 'legendary',
        icon: 'Star',
        displayPriority: 3,
        visibleInProfile: true,
        visibleInLegend: true,
        active: true,
        eligibleForHallOfFame: true
    }
];

export const DEMO_SNAPSHOTS: SnapshotMetadata[] = [
    {
        snapshotId: 'snapshot-spring-2026',
        title: 'Spring 2026',
        snapshotType: 'seasonal',
        effectiveDate: '2026-04-01T00:00:00.000Z',
        periodLabel: 'Spring 2026',
        description: 'Офіційний зріз весняного сезону.',
        published: true,
        isDemo: true
    },
    {
        snapshotId: 'snapshot-yearly-2026',
        title: 'Yearly 2026',
        snapshotType: 'yearly',
        effectiveDate: '2026-01-01T00:00:00.000Z',
        periodLabel: 'Yearly 2026',
        description: 'Підсумкові відзнаки за попередній рік.',
        published: true,
        isDemo: true
    },
    {
        snapshotId: 'permanent',
        title: 'Permanent Database',
        snapshotType: 'yearly', // technically pseudo-snapshot 
        effectiveDate: '2020-01-01T00:00:00.000Z',
        periodLabel: 'Permanent',
        description: 'Системний шар для постійних маркерів',
        published: true,
        isDemo: true
    },
    {
        snapshotId: 'snapshot-winter-2025',
        title: 'Зима 2025',
        snapshotType: 'seasonal',
        effectiveDate: '2025-01-01T00:00:00.000Z',
        periodLabel: 'Зима 2025',
        description: 'Історичний зріз зимового сезону 2025 року.',
        published: true,
        isDemo: true
    }
];

export const DEMO_AWARD_RECORDS: StatusAwardRecord[] = [
    // TAROT (Таро) for usr1 (Super Mario)
    { id: 'rec_1', snapshotId: 'snapshot-spring-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'таро', awardDefinitionId: 'voice_of_season', level: 'winner', featuredOnProfile: true, tableSortOrder: 1, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400', isDemo: true },
    { id: 'rec_2', snapshotId: 'permanent', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'таро', awardDefinitionId: 'trust_symbol', level: 'honor', featuredOnProfile: true, tableSortOrder: 2, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400', isDemo: true },
    { id: 'rec_3', snapshotId: 'snapshot-spring-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'таро', awardDefinitionId: 'most_discussed', level: 'finalist', featuredOnProfile: true, tableSortOrder: 3, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400', isDemo: true },
    { id: 'rec_4', snapshotId: 'snapshot-spring-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'таро', awardDefinitionId: 'return_magnet', level: 'winner', featuredOnProfile: true, tableSortOrder: 4, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400', isDemo: true },
    { id: 'rec_5', snapshotId: 'snapshot-yearly-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'таро', awardDefinitionId: 'platform_pick', level: 'nominee', featuredOnProfile: true, tableSortOrder: 5, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400', isDemo: true },
    
    // TAROT Others Table entries (Not targeted at usr1)
    { id: 'rec_6', snapshotId: 'snapshot-spring-2026', userId: 'usr2', userDisplayName: 'Luigi Prophet', userHandle: '@luigi_p', subcategoryKey: 'таро', awardDefinitionId: 'voice_of_season', level: 'finalist', featuredOnProfile: false, tableSortOrder: 2, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isDemo: true },
    { id: 'rec_7', snapshotId: 'snapshot-spring-2026', userId: 'usr3', userDisplayName: 'Peach', userHandle: '@peach_tarot', subcategoryKey: 'таро', awardDefinitionId: 'most_discussed', level: 'winner', featuredOnProfile: false, tableSortOrder: 1, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isDemo: true },

    // HISTORICAL DATA (Winter 2025)
    { id: 'rec_hist_1', snapshotId: 'snapshot-winter-2025', userId: 'usr2', userDisplayName: 'Luigi Prophet', userHandle: '@luigi_p', subcategoryKey: 'таро', awardDefinitionId: 'voice_of_season', level: 'winner', featuredOnProfile: false, tableSortOrder: 1, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isDemo: true },
    { id: 'rec_hist_2', snapshotId: 'snapshot-winter-2025', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'таро', awardDefinitionId: 'season_breakthrough', level: 'winner', featuredOnProfile: false, tableSortOrder: 2, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400', isDemo: true },

    // ASTROLOGY
    { id: 'rec_8', snapshotId: 'snapshot-spring-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'астрологія', awardDefinitionId: 'season_breakthrough', level: 'winner', featuredOnProfile: true, tableSortOrder: 1, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400', isDemo: true },
    { id: 'rec_9', snapshotId: 'snapshot-spring-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'астрологія', awardDefinitionId: 'voice_of_season', level: 'nominee', featuredOnProfile: true, tableSortOrder: 2, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400', isDemo: true },

    // ESOTERICISM
    { id: 'rec_10', snapshotId: 'permanent', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'езотерика', awardDefinitionId: 'subcategory_legend', level: 'holder', featuredOnProfile: true, tableSortOrder: 1, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400', isDemo: true },
    { id: 'rec_11', snapshotId: 'snapshot-yearly-2026', userId: 'usr4', userDisplayName: 'Bowser Mystic', userHandle: '@bowser_dark', subcategoryKey: 'езотерика', awardDefinitionId: 'platform_pick', level: 'winner', featuredOnProfile: true, tableSortOrder: 2, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1550565118-3a14e8d0386f?auto=format&fit=crop&q=80&w=400', isDemo: true },
    { id: 'rec_12', snapshotId: 'snapshot-yearly-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'езотерика', awardDefinitionId: 'platform_pick', level: 'honor', featuredOnProfile: true, tableSortOrder: 3, archiveVisible: true, userAvatarUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400', isDemo: true }
];

import { HallOfFameEntry } from './types';

export const DEMO_HALL_OF_FAME_ENTRIES: HallOfFameEntry[] = [
    {
        id: 'hof_1',
        userId: 'usr1',
        userDisplayName: 'Super Mario',
        awardDefinitionId: 'subcategory_legend',
        snapshotId: 'permanent',
        subcategoryKey: 'езотерика',
        citation: 'За безпрецедентну відданість якості та фундаментальний внесок у розвиток таро-спільноти.',
        hallSection: 'legendary',
        featured: true,
        sortOrder: 1,
        isDemo: true
    },
    {
        id: 'hof_2',
        userId: 'usr4',
        userDisplayName: 'Bowser Mystic',
        awardDefinitionId: 'platform_pick',
        snapshotId: 'snapshot-yearly-2026',
        subcategoryKey: 'езотерика',
        titleOverride: 'Прорив року',
        citation: 'Найкращий результат року у сфері езотеричних практик за версією редакційної команди.',
        hallSection: 'yearly',
        featured: true,
        sortOrder: 1,
        isDemo: true
    },
    {
        id: 'hof_3',
        userId: 'usr1',
        userDisplayName: 'Super Mario',
        awardDefinitionId: 'voice_of_season',
        snapshotId: 'snapshot-winter-2025',
        subcategoryKey: 'таро',
        citation: 'Абсолютне лідерство за довірою користувачів протягом зимового сезону 2025.',
        hallSection: 'seasonal',
        featured: true,
        sortOrder: 1,
        isDemo: true
    },
    {
        id: 'hof_4',
        userId: 'usr2',
        userDisplayName: 'Luigi Prophet',
        awardDefinitionId: 'trust_symbol',
        snapshotId: 'permanent',
        subcategoryKey: 'таро',
        titleOverride: 'Символ стабільності',
        citation: 'Вибір платформи за стабільно високий рівень професійної етики.',
        hallSection: 'picks',
        featured: true,
        sortOrder: 1,
        isDemo: true
    }
];
