import { normalizeSubcategoryKey, StatusAwardDefinition, SnapshotMetadata, StatusLegendGroup, FormattedProfileAward, FormattedStatusTableRow, StatusLayerType } from './types';
import { DEMO_AWARD_DEFINITIONS, DEMO_SNAPSHOTS, DEMO_AWARD_RECORDS, DEMO_CONFIG } from './demo-status-data';
import { LAYER_TYPE_LOCALE } from './constants';

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
