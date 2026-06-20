import React, { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface KeyboardShortcutsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  { keys: ['Ctrl', 'K'], description: 'Open command palette' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['Esc'], description: 'Close modals/menus' },
  { keys: ['Enter'], description: 'Confirm action / Submit form' },
  { keys: ['Space'], description: 'Toggle checkboxes/buttons' },
  { keys: ['Tab'], description: 'Navigate focus forward' },
  { keys: ['Shift', 'Tab'], description: 'Navigate focus backward' },
];

export const KeyboardShortcutsPanel: React.FC<KeyboardShortcutsPanelProps> = ({ open, onOpenChange }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === '?') {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-muted-foreground" />
            <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Keyboard Shortcuts</DialogTitle>
          </div>
          <DialogDescription className="text-[var(--text-sm)] text-muted-foreground">
            Navigate the application quickly with these shortcuts.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-[var(--text-sm)] text-foreground font-[var(--font-weight-medium)]">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1" dir="ltr">
                {shortcut.keys.map((key, kIndex) => (
                  <React.Fragment key={kIndex}>
                    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground">
                      {key}
                    </kbd>
                    {kIndex < shortcut.keys.length - 1 && <span className="text-muted-foreground text-xs">+</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
