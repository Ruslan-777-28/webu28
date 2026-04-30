"use client"

import React, { useState } from 'react';
import { Mic, Shield, MessageCircle, Repeat, TrendingUp, Crown, Star, Info } from 'lucide-react';
import { LEVEL_LOCALE } from '@/lib/status/constants';
import { getProfileAwardsForSubcategory, getDemoTargetUserId } from '@/lib/status/selectors';
import { FormattedProfileAward } from '@/lib/status/types';
import { StatusInfoDialog } from './status-info-dialog';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
    Mic, Shield, MessageCircle, Repeat, TrendingUp, Crown, Star
};

export function ProfileStatusShelf({ subcategoryName }: { subcategoryName?: string }) {
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [selectedAward, setSelectedAward] = useState<FormattedProfileAward | null>(null);
    const [isEmptySelected, setIsEmptySelected] = useState(false);

    if (!subcategoryName) return null;

    // Use our selector to fetch awards for the target user in the target category.
    const targetUserId = getDemoTargetUserId();
    const awards = getProfileAwardsForSubcategory(targetUserId, subcategoryName).slice(0, 3);

    const handleAwardClick = (award: FormattedProfileAward) => {
        setSelectedAward(award);
        setIsEmptySelected(false);
        setIsInfoOpen(true);
    };

    const handleEmptyClick = () => {
        setSelectedAward(null);
        setIsEmptySelected(true);
        setIsInfoOpen(true);
    };

    const StatusCardBase = ({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) => (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-start gap-1.5 p-2 rounded-xl bg-background border border-muted/20 shadow-sm transition-all text-left w-full",
                "hover:border-accent/40 hover:shadow-md hover:bg-muted/[0.02] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-accent/20 group overflow-hidden",
                className
            )}
        >
            {children}
        </button>
    );

    return (
        <div className="w-full mt-6 pt-2 border-t border-muted/20">
            <h4 className="font-extrabold text-[11px] uppercase tracking-[0.14em] text-muted-foreground/40 mb-3.5 px-0.5 flex items-center">
                {awards.length > 0 ? "Визнання в підкатегорії" : "Визнання очікується"}
            </h4>

            {awards.length === 0 ? (
                <div
                    onClick={handleEmptyClick}
                    className="flex items-center justify-between gap-2.5 h-[62px] px-4 rounded-xl bg-background border border-muted/20 shadow-sm hover:border-accent/30 hover:bg-muted/[0.02] active:scale-[0.99] transition-all cursor-pointer group"
                >
                    <div className="flex items-center gap-2.5">
                        <Shield className="h-3.5 w-3.5 text-muted-foreground/20 shrink-0 group-hover:text-accent/40 transition-colors" />
                        <span className="text-[10px] font-medium text-muted-foreground/60 tracking-tight group-hover:text-foreground/70 transition-colors">
                            Відзнаки ще не зафіксовані.
                        </span>
                    </div>
                    <Info className="h-3 w-3 text-muted-foreground/10 group-hover:text-accent/30 transition-colors" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-stretch">
                    {awards.map(award => {
                        const def = award.definition;
                        const Icon = iconMap[def.icon] || Star;
                        const levelLabel = award.level ? LEVEL_LOCALE[award.level] : '';

                        return (
                            <StatusCardBase key={award.id} onClick={() => handleAwardClick(award)}>
                                <div className="flex items-center gap-2 w-full">
                                    <div className="h-7 w-7 rounded-md flex items-center justify-center bg-muted/30 text-foreground/70 group-hover:bg-accent/10 group-hover:text-accent transition-colors shrink-0">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        {levelLabel && (
                                            <span className="text-[9px] uppercase tracking-wider font-black text-accent/90 shrink-0">
                                                {levelLabel}
                                            </span>
                                        )}
                                        {levelLabel && award.periodLabel && (
                                            <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/30 shrink-0" />
                                        )}
                                        <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground/60 truncate">
                                            {award.periodLabel}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full pl-0.5 mt-0.5">
                                    <span className="text-[11px] font-bold leading-tight text-foreground/90 line-clamp-1 uppercase tracking-tight" title={def.title}>
                                        {def.shortLabel || def.title}
                                    </span>
                                </div>
                            </StatusCardBase>
                        );
                    })}
                </div>
            )}

            <StatusInfoDialog
                isOpen={isInfoOpen}
                onOpenChange={setIsInfoOpen}
                award={selectedAward}
                isEmptyState={isEmptySelected}
            />
        </div>
    );
}

