import { StatusAwardDefinition, SnapshotMetadata, StatusAwardRecord, FormattedHallOfFameEntry, FormattedStatusTableRow } from './types';
import { DEMO_AWARD_DEFINITIONS, DEMO_SNAPSHOTS, DEMO_AWARD_RECORDS, DEMO_HALL_OF_FAME_ENTRIES } from './demo-status-data';
import { getProfileAwardsForSubcategory, getStatusTableRowsForSubcategory, getHallOfFameEntries, getArchiveSnapshotEntries } from './selectors';

export interface AdminStatusSummary {
    definitionsCount: number;
    snapshotsCount: number;
    recordsCount: number;
    uniqueUsersCount: number;
    uniqueSubcategoriesCount: number;
    hofEntriesCount: number;
    archiveSnapshotsCount: number;
    activeDefaultSnapshotId: string;
}

export function getStatusAdminSummary(): AdminStatusSummary {
    const uniqueUsers = new Set(DEMO_AWARD_RECORDS.map(r => r.userId));
    const uniqueSubcategories = new Set(DEMO_AWARD_RECORDS.map(r => r.subcategoryKey));
    
    // Derived from the active snapshot definition in the main selector
    const activeSnapshotId = DEMO_SNAPSHOTS.find(s => s.snapshotId === 'snapshot-spring-2026')?.snapshotId || 'none';

    return {
        definitionsCount: DEMO_AWARD_DEFINITIONS.length,
        snapshotsCount: DEMO_SNAPSHOTS.length,
        recordsCount: DEMO_AWARD_RECORDS.length,
        uniqueUsersCount: uniqueUsers.size,
        uniqueSubcategoriesCount: uniqueSubcategories.size,
        hofEntriesCount: DEMO_HALL_OF_FAME_ENTRIES.length,
        archiveSnapshotsCount: DEMO_SNAPSHOTS.filter(s => s.snapshotId !== 'permanent').length,
        activeDefaultSnapshotId: activeSnapshotId
    };
}

export function getStatusDefinitionsAdminRows(): StatusAwardDefinition[] {
    // Return all, preserving exact config parameters, without hiding inactive ones unlike public API
    return [...DEMO_AWARD_DEFINITIONS].sort((a, b) => (a.displayPriority || 99) - (b.displayPriority || 99));
}

export function getStatusSnapshotsAdminRows(): SnapshotMetadata[] {
    return [...DEMO_SNAPSHOTS];
}

export type AdminStatusRecordResolved = StatusAwardRecord & {
    resolvedTitle: string;
    resolvedLayer: string;
};

export function getStatusRecordsAdminRows(): AdminStatusRecordResolved[] {
    return DEMO_AWARD_RECORDS.map(record => {
        const def = DEMO_AWARD_DEFINITIONS.find(d => d.id === record.awardDefinitionId);
        return {
            ...record,
            resolvedTitle: def?.title || 'Unknown Definition',
            resolvedLayer: def?.layerType || 'unknown'
        };
    });
}

// Passthroughs to existing logic (for the inspector logic test previews)
export function getProfileShelfPreview(userId: string, subcategoryKey: string) {
    return getProfileAwardsForSubcategory(userId, subcategoryKey);
}

export function getStatusTablePreview(subcategoryKey: string) {
    return getStatusTableRowsForSubcategory(subcategoryKey);
}

export function getHallOfFameAdminRows(): FormattedHallOfFameEntry[] {
    return getHallOfFameEntries();
}

export function getArchiveSnapshotPreview(snapshotId: string): FormattedStatusTableRow[] {
    return getArchiveSnapshotEntries(snapshotId);
}
