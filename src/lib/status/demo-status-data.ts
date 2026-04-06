import { StatusAwardDefinition, SnapshotMetadata, StatusAwardRecord } from './types';

// Used in selectors to simulate the default target profile
export const DEMO_CONFIG = {
    demoProfileTargetId: 'usr1' // Translates to Super маріо from previous setup
};

export const DEMO_AWARD_DEFINITIONS: StatusAwardDefinition[] = [
    {
        id: 'voice_of_season',
        title: 'Голос сезону',
        shortLabel: 'Голос',
        description: 'Найбільш впливовий експерт сезону за алгоритмічними показниками активності та залученості.',
        layerType: 'seasonal',
        assignmentType: 'algorithmic',
        rarity: 'rare',
        icon: 'Mic',
        displayPriority: 2,
        visibleInProfile: true,
        visibleInLegend: true,
        active: true
    },
    {
        id: 'trust_symbol',
        title: 'Символ довіри',
        shortLabel: 'Довіра',
        description: 'Присвоюється за виняткову кількість позитивних відгуків та високий рівень утримання.',
        layerType: 'permanent',
        assignmentType: 'hybrid',
        rarity: 'legendary',
        icon: 'Shield',
        displayPriority: 1,
        visibleInProfile: true,
        visibleInLegend: true,
        active: true
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
        active: true
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
        active: true
    },
    {
        id: 'season_breakthrough',
        title: 'Прорив сезону',
        description: 'Редакційна відзнака за найшвидший якісний ріст на платформі.',
        layerType: 'seasonal',
        assignmentType: 'editorial',
        rarity: 'rare',
        icon: 'TrendingUp',
        displayPriority: 2,
        visibleInProfile: true,
        visibleInLegend: true,
        active: true
    },
    {
        id: 'subcategory_legend',
        title: 'Легенда підкатегорії',
        description: 'Найвища постійна нагорода за видатний багаторічний внесок у розвиток свого напряму.',
        layerType: 'permanent',
        assignmentType: 'editorial',
        rarity: 'unique',
        icon: 'Crown',
        displayPriority: 1,
        visibleInProfile: true,
        visibleInLegend: true,
        active: true
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
        active: true
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
    }
];

export const DEMO_AWARD_RECORDS: StatusAwardRecord[] = [
    // TAROT (Таро) for usr1 (Super Mario)
    { id: 'rec_1', snapshotId: 'snapshot-spring-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'таро', awardDefinitionId: 'voice_of_season', level: 'winner', featuredOnProfile: true, tableSortOrder: 1, isDemo: true },
    { id: 'rec_2', snapshotId: 'permanent', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'таро', awardDefinitionId: 'trust_symbol', level: 'honor', featuredOnProfile: true, tableSortOrder: 2, isDemo: true },
    { id: 'rec_3', snapshotId: 'snapshot-spring-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'таро', awardDefinitionId: 'most_discussed', level: 'finalist', featuredOnProfile: true, tableSortOrder: 3, isDemo: true },
    { id: 'rec_4', snapshotId: 'snapshot-spring-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'таро', awardDefinitionId: 'return_magnet', level: 'winner', featuredOnProfile: true, tableSortOrder: 4, isDemo: true },
    { id: 'rec_5', snapshotId: 'snapshot-yearly-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'таро', awardDefinitionId: 'platform_pick', level: 'nominee', featuredOnProfile: true, tableSortOrder: 5, isDemo: true },
    
    // TAROT Others Table entries (Not targeted at usr1)
    { id: 'rec_6', snapshotId: 'snapshot-spring-2026', userId: 'usr2', userDisplayName: 'Luigi Prophet', userHandle: '@luigi_p', subcategoryKey: 'таро', awardDefinitionId: 'voice_of_season', level: 'finalist', featuredOnProfile: false, tableSortOrder: 2, isDemo: true },
    { id: 'rec_7', snapshotId: 'snapshot-spring-2026', userId: 'usr3', userDisplayName: 'Peach', userHandle: '@peach_tarot', subcategoryKey: 'таро', awardDefinitionId: 'most_discussed', level: 'winner', featuredOnProfile: false, tableSortOrder: 1, isDemo: true },

    // ASTROLOGY
    { id: 'rec_8', snapshotId: 'snapshot-spring-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'астрологія', awardDefinitionId: 'season_breakthrough', level: 'winner', featuredOnProfile: true, tableSortOrder: 1, isDemo: true },
    { id: 'rec_9', snapshotId: 'snapshot-spring-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'астрологія', awardDefinitionId: 'voice_of_season', level: 'nominee', featuredOnProfile: true, tableSortOrder: 2, isDemo: true },

    // ESOTERICISM
    { id: 'rec_10', snapshotId: 'permanent', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'езотерика', awardDefinitionId: 'subcategory_legend', level: 'holder', featuredOnProfile: true, tableSortOrder: 1, isDemo: true },
    { id: 'rec_11', snapshotId: 'snapshot-yearly-2026', userId: 'usr4', userDisplayName: 'Bowser Mystic', userHandle: '@bowser_dark', subcategoryKey: 'езотерика', awardDefinitionId: 'platform_pick', level: 'winner', featuredOnProfile: true, tableSortOrder: 2, isDemo: true },
    { id: 'rec_12', snapshotId: 'snapshot-yearly-2026', userId: 'usr1', userDisplayName: 'Super Mario', userHandle: '@supermario', subcategoryKey: 'езотерика', awardDefinitionId: 'platform_pick', level: 'honor', featuredOnProfile: true, tableSortOrder: 3, isDemo: true }
];
