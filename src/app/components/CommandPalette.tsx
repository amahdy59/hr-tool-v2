import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Users, LayoutDashboard, CalendarCheck, ShieldCheck, Rocket, UserCircle, LogOut, Banknote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { AppTab } from '../App';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTab: (tab: AppTab) => void;
  onLogout: () => void;
}

const navCommandDefs: Array<{ id: AppTab | 'logout'; key: string; icon: React.ComponentType<{ className?: string }>; type: 'nav' | 'action' }> = [
  { id: 'dashboard', key: 'goToDashboard', icon: LayoutDashboard, type: 'nav' },
  { id: 'attendance', key: 'goToAttendance', icon: CalendarCheck, type: 'nav' },
  { id: 'employees', key: 'goToEmployees', icon: Users, type: 'nav' },
  { id: 'leaves', key: 'goToLeaves', icon: FileText, type: 'nav' },
  { id: 'missions', key: 'goToMissions', icon: Rocket, type: 'nav' },
  { id: 'roles', key: 'goToRoles', icon: ShieldCheck, type: 'nav' },
  { id: 'payrolls', key: 'goToPayrolls', icon: Banknote, type: 'nav' },
  { id: 'profile', key: 'goToProfile', icon: UserCircle, type: 'nav' },
  { id: 'logout', key: 'logout', icon: LogOut, type: 'action' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange, onSelectTab, onLogout }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = React.useMemo(() => {
    return navCommandDefs.map((cmd) => ({
      id: cmd.id,
      label: cmd.id === 'logout'
        ? t('sidebar.logout', 'Log out')
        : t(`commandPalette.${cmd.key}`, cmd.id),
      icon: cmd.icon,
      type: cmd.type,
    }));
  }, [t]);

  const filteredCommands = query === '' 
    ? commands 
    : commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'Tab') {
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd.id === 'logout') {
          onLogout();
        } else {
          onSelectTab(cmd.id as AppTab);
        }
        onOpenChange(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredCommands, selectedIndex, onOpenChange, onSelectTab, onLogout]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] sm:pt-[10vh]">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div 
        role="dialog"
        aria-label={t('header.commandPalette', 'Command Palette')}
        aria-modal="true"
        dir={isArabic ? 'rtl' : 'ltr'}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200 mx-4 focus:outline-none"
      >
        <div className="flex items-center border-b border-border px-3">
          <Search className="me-2 h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            placeholder={t('commandPalette.placeholder', 'Type a command or search...')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-listbox"
            aria-autocomplete="list"
          />
        </div>
        <div 
          className="max-h-[300px] overflow-y-auto p-2"
          role="listbox"
          id="command-palette-listbox"
        >
          {filteredCommands.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">{t('commandPalette.noResults', 'No results found.')}</p>
          ) : (
            filteredCommands.map((cmd, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-3 text-sm outline-none",
                    isSelected ? "bg-accent text-accent-foreground" : "text-foreground"
                  )}
                  onClick={() => {
                    if (cmd.id === 'logout') {
                      onLogout();
                    } else {
                      onSelectTab(cmd.id as AppTab);
                    }
                    onOpenChange(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <cmd.icon className="me-2 h-4 w-4" />
                  {cmd.label}
                </button>
              );
            })
          )}
        </div>
        <div className="border-t border-border bg-muted/50 p-2 flex items-center justify-between text-xs text-muted-foreground hidden sm:flex">
          <div className="flex items-center gap-1">
            <span>{t('commandPalette.useArrows', 'Use ↑ ↓ to navigate')}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{t('commandPalette.pressEnter', 'Press Enter to select')}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{t('commandPalette.pressEsc', 'Press Esc to close')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
