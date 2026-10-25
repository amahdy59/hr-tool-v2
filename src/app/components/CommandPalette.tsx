import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Users, LayoutDashboard, CalendarCheck, ShieldCheck, Rocket, UserCircle, LogOut, Banknote, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { resetToCloudflareSampleData } from '@/lib/services/cloudflareStorage';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { AppTab } from '../App';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTab: (tab: AppTab) => void;
  onLogout: () => void;
}

const navCommandDefs: Array<{ id: AppTab | 'logout' | 'reset_data'; key: string; icon: React.ComponentType<{ className?: string }>; type: 'nav' | 'action' }> = [
  { id: 'dashboard', key: 'goToDashboard', icon: LayoutDashboard, type: 'nav' },
  { id: 'attendance', key: 'goToAttendance', icon: CalendarCheck, type: 'nav' },
  { id: 'employees', key: 'goToEmployees', icon: Users, type: 'nav' },
  { id: 'leaves', key: 'goToLeaves', icon: FileText, type: 'nav' },
  { id: 'missions', key: 'goToMissions', icon: Rocket, type: 'nav' },
  { id: 'roles', key: 'goToRoles', icon: ShieldCheck, type: 'nav' },
  { id: 'payrolls', key: 'goToPayrolls', icon: Banknote, type: 'nav' },
  { id: 'profile', key: 'goToProfile', icon: UserCircle, type: 'nav' },
  { id: 'reset_data', key: 'resetCloudflareData', icon: RefreshCw, type: 'action' },
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
        : cmd.id === 'reset_data'
        ? t('commandPalette.resetCloudflareData', 'Reset to Cloudflare Sample Data')
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
        } else if (cmd.id === 'reset_data') {
          resetToCloudflareSampleData().then(() => {
            toast.success('Reset to Cloudflare R2 sample dataset!');
            setTimeout(() => window.location.reload(), 800);
          });
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
        aria-label="Command Palette"
        aria-modal="true"
        dir={isArabic ? 'rtl' : 'ltr'}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 mx-4 focus:outline-none"
      >
        <div className="flex items-center border-b border-border px-3">
          <Search className="me-2 h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No results found.</p>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    if (cmd.id === 'logout') {
                      onLogout();
                    } else if (cmd.id === 'reset_data') {
                      resetToCloudflareSampleData().then(() => {
                        toast.success('Reset to Cloudflare R2 sample dataset!');
                        setTimeout(() => window.location.reload(), 800);
                      });
                    } else {
                      onSelectTab(cmd.id as AppTab);
                    }
                    onOpenChange(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl min-h-[40px] px-3.5 py-2 text-sm text-foreground transition-all duration-150 cursor-pointer",
                    idx === selectedIndex ? "bg-accent/15 text-accent font-medium shadow-2xs" : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{cmd.label}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
