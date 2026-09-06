import React from 'react';
import { Palette, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ComponentStyleguideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ComponentStyleguideModal: React.FC<ComponentStyleguideModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const colorTokens = [
    { name: '--primary', label: 'Primary', bg: 'bg-primary', text: 'text-primary-foreground' },
    { name: '--background', label: 'Background', bg: 'bg-background border border-border', text: 'text-foreground' },
    { name: '--card', label: 'Card Surface', bg: 'bg-card border border-border', text: 'text-card-foreground' },
    { name: '--muted', label: 'Muted', bg: 'bg-muted', text: 'text-muted-foreground' },
    { name: '--destructive', label: 'Destructive', bg: 'bg-destructive', text: 'text-destructive-foreground' },
    { name: '--accent', label: 'Accent', bg: 'bg-accent', text: 'text-accent-foreground' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Palette className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-semibold">
              {isArabic ? 'دليل مكونات نظام التصميم (ADR-0004)' : 'Design System Token & Component Catalog (ADR-0004)'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {isArabic
              ? 'مرجع بصري لرموز التصميم، مقاييس الخطوط، وحالات التفاعل المعتمدة في النظام.'
              : 'Visual reference for design tokens, typographic scale, and accessibility-compliant UI states.'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Section 1: Color Tokens */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isArabic ? 'رموز الألوان الأساسية' : 'Core Semantic Colors'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {colorTokens.map((c) => (
                <div key={c.name} className="flex items-center gap-2.5 p-2 rounded-lg border border-border/70 bg-card">
                  <div className={`w-7 h-7 rounded-md shadow-xs shrink-0 ${c.bg}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{c.label}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{c.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Typography Scale */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isArabic ? 'مقياس الخطوط والطباعة' : 'Modular Typography Scale'}
            </h4>
            <div className="p-3 rounded-lg border border-border/70 bg-card space-y-2">
              <div className="flex items-baseline justify-between border-b border-border/40 pb-1">
                <span className="text-xs text-muted-foreground">Label (12px / 0.75rem)</span>
                <span className="text-xs font-medium text-foreground">The quick brown fox jumps</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-border/40 pb-1">
                <span className="text-xs text-muted-foreground">Body Small (14px / 0.875rem)</span>
                <span className="text-sm font-medium text-foreground">The quick brown fox jumps</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-border/40 pb-1">
                <span className="text-xs text-muted-foreground">Body Standard (16px / 1rem)</span>
                <span className="text-base font-medium text-foreground">The quick brown fox jumps</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">H3 Section Title (18px / 1.125rem)</span>
                <span className="text-lg font-semibold text-foreground">The quick brown fox jumps</span>
              </div>
            </div>
          </section>

          {/* Section 3: Interactive Button Variants */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isArabic ? 'أنماط الأزرار وحالاتها' : 'Button Styles & States (Min 44px Touch Target)'}
            </h4>
            <div className="flex flex-wrap gap-2.5 items-center">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
              <Button size="sm" variant="outline">Outline</Button>
              <Button size="sm" variant="destructive">Destructive</Button>
              <Button size="sm" variant="ghost">Ghost</Button>
              <Button size="sm" disabled>Disabled</Button>
            </div>
          </section>

          {/* Section 4: Status Badges */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isArabic ? 'شارات الحالة والمؤشرات' : 'Status Badges & Identifiers'}
            </h4>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                <Clock className="w-3.5 h-3.5" /> Pending
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive dark:text-red-300 border border-destructive/20">
                <XCircle className="w-3.5 h-3.5" /> Rejected
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                <AlertTriangle className="w-3.5 h-3.5" /> In Review
              </span>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
