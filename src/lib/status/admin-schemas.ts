import { z } from 'zod';

/**
 * Validates Status Award Definition.
 */
export const definitionSchema = z.object({
    id: z.string().min(1, "ID is required"),
    title: z.string().min(1, "Title is required"),
    shortLabel: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    layerType: z.enum(['permanent', 'seasonal', 'yearly', 'snapshot']),
    assignmentType: z.enum(['algorithmic', 'hybrid', 'editorial']),
    rarity: z.enum(['common', 'rare', 'legendary', 'unique']),
    icon: z.string().min(1, "Icon name is required"),
    displayPriority: z.number().int().default(99),
    visibleInProfile: z.boolean().default(true),
    visibleInLegend: z.boolean().default(true),
    active: z.boolean().default(true),
    eligibleForHallOfFame: z.boolean().default(false),
});

/**
 * Validates Status Snapshot Metadata.
 */
export const snapshotSchema = z.object({
    snapshotId: z.string().min(1, "ID is required"),
    title: z.string().min(1, "Title is required"),
    snapshotType: z.enum(['monthly', 'seasonal', 'yearly']),
    effectiveDate: z.string().min(1, "Effective date is required"),
    periodLabel: z.string().min(1, "Period label is required"),
    description: z.string().min(1, "Description is required"),
    published: z.boolean().default(false),
    isDemo: z.boolean().default(true),
});

/**
 * Validates Status Award Record.
 */
export const recordSchema = z.object({
    id: z.string().min(1, "ID is required"),
    userId: z.string().min(1, "User ID is required"),
    userDisplayName: z.string().min(1, "User display name is required"),
    userHandle: z.string().optional(),
    categoryKey: z.string().optional(),
    subcategoryKey: z.string().min(1, "Subcategory key is required"),
    awardDefinitionId: z.string().min(1, "Definition ID is required"),
    snapshotId: z.string().min(1, "Snapshot ID is required"),
    level: z.enum(['nominee', 'finalist', 'winner', 'honor', 'holder']).optional().or(z.literal('')),
    featuredOnProfile: z.boolean().default(true),
    archiveVisible: z.boolean().default(true),
    profileSortOrder: z.number().int().optional(),
    tableSortOrder: z.number().int().optional(),
    note: z.string().optional(),
    assignedAt: z.number().int(),
    isDemo: z.boolean().default(true),
});

/**
 * Validates Hall of Fame Entry.
 */
export const hofEntrySchema = z.object({
    id: z.string().min(1, "ID is required"),
    userId: z.string().min(1, "User ID is required"),
    userDisplayName: z.string().min(1, "User display name is required"),
    awardDefinitionId: z.string().min(1, "Definition ID is required"),
    snapshotId: z.string().min(1, "Snapshot ID is required"),
    subcategoryKey: z.string().min(1, "Subcategory key is required"),
    titleOverride: z.string().optional(),
    citation: z.string().min(1, "Citation is required"),
    hallSection: z.enum(['legendary', 'yearly', 'seasonal', 'picks']),
    featured: z.boolean().default(true),
    sortOrder: z.number().int().default(99),
    isDemo: z.boolean().default(true),
});

export type DefinitionFormValues = z.infer<typeof definitionSchema>;
export type SnapshotFormValues = z.infer<typeof snapshotSchema>;
export type RecordFormValues = z.infer<typeof recordSchema>;
export type HofEntryFormValues = z.infer<typeof hofEntrySchema>;
