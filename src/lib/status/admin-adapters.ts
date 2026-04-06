import { StatusAwardDefinition, SnapshotMetadata, StatusAwardRecord, HallOfFameEntry } from './types';
import { DefinitionFormValues, SnapshotFormValues, RecordFormValues, HofEntryFormValues } from './admin-schemas';

/**
 * Adapters to bridge the gap between Form State (Zod-validated) 
 * and the Core Status Domain Types.
 */
export const StatusAdminAdapters = {
  definition: {
    toForm: (d: StatusAwardDefinition): DefinitionFormValues => ({
      ...d,
      shortLabel: d.shortLabel || '',
      eligibleForHallOfFame: d.eligibleForHallOfFame ?? false,
    }),
    fromForm: (v: DefinitionFormValues): StatusAwardDefinition => ({
      ...v,
      shortLabel: v.shortLabel || undefined,
    }),
  },
  
  snapshot: {
    toForm: (s: SnapshotMetadata): SnapshotFormValues => ({
      ...s,
    }),
    fromForm: (v: SnapshotFormValues): SnapshotMetadata => ({
      ...v,
    }),
  },
  
  record: {
    toForm: (r: StatusAwardRecord): RecordFormValues => ({
        ...r,
        userHandle: r.userHandle || '',
        categoryKey: r.categoryKey || '',
        level: r.level || '',
        note: r.note || '',
        profileSortOrder: r.profileSortOrder ?? undefined,
        tableSortOrder: r.tableSortOrder ?? undefined,
        archiveVisible: r.archiveVisible ?? true,
    }),
    fromForm: (v: RecordFormValues): StatusAwardRecord => ({
        ...v,
        userHandle: v.userHandle || undefined,
        categoryKey: v.categoryKey || undefined,
        level: v.level === '' ? undefined : v.level as any,
        note: v.note || undefined,
        profileSortOrder: v.profileSortOrder,
        tableSortOrder: v.tableSortOrder,
        archiveVisible: v.archiveVisible,
    }),
  },

  
  hofEntry: {
    toForm: (h: HallOfFameEntry): HofEntryFormValues => ({
      ...h,
      titleOverride: h.titleOverride || '',
    }),
    fromForm: (v: HofEntryFormValues): HallOfFameEntry => ({
      ...v,
      titleOverride: v.titleOverride || undefined,
    }),
  }
};
