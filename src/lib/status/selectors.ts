import { DEMO_AWARD_DEFINITIONS, DEMO_SNAPSHOTS, DEMO_AWARD_RECORDS, DEMO_CONFIG, DEMO_HALL_OF_FAME_ENTRIES } from './demo-status-data';
import { LAYER_TYPE_LOCALE } from './constants';
import { normalizeSubcategoryKey, StatusAwardDefinition, SnapshotMetadata, StatusLegendGroup, FormattedProfileAward, FormattedStatusTableRow, StatusLayerType, FormattedHallOfFameEntry, HallOfFameSection } from './types';

/**
 * Returns the currently active global status snapshot.
 * In a live environment, this would query a settings document.
 */
export function getActiveStatusSnapshot(): SnapshotMetadata | undefined {
    // For V1 Demo, we default to Spring 2026 as the active snapshot
    return DEMO_SNAPSHOTS.find(s => s.snapshotId === 'snapshot-spring-2026');
}

/**
 * Retrieves all definitions.
 */
export function getStatusDefinitions(): StatusAwardDefinition[] {
    return DEMO_AWARD_DEFINITIONS.filter(def => def.active);
}

/**
 * Compiles legend groups by looking up all definitions and organizing them by Layer Type.
 */
export function getLegendGroups(): StatusLegendGroup[] {
    const definitions = getStatusDefinitions().filter(d => d.visibleInLegend);
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
export function getProfileAwardsForSubcategory(userId: string, subcategoryName?: string): FormattedProfileAward[] {
    const key = normalizeSubcategoryKey(subcategoryName);
    const definitions = getStatusDefinitions();

    const awards = DEMO_AWARD_RECORDS
        .filter(rec => rec.userId === userId && rec.subcategoryKey === key && rec.featuredOnProfile)
        .map(rec => ({
            ...rec,
            // Fallback periodLabel to the snapshot metadata, or "Permanent"
            periodLabel: DEMO_SNAPSHOTS.find(s => s.snapshotId === rec.snapshotId)?.periodLabel || 'Permanent', 
            definition: definitions.find(d => d.id === rec.awardDefinitionId)
        }))
        .filter(rec => rec.definition && rec.definition.visibleInProfile) as FormattedProfileAward[];

    return awards.sort((a, b) => {
        const sortA = a.profileSortOrder ?? 999;
        const sortB = b.profileSortOrder ?? 999;
        if (sortA !== sortB) return sortA - sortB;
        return (a.definition.displayPriority || 99) - (b.definition.displayPriority || 99);
    });
}

/**
 * Resolves all active table rows for a given subcategory.
 * This pulls records that match the active snapshot AND records from the 'permanent' pseudo-snapshot.
 * Sorts by tableSortOrder, displayPriority, and then userDisplayName.
 */
export function getStatusTableRowsForSubcategory(subcategoryName?: string): FormattedStatusTableRow[] {
    const key = normalizeSubcategoryKey(subcategoryName);
    const definitions = getStatusDefinitions();
    const activeSnapshot = getActiveStatusSnapshot();

    if (!activeSnapshot) return [];

    const allowedSnapshots = [activeSnapshot.snapshotId, 'permanent'];

    const rows = DEMO_AWARD_RECORDS
        .filter(rec => rec.subcategoryKey === key && allowedSnapshots.includes(rec.snapshotId))
        .map(rec => ({
            ...rec,
            periodLabel: DEMO_SNAPSHOTS.find(s => s.snapshotId === rec.snapshotId)?.periodLabel || 'Permanent',
            definition: definitions.find(d => d.id === rec.awardDefinitionId)
        }))
        .filter(rec => rec.definition) as FormattedStatusTableRow[];

    return rows.sort((a, b) => {
        const sortA = a.tableSortOrder ?? 999;
        const sortB = b.tableSortOrder ?? 999;
        if (sortA !== sortB) return sortA - sortB;

        const prioA = a.definition.displayPriority ?? 99;
        const prioB = b.definition.displayPriority ?? 99;
        if (prioA !== prioB) return prioA - prioB;

        return a.userDisplayName.localeCompare(b.userDisplayName);
    });
}

/**
 * Helper to get the Demo target user ID so components don't hardcode it.
 */
export function getDemoTargetUserId(): string {
    return DEMO_CONFIG.demoProfileTargetId;
}

/**
 * HALL OF FAME SELECTORS
 */

/**
 * Retrieves all Hall of Fame entries, joining with definitions and snapshot metadata.
 */
export function getHallOfFameEntries(): FormattedHallOfFameEntry[] {
    const definitions = getStatusDefinitions();
    
    return DEMO_HALL_OF_FAME_ENTRIES
        .map(entry => ({
            ...entry,
            definition: definitions.find(d => d.id === entry.awardDefinitionId),
            snapshot: DEMO_SNAPSHOTS.find(s => s.snapshotId === entry.snapshotId)
        }))
        .filter(entry => !!entry.definition) as FormattedHallOfFameEntry[];
}

/**
 * Returns Hall of Fame entries grouped by their designated sections.
 */
export function getHallOfFameGroupedBySection(): Record<HallOfFameSection, FormattedHallOfFameEntry[]> {
    const entries = getHallOfFameEntries();
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
 * Retrieves all published snapshots for the archive, excluding the internal 'permanent' layer.
 * Sorted by effective date descending (newest first).
 */
export function getArchiveSnapshots(): SnapshotMetadata[] {
    return DEMO_SNAPSHOTS
        .filter(s => s.published && s.snapshotId !== 'permanent')
        .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
}

/**
 * Retrieves all award records for a specific historical snapshot that are marked as archive-visible.
 */
export function getArchiveSnapshotEntries(snapshotId: string): FormattedStatusTableRow[] {
    const definitions = getStatusDefinitions();
    const snapshot = DEMO_SNAPSHOTS.find(s => s.snapshotId === snapshotId);
    
    if (!snapshot) return [];

    return DEMO_AWARD_RECORDS
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
 * Groups archive entries by their subcategory for better structured presentation.
 */
export function getArchiveGroupedBySubcategory(snapshotId: string): Record<string, FormattedStatusTableRow[]> {
    const entries = getArchiveSnapshotEntries(snapshotId);
    const grouped: Record<string, FormattedStatusTableRow[]> = {};

    entries.forEach(entry => {
        const key = entry.subcategoryKey || 'general';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(entry);
    });

    return grouped;
}
