import { 
    StatusAwardDefinition, 
    SnapshotMetadata, 
    StatusAwardRecord, 
    FormattedHallOfFameEntry, 
    FormattedStatusTableRow,
    HallOfFameEntry 
} from './types';
import { 
    DEMO_AWARD_DEFINITIONS, 
    DEMO_SNAPSHOTS, 
    DEMO_AWARD_RECORDS, 
    DEMO_HALL_OF_FAME_ENTRIES 
} from './demo-status-data';
import { 
    getProfileAwardsForSubcategory, 
    getStatusTableRowsForSubcategory, 
    getHallOfFameEntries, 
    getArchiveSnapshotEntries 
} from './selectors';

/**
 * Summary metrics for the Admin Dashboard.
 * Supports taking a custom data set to reflect "live" unsaved admin changes.
 */
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

export function getStatusAdminSummary(data?: {
    definitions?: StatusAwardDefinition[],
    snapshots?: SnapshotMetadata[],
    records?: StatusAwardRecord[],
    hofEntries?: HallOfFameEntry[]
}): AdminStatusSummary {
    const definitions = data?.definitions || DEMO_AWARD_DEFINITIONS;
    const snapshots = data?.snapshots || DEMO_SNAPSHOTS;
    const records = data?.records || DEMO_AWARD_RECORDS;
    const hofEntries = data?.hofEntries || DEMO_HALL_OF_FAME_ENTRIES;

    const uniqueUsers = new Set(records.map(r => r.userId));
    const uniqueSubcategories = new Set(records.map(r => r.subcategoryKey));
    
    // Look for published or a specific demo default
    const activeSnapshotId = snapshots.find(s => s.published)?.snapshotId 
        || snapshots.find(s => s.snapshotId === 'snapshot-spring-2026')?.snapshotId 
        || 'none';

    return {
        definitionsCount: definitions.length,
        snapshotsCount: snapshots.length,
        recordsCount: records.length,
        uniqueUsersCount: uniqueUsers.size,
        uniqueSubcategoriesCount: uniqueSubcategories.size,
        hofEntriesCount: hofEntries.length,
        archiveSnapshotsCount: snapshots.filter(s => s.snapshotId !== 'permanent').length,
        activeDefaultSnapshotId: activeSnapshotId
    };
}

/**
 * Resolved records for the Admin list view (Inspector tab).
 */
export type AdminStatusRecordResolved = StatusAwardRecord & {
    resolvedTitle: string;
    resolvedLayer: string;
};

export function getStatusRecordsAdminRows(
    records?: StatusAwardRecord[], 
    definitions?: StatusAwardDefinition[]
): AdminStatusRecordResolved[] {
    const rSource = records || DEMO_AWARD_RECORDS;
    const dSource = definitions || DEMO_AWARD_DEFINITIONS;

    return rSource.map(record => {
        const def = dSource.find(d => d.id === record.awardDefinitionId);
        return {
            ...record,
            resolvedTitle: def?.title || 'Unknown Definition',
            resolvedLayer: def?.layerType || 'unknown'
        };
    });
}

/**
 * PREVIEW SELECTORS
 * These functions bridge the Admin layer with the Public Selector Logic.
 */

/**
 * Simulates the Profile Shelf content with potential live admin edits.
 */
export function getProfileShelfPreview(
    userId: string, 
    subcategoryKey: string,
    data?: { definitions?: StatusAwardDefinition[], records?: StatusAwardRecord[], snapshots?: SnapshotMetadata[] }
) {
    return getProfileAwardsForSubcategory(userId, subcategoryKey, data);
}

/**
 * Simulates the Status Table content with potential live admin edits.
 */
export function getStatusTablePreview(
    subcategoryKey: string,
    data?: { definitions?: StatusAwardDefinition[], records?: StatusAwardRecord[], snapshots?: SnapshotMetadata[] }
) {
    return getStatusTableRowsForSubcategory(subcategoryKey, data);
}

/**
 * Resolves Hall of Fame entries for the Admin preview table.
 */
export function getHallOfFameAdminRows(
    data?: { definitions?: StatusAwardDefinition[], hofEntries?: HallOfFameEntry[], snapshots?: SnapshotMetadata[] }
): FormattedHallOfFameEntry[] {
    return getHallOfFameEntries(data);
}

/**
 * Resolves Snapshot records for the Archive preview tab.
 */
export function getArchiveSnapshotPreview(
    snapshotId: string,
    data?: { definitions?: StatusAwardDefinition[], records?: StatusAwardRecord[], snapshots?: SnapshotMetadata[] }
): FormattedStatusTableRow[] {
    return getArchiveSnapshotEntries(snapshotId, data);
}
