"use client"

import React from 'react';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { 
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription 
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { FormattedProfileAward } from "@/lib/status/types";
import { Star, Shield, Info } from 'lucide-react';
import { cn } from "@/lib/utils";

interface StatusInfoDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    award: FormattedProfileAward | null;
    isEmptyState?: boolean;
}

export function StatusInfoDialog({ 
    isOpen, 
    onOpenChange, 
    award, 
    isEmptyState = false 
}: StatusInfoDialogProps) {
    const isMobile = useIsMobile();

    const title = isEmptyState 
        ? "Інформація про статуси" 
        : award?.definition.title;
        
    const type = isEmptyState 
        ? "Інформаційний стан" 
        : award?.definition.explanationType;
        
    const reason = isEmptyState 
        ? "у цій підкатегорії для профілю ще не зафіксовано статусів або відзнак." 
        : award?.definition.explanationReason;
        
    const howToGet = isEmptyState 
        ? "після того як у вибраній підкатегорії накопичуються достатні сигнали активності, попиту або визнання." 
        : award?.definition.explanationHowToGet;
        
    const period = isEmptyState 
        ? null 
        : (award?.periodLabel || "Spring 2026");

    const Content = () => (
        <div className="flex flex-col gap-6 py-4">
            {/* Header Icon & Title */}
            <div className="flex items-center gap-4">
                <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                    isEmptyState ? "bg-muted/30 text-muted-foreground/40" : "bg-accent/10 text-accent"
                )}>
                    {isEmptyState ? <Info className="h-6 w-6" /> : <Star className="h-6 w-6" />}
                </div>
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-lg font-bold text-foreground leading-tight">
                        {title}
                    </h3>
                    {type && (
                        <span className="text-[10px] uppercase tracking-widest font-bold text-accent/80">
                            {type}
                        </span>
                    )}
                </div>
            </div>

            {/* Info Blocks */}
            <div className="space-y-5">
                <div className="space-y-1.5">
                    <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/50">
                        {isEmptyState ? "Що це означає" : "За що надано"}
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                        {reason}
                    </p>
                </div>

                <div className="space-y-1.5">
                    <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/50">
                        {isEmptyState ? "Як з’являється статус" : "Як отримують"}
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                        {howToGet}
                    </p>
                </div>

                {period && (
                    <div className="pt-4 border-t border-muted/10 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/40">
                            Активний період
                        </span>
                        <span className="text-[10px] font-bold bg-muted/30 px-2.5 py-1 rounded-full text-foreground/70 uppercase tracking-tight">
                            {period}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-10 pt-8 border-t-0 shadow-2xl">
                    <div className="mx-auto w-12 h-1.5 rounded-full bg-muted/20 mb-6" />
                    <Content />
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] rounded-[24px] p-8 border-muted/20">
                <Content />
            </DialogContent>
        </Dialog>
    );
}
