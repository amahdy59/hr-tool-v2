import React from 'react';
import { FileText, Users, LayoutDashboard, CalendarCheck, ShieldCheck, Rocket, UserCircle, Banknote, Files } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AppTab } from '../App';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from './ui/command';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTab: (tab: AppTab) => void;
}

const destinations = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'attendance', icon: CalendarCheck },
  { id: 'employees', icon: Users },
  { id: 'leaves', icon: FileText },
  { id: 'missions', icon: Rocket },
  { id: 'roles', icon: ShieldCheck },
  { id: 'payrolls', icon: Banknote, Files },
  { id: 'profile', icon: UserCircle },
  { id: 'requests', icon: Files },
] as const;

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange, onSelectTab }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-panel="search" dir={isArabic ? 'rtl' : 'ltr'} className="gap-4 bg-card sm:max-w-xl">
        <DialogHeader className="pe-10 text-start">
          <DialogTitle>{t('header.searchTitle')}</DialogTitle>
          <DialogDescription>{t('header.searchDescription')}</DialogDescription>
        </DialogHeader>
        <Command key={String(open)} className="rounded-xl border border-border" label={t('header.searchTitle')}>
          <CommandInput aria-label={t('header.searchTitle')} placeholder={t('commandPalette.placeholder')} className="h-12" />
          <CommandList className="max-h-[min(22rem,55dvh)] p-2">
            <CommandEmpty>{t('commandPalette.noResults')}</CommandEmpty>
            {destinations.map(({ id, icon: Icon }) => (
              <CommandItem
                key={id} value={t('sidebar.' + id)} keywords={[id]}
                onSelect={() => { onSelectTab(id); onOpenChange(false); }}
                className="min-h-11 gap-3 rounded-lg px-3 text-sm data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground"
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t('sidebar.' + id)}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
