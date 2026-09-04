import React, { useEffect, useMemo } from 'react';
import { Keyboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

export const KeyboardShortcutsPanel: React.FC<KeyboardShortcutsPanelProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();

  const shortcuts = useMemo(() => [
    { keys: ['Ctrl', 'K'], description: t('shortcuts.openCommandPalette', 'Open command palette') },
    { keys: ['?'], description: t('shortcuts.showShortcuts', 'Show keyboard shortcuts') },
    { keys: ['Esc'], description: t('shortcuts.closeModals', 'Close modals/menus') },
    { keys: ['Enter'], description: t('shortcuts.confirmAction', 'Confirm action / Submit form') },
    { keys: ['Space'], description: t('shortcuts.toggleCheckboxes', 'Toggle checkboxes/buttons') },
    { keys: ['Tab'], description: t('shortcuts.navForward', 'Navigate focus forward') },
    { keys: ['Shift', 'Tab'], description: t('shortcuts.navBackward', 'Navigate focus backward') },
  ], [t]);

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
            <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">
              {t('shortcuts.title', 'Keyboard Shortcuts')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[var(--text-sm)] text-muted-foreground">
            {t('shortcuts.description', 'Navigate the application quickly with these shortcuts.')}
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
