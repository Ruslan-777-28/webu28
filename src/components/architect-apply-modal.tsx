'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { UnifiedContactForm } from './unified-contact-form';

interface ArchitectApplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchitectApplyModal({ open, onOpenChange }: ArchitectApplyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background border-border/60 shadow-2xl p-0">
        <UnifiedContactForm 
          variant="architect_application"
          title="Заявка на статус архітектора"
          description="Станьте архітектором платформи та частиною екосистеми LECTOR. Архітектор є лідером у своїй підкатегорії, а куратор — лідером архітекторів напряму в межах заявленої країни."
          onClose={() => onOpenChange(false)}
          onSuccess={() => {
            // Success logic if needed
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
