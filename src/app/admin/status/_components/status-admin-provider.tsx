'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatusAwardDefinition, SnapshotMetadata, StatusAwardRecord, HallOfFameEntry } from '@/lib/status/types';
import { 
    DEMO_AWARD_DEFINITIONS, 
    DEMO_SNAPSHOTS, 
    DEMO_AWARD_RECORDS, 
    DEMO_HALL_OF_FAME_ENTRIES 
} from '@/lib/status/demo-status-data';
import { useToast } from '@/hooks/use-toast';

interface StatusAdminContextType {
    definitions: StatusAwardDefinition[];
    snapshots: SnapshotMetadata[];
    records: StatusAwardRecord[];
    hofEntries: HallOfFameEntry[];

    saveDefinition: (d: StatusAwardDefinition) => void;
    deleteDefinition: (id: string) => void;
    
    saveSnapshot: (s: SnapshotMetadata) => void;
    deleteSnapshot: (id: string) => void;

    saveRecord: (r: StatusAwardRecord) => void;
    deleteRecord: (id: string) => void;

    saveHofEntry: (h: HallOfFameEntry) => void;
    deleteHofEntry: (id: string) => void;

    resetToDemo: () => void;
    exportJson: () => void;
    importJson: (json: string) => void;
    
    hasEdits: boolean;
    isInitialized: boolean;
}

const StatusAdminContext = createContext<StatusAdminContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'lector_admin_status_state_v1';

/**
 * Provides the local editable state for the Status Admin layer.
 * Persists to localStorage to ensure work is not lost on refresh.
 */
export function StatusAdminProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const [definitions, setDefinitions] = useState<StatusAwardDefinition[]>([]);
    const [snapshots, setSnapshots] = useState<SnapshotMetadata[]>([]);
    const [records, setRecords] = useState<StatusAwardRecord[]>([]);
    const [hofEntries, setHofEntries] = useState<HallOfFameEntry[]>([]);
    const [hasEdits, setHasEdits] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial Load
    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                setDefinitions(data.definitions || []);
                setSnapshots(data.snapshots || []);
                setRecords(data.records || []);
                setHofEntries(data.hofEntries || []);
                setHasEdits(true);
            } catch (e) {
                console.error("Failed to load stored state:", e);
                setDefinitions([...DEMO_AWARD_DEFINITIONS]);
                setSnapshots([...DEMO_SNAPSHOTS]);
                setRecords([...DEMO_AWARD_RECORDS]);
                setHofEntries([...DEMO_HALL_OF_FAME_ENTRIES]);
            }
        } else {
            setDefinitions([...DEMO_AWARD_DEFINITIONS]);
            setSnapshots([...DEMO_SNAPSHOTS]);
            setRecords([...DEMO_AWARD_RECORDS]);
            setHofEntries([...DEMO_HALL_OF_FAME_ENTRIES]);
        }
        setIsInitialized(true);
    }, []);

    // Sync to localStorage
    useEffect(() => {
        if (!isInitialized) return;
        const data = { definitions, snapshots, records, hofEntries };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        
        // Check for edits vs Demo source
        const isDefault = 
            JSON.stringify(definitions) === JSON.stringify(DEMO_AWARD_DEFINITIONS) &&
            JSON.stringify(snapshots) === JSON.stringify(DEMO_SNAPSHOTS) &&
            JSON.stringify(records) === JSON.stringify(DEMO_AWARD_RECORDS) &&
            JSON.stringify(hofEntries) === JSON.stringify(DEMO_HALL_OF_FAME_ENTRIES);
            
        setHasEdits(!isDefault);
    }, [definitions, snapshots, records, hofEntries, isInitialized]);

    // HELPERS
    const saveDefinition = (d: StatusAwardDefinition) => {
        setDefinitions(prev => {
            const idx = prev.findIndex(item => item.id === d.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = d;
                return next;
            }
            return [...prev, d];
        });
        toast({ title: "Definition saved." });
    };

    const deleteDefinition = (id: string) => {
        setDefinitions(prev => prev.filter(d => d.id !== id));
        toast({ title: "Definition removed." });
    };

    const saveSnapshot = (s: SnapshotMetadata) => {
        setSnapshots(prev => {
            const idx = prev.findIndex(item => item.snapshotId === s.snapshotId);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = s;
                return next;
            }
            return [...prev, s];
        });
        toast({ title: "Snapshot saved." });
    };

    const deleteSnapshot = (id: string) => {
        setSnapshots(prev => prev.filter(s => s.snapshotId !== id));
        toast({ title: "Snapshot removed." });
    };

    const saveRecord = (r: StatusAwardRecord) => {
        setRecords(prev => {
            const idx = prev.findIndex(item => item.id === r.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = r;
                return next;
            }
            return [...prev, r];
        });
        toast({ title: "Award record saved." });
    };

    const deleteRecord = (id: string) => {
        setRecords(prev => prev.filter(r => r.id !== id));
        toast({ title: "Award record removed." });
    };

    const saveHofEntry = (h: HallOfFameEntry) => {
        setHofEntries(prev => {
            const idx = prev.findIndex(item => item.id === h.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = h;
                return next;
            }
            return [...prev, h];
        });
        toast({ title: "Hall of Fame entry saved." });
    };

    const deleteHofEntry = (id: string) => {
        setHofEntries(prev => prev.filter(h => h.id !== id));
        toast({ title: "Entry removed from Hall of Fame." });
    };

    const resetToDemo = () => {
        setDefinitions([...DEMO_AWARD_DEFINITIONS]);
        setSnapshots([...DEMO_SNAPSHOTS]);
        setRecords([...DEMO_AWARD_RECORDS]);
        setHofEntries([...DEMO_HALL_OF_FAME_ENTRIES]);
        setHasEdits(false);
        toast({ title: "Reset to demo defaults." });
    };

    const exportJson = () => {
        const data = { definitions, snapshots, records, hofEntries, exportedAt: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lector-status-export-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Config exported as JSON." });
    };

    const importJson = (json: string) => {
        try {
            const data = JSON.parse(json);
            if (data.definitions) setDefinitions(data.definitions);
            if (data.snapshots) setSnapshots(data.snapshots);
            if (data.records) setRecords(data.records);
            if (data.hofEntries) setHofEntries(data.hofEntries);
            toast({ title: "Config imported successfully." });
        } catch (e) {
            toast({ variant: "destructive", title: "Failed to import JSON." });
            console.error(e);
        }
    };

    return (
        <StatusAdminContext.Provider value={{
            definitions, snapshots, records, hofEntries,
            saveDefinition, deleteDefinition,
            saveSnapshot, deleteSnapshot,
            saveRecord, deleteRecord,
            saveHofEntry, deleteHofEntry,
            resetToDemo, exportJson, importJson,
            hasEdits,
            isInitialized
        }}>
            {children}
        </StatusAdminContext.Provider>
    );
}

export function useStatusAdmin() {
    const context = useContext(StatusAdminContext);
    if (!context) throw new Error("useStatusAdmin must be used within a StatusAdminProvider");
    return context;
}
