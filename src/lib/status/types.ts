export type StatusLayerType = 'permanent' | 'seasonal' | 'yearly' | 'snapshot';
export type StatusAssignmentType = 'algorithmic' | 'hybrid' | 'editorial';
export type StatusAwardLevel = 'nominee' | 'finalist' | 'winner' | 'honor';
export type StatusRarity = 'common' | 'rare' | 'legendary' | 'unique';

export type StatusAwardDefinition = {
    id: string;
    title: string;
    shortLabel?: string;
    description: string;
    layerType: StatusLayerType;
    assignmentType: StatusAssignmentType;
    rarity: StatusRarity;
    icon: string;
    displayPriority: number; // 1 is highest priority
    visibleInProfile: boolean;
    visibleInLegend: boolean;
    active: boolean; // Definition state overall
    eligibleForHallOfFame?: boolean; // Can entries with this definition be in HoF?
    
    // Explanation fields for info-layer
    explanationType?: string;
    explanationReason?: string;
    explanationHowToGet?: string;
};

export type SnapshotType = 'monthly' | 'seasonal' | 'yearly';

export type SnapshotMetadata = {
    snapshotId: string;
    title: string;
    snapshotType: SnapshotType;
    effectiveDate: string; // ISO String
    periodLabel: string;
    description: string;
    published: boolean;
    isDemo: boolean;
};

export type StatusAwardRecord = {
    id: string;
    snapshotId: string;
    userId: string;
    userDisplayName: string;
    userHandle?: string;
    categoryKey?: string;
    subcategoryKey: string;
    awardDefinitionId: string;
    level?: StatusAwardLevel | 'holder';
    featuredOnProfile: boolean; // Should this show on the shelf?
    profileSortOrder?: number; // Custom sort precedence within profile
    tableSortOrder?: number; // Custom sort precedence within table
    note?: string;
    archiveVisible?: boolean; // Should this record be visible in historical archives?
    userAvatarUrl?: string; // Denormalized for display in tables
    isDemo: boolean;
};

export type HallOfFameSection = 'legendary' | 'yearly' | 'seasonal' | 'picks';

export type HallOfFameEntry = {
    id: string;
    userId: string;
    userDisplayName: string;
    awardDefinitionId: string;
    snapshotId: string;
    subcategoryKey: string;
    titleOverride?: string;
    citation: string; // The reason for being in HoF
    hallSection: HallOfFameSection;
    featured: boolean;
    sortOrder: number;
    isDemo: boolean;
};

// Extracted record type for formatting outputs correctly in selectors
export type FormattedProfileAward = StatusAwardRecord & {
    definition: StatusAwardDefinition;
    periodLabel: string;
};

export type FormattedStatusTableRow = StatusAwardRecord & {
    definition: StatusAwardDefinition;
    periodLabel: string;
};

export type FormattedHallOfFameEntry = HallOfFameEntry & {
    definition: StatusAwardDefinition;
    snapshot?: SnapshotMetadata;
};

export type StatusLegendGroup = {
    layerType: StatusLayerType;
    title: string;
    description: string;
    definitions: StatusAwardDefinition[];
};

export function normalizeSubcategoryKey(name?: string): string {
    if (!name) return '';
    const val = name.trim().toLowerCase();
    
    // Map English strings back to demo backend keys
    if (val === 'tarot') return 'таро';
    if (val === 'astrology') return 'астрологія';
    if (val === 'mentors') return 'наставники';
    if (val === 'esotericism' || val === 'esoteric') return 'езотерика';
    
    return val;
}
