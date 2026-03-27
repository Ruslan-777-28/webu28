'use client';

import { cn } from '@/lib/utils';

const LECTOR_EDITORIAL_ID = '__lector_editorial__';

export interface SubcategoryChip {
    id: string;
    name: string;
    categoryId?: string;
}

interface InterestSelectorProps {
    subcategories: SubcategoryChip[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    onClear: () => void;
}

export { LECTOR_EDITORIAL_ID };

export function InterestSelector({ subcategories, selectedIds, onToggle, onClear }: InterestSelectorProps) {
    const MAX_SELECTION = 3;
    const hasSelection = selectedIds.length > 0;
    const lectorSelected = selectedIds.includes(LECTOR_EDITORIAL_ID);
    // LECTOR is separate — only real subcategory selections count toward the limit
    const userSubCount = selectedIds.filter(id => id !== LECTOR_EDITORIAL_ID).length;
    const atLimit = userSubCount >= MAX_SELECTION;

    const handleChipClick = (id: string) => {
        const isSelected = selectedIds.includes(id);
        // LECTOR is always freely toggleable; subcategory chips are guarded by limit
        const isLector = id === LECTOR_EDITORIAL_ID;
        if (!isLector && !isSelected && atLimit) return;
        onToggle(id);
    };

    return (
        <div className="w-full space-y-4 py-8 border-t border-border/30 border-b border-border/20">
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.55em] text-muted-foreground/60">
                    Ваш фокус
                </span>
                {hasSelection && (
                    <button
                        onClick={onClear}
                        className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-foreground transition-colors"
                    >
                        Скинути
                    </button>
                )}
            </div>

            {/* Scrollable chips rail */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-0">
                {/* Pinned editorial chip — always freely toggleable, outside the 3-slot limit */}
                <button
                    onClick={() => handleChipClick(LECTOR_EDITORIAL_ID)}
                    className={cn(
                        'flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-200 whitespace-nowrap',
                        lectorSelected
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-transparent text-foreground border-foreground/20 hover:border-foreground/50 hover:bg-foreground/5'
                    )}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    Інсайди LECTOR
                </button>

                {/* Divider */}
                <div className="flex-shrink-0 h-4 w-px bg-border/40 mx-1" />

                {/* Dynamic subcategory chips */}
                {subcategories.map(chip => {
                    const selected = selectedIds.includes(chip.id);
                    const disabled = !selected && atLimit;
                    return (
                        <button
                            key={chip.id}
                            onClick={() => handleChipClick(chip.id)}
                            disabled={disabled}
                            className={cn(
                                'flex-shrink-0 inline-flex items-center px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap',
                                selected
                                    ? 'bg-foreground text-background border-foreground'
                                    : 'bg-transparent text-foreground/60 border-border/40 hover:border-foreground/30 hover:text-foreground hover:bg-foreground/5',
                                disabled && 'opacity-30 cursor-not-allowed pointer-events-none'
                            )}
                        >
                            {chip.name}
                        </button>
                    );
                })}
            </div>

            {/* Limit hint — only for subcategory slots */}
            {atLimit && (
                <p className="text-[9px] text-muted-foreground/50 uppercase tracking-widest font-mono">
                    Максимум 3 підкатегорії обрано
                </p>
            )}
        </div>
    );
}
