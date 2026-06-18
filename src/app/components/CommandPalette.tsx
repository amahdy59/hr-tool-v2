import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Users, LayoutDashboard, CalendarCheck, ShieldCheck, Rocket, UserCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppTab } from '../App';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTab: (tab: AppTab) => void;
  onLogout: () => void;
}

const commands = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, type: 'nav' },
  { id: 'attendance', label: 'Go to Attendance', icon: CalendarCheck, type: 'nav' },
  { id: 'employees', label: 'Go to Employees', icon: Users, type: 'nav' },
  { id: 'leaves', label: 'Go to Leaves Management', icon: FileText, type: 'nav' },
  { id: 'missions', label: 'Go to Missions Management', icon: Rocket, type: 'nav' },
  { id: 'roles', label: 'Go to Roles Management', icon: ShieldCheck, type: 'nav' },
  { id: 'profile', label: 'Go to Profile', icon: UserCircle, type: 'nav' },
  { id: 'logout', label: 'Log out', icon: LogOut, type: 'action' },
] as const;

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange, onSelectTab, onLogout }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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

      if (e.key === 'ArrowDown') {
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
        aria-label="Command Palette"
        aria-modal="true"
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200 mx-4"
      >
        <div className="flex items-center border-b border-border px-3">
          <Search className="me-2 h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            placeholder="Type a command or search..."
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
            <p className="p-4 text-center text-sm text-muted-foreground">No results found.</p>
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
            <span>Use</span>
            <kbd className="inline-flex h-5 items-center justify-center rounded border border-border bg-background px-1 font-mono text-[10px] font-medium">↑</kbd>
            <kbd className="inline-flex h-5 items-center justify-center rounded border border-border bg-background px-1 font-mono text-[10px] font-medium">↓</kbd>
            <span>to navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Press</span>
            <kbd className="inline-flex h-5 items-center justify-center rounded border border-border bg-background px-1 font-mono text-[10px] font-medium">Enter</kbd>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Press</span>
            <kbd className="inline-flex h-5 items-center justify-center rounded border border-border bg-background px-1 font-mono text-[10px] font-medium">Esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
