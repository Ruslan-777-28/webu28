import { DEMO_AWARD_DEFINITIONS, DEMO_SNAPSHOTS, DEMO_AWARD_RECORDS, DEMO_CONFIG, DEMO_HALL_OF_FAME_ENTRIES } from './demo-status-data';
import { LAYER_TYPE_LOCALE } from './constants';
import { 
    normalizeSubcategoryKey, 
    StatusAwardDefinition, 
    SnapshotMetadata, 
    StatusLegendGroup, 
    FormattedProfileAward, 
    FormattedStatusTableRow, 
    StatusLayerType, 
    FormattedHallOfFameEntry, 
    HallOfFameSection,
    StatusAwardRecord,
    HallOfFameEntry
} from './types';

/**
 * Returns the currently active global status snapshot.
 * In a live environment, this would query a settings document.
 */
export function getActiveStatusSnapshot(customSnapshots?: SnapshotMetadata[]): SnapshotMetadata | undefined {
    const source = customSnapshots || DEMO_SNAPSHOTS;
    // Default to a specific demo snapshot or the first published one
    return source.find(s => s.published) || source.find(s => s.snapshotId === 'snapshot-spring-2026');
}

/**
 * Retrieves all definitions.
 */
export function getStatusDefinitions(customDefinitions?: StatusAwardDefinition[]): StatusAwardDefinition[] {
    const source = customDefinitions || DEMO_AWARD_DEFINITIONS;
    return source.filter(def => def.active);
}

/**
 * Compiles legend groups by looking up all definitions and organizing them by Layer Type.
 */
export function getLegendGroups(customDefinitions?: StatusAwardDefinition[]): StatusLegendGroup[] {
    const definitions = getStatusDefinitions(customDefinitions).filter(d => d.visibleInLegend);
    const groups: Record<string, StatusLegendGroup> = {};

    const GROUP_ORDER: StatusLayerType[] = ['permanent', 'yearly', 'seasonal', 'snapshot'];
    const GROUP_DESCRIPTIONS: Record<StatusLayerType, string> = {
        permanent: 'Найвища форма визнання, яка назавжди залишається в профілі експерта.',
        yearly: 'Головні відзнаки року, що фіксують найкращі результати платформи.',
        seasonal: 'Динамічні нагороди, які оновлюються кожен сезон і стимулюють активність.',
        snapshot: 'Миттєві досягнення та фіксація рекордів у визначених періодах.'
    };

    GROUP_ORDER.forEach(layer => {
        const awardsInLayer = definitions
            .filter(def => def.layerType === layer)
            .sort((a, b) => (a.displayPriority || 99) - (b.displayPriority || 99));

        if (awardsInLayer.length > 0) {
            groups[layer] = {
                layerType: layer,
                title: LAYER_TYPE_LOCALE[layer],
                description: GROUP_DESCRIPTIONS[layer],
                definitions: awardsInLayer
            };
        }
    });

    return GROUP_ORDER.filter(layer => groups[layer]).map(layer => groups[layer]);
}

/**
 * Resolves all profile-featured awards for a specific user and subcategory.
 * Sorts by `profileSortOrder` first, then by the Definition's `displayPriority`.
 */
export function getProfileAwardsForSubcategory(
    userId: string, 
    subcategoryName?: string, 
    data?: { definitions?: StatusAwardDefinition[], records?: StatusAwardRecord[], snapshots?: SnapshotMetadata[] }
): FormattedProfileAward[] {
    const key = normalizeSubcategoryKey(subcategoryName);
    const definitions = getStatusDefinitions(data?.definitions);
    const recordsSource = data?.records || DEMO_AWARD_RECORDS;
    const snapshotsSource = data?.snapshots || DEMO_SNAPSHOTS;

    const awards = recordsSource
        .filter(rec => rec.userId === userId && rec.subcategoryKey === key && rec.featuredOnProfile)
        .map(rec => ({
            ...rec,
            periodLabel: snapshotsSource.find(s => s.snapshotId === rec.snapshotId)?.periodLabel || 'Permanent', 
            definition: definitions.find(d => d.id === rec.awardDefinitionId)
        }))
        .filter(rec => rec.definition && rec.definition.visibleInProfile) as FormattedProfileAward[];

    return awards.sort((a, b) => {
        const sortA = a.profileSortOrder ?? 999;
        const sortB = b.profileSortOrder ?? 999;
        if (sortA !== sortB) return sortA - sortB;
        return (a.definition?.displayPriority || 99) - (b.definition?.displayPriority || 99);
    });
}

/**
 * Resolves all active table rows for a given subcategory.
 * This pulls records that match the active snapshot AND records from the 'permanent' pseudo-snapshot.
 */
export function getStatusTableRowsForSubcategory(
    subcategoryName?: string,
    data?: { definitions?: StatusAwardDefinition[], records?: StatusAwardRecord[], snapshots?: SnapshotMetadata[] }
): FormattedStatusTableRow[] {
    const key = normalizeSubcategoryKey(subcategoryName);
    const definitions = getStatusDefinitions(data?.definitions);
    const snapshotsSource = data?.snapshots || DEMO_SNAPSHOTS;
    const recordsSource = data?.records || DEMO_AWARD_RECORDS;
    
    const activeSnapshot = getActiveStatusSnapshot(data?.snapshots);

    if (!activeSnapshot) return [];

    const allowedSnapshots = [activeSnapshot.snapshotId, 'permanent'];

    const rows = recordsSource
        .filter(rec => {
            const matchesSnapshot = allowedSnapshots.includes(rec.snapshotId);
            if (!matchesSnapshot) return false;
            if (!key || key === 'all' || key === 'усі') return true;
            return rec.subcategoryKey === key;
        })
        .map(rec => ({
            ...rec,
            periodLabel: snapshotsSource.find(s => s.snapshotId === rec.snapshotId)?.periodLabel || 'Permanent',
            definition: definitions.find(d => d.id === rec.awardDefinitionId)
        }))
        .filter(rec => rec.definition) as FormattedStatusTableRow[];

    return rows.sort((a, b) => {
        const sortA = a.tableSortOrder ?? 999;
        const sortB = b.tableSortOrder ?? 999;
        if (sortA !== sortB) return sortA - sortB;

        const prioA = a.definition?.displayPriority ?? 99;
        const prioB = b.definition?.displayPriority ?? 99;
        if (prioA !== prioB) return prioA - prioB;

        return a.userDisplayName.localeCompare(b.userDisplayName);
    });
}

/**
 * HALL OF FAME SELECTORS
 */

/**
 * Retrieves all Hall of Fame entries, joining with definitions and snapshot metadata.
 */
export function getHallOfFameEntries(
    data?: { definitions?: StatusAwardDefinition[], hofEntries?: HallOfFameEntry[], snapshots?: SnapshotMetadata[] }
): FormattedHallOfFameEntry[] {
    const definitions = getStatusDefinitions(data?.definitions);
    const hofSource = data?.hofEntries || DEMO_HALL_OF_FAME_ENTRIES;
    const snapshotsSource = data?.snapshots || DEMO_SNAPSHOTS;
    
    return hofSource
        .map(entry => ({
            ...entry,
            definition: definitions.find(d => d.id === entry.awardDefinitionId),
            snapshot: snapshotsSource.find(s => s.snapshotId === entry.snapshotId)
        }))
        .filter(entry => !!entry.definition) as FormattedHallOfFameEntry[];
}

/**
 * Returns Hall of Fame entries grouped by their designated sections.
 */
export function getHallOfFameGroupedBySection(
    data?: { definitions?: StatusAwardDefinition[], hofEntries?: HallOfFameEntry[], snapshots?: SnapshotMetadata[] }
): Record<HallOfFameSection, FormattedHallOfFameEntry[]> {
    const entries = getHallOfFameEntries(data);
    const grouped: Record<HallOfFameSection, FormattedHallOfFameEntry[]> = {
        legendary: [],
        yearly: [],
        seasonal: [],
        picks: []
    };

    entries.forEach(entry => {
        if (grouped[entry.hallSection]) {
            grouped[entry.hallSection].push(entry);
        }
    });

    // Sort within sections if sortOrder is provided
    Object.keys(grouped).forEach(key => {
        const section = key as HallOfFameSection;
        grouped[section].sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return grouped;
}

/**
 * ARCHIVE SELECTORS
 */

/**
 * Retrieves all published snapshots for the archive.
 */
export function getArchiveSnapshots(customSnapshots?: SnapshotMetadata[]): SnapshotMetadata[] {
    const source = customSnapshots || DEMO_SNAPSHOTS;
    return source
        .filter(s => s.published && s.snapshotId !== 'permanent')
        .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
}

/**
 * Retrieves all award records for a specific historical snapshot.
 */
export function getArchiveSnapshotEntries(
    snapshotId: string,
    data?: { definitions?: StatusAwardDefinition[], records?: StatusAwardRecord[], snapshots?: SnapshotMetadata[] }
): FormattedStatusTableRow[] {
    const definitions = getStatusDefinitions(data?.definitions);
    const snapshotsSource = data?.snapshots || DEMO_SNAPSHOTS;
    const recordsSource = data?.records || DEMO_AWARD_RECORDS;
    
    const snapshot = snapshotsSource.find(s => s.snapshotId === snapshotId);
    
    if (!snapshot) return [];

    return recordsSource
        .filter(rec => rec.snapshotId === snapshotId && rec.archiveVisible)
        .map(rec => ({
            ...rec,
            periodLabel: snapshot.periodLabel,
            definition: definitions.find(d => d.id === rec.awardDefinitionId)
        }))
        .filter(rec => !!rec.definition)
        .sort((a, b) => (a.tableSortOrder ?? 99) - (b.tableSortOrder ?? 99)) as FormattedStatusTableRow[];
}

/**
 * Helper to get the Demo target user ID.
 */
export function getDemoTargetUserId(): string {
    return DEMO_CONFIG.demoProfileTargetId;
}
