import React, { useEffect } from 'react';
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
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const navigationShortcuts = [
    { seq: ['G', 'D'], desc: t('shortcuts.goToDashboardSeq', 'Go to Dashboard (G then D)') },
    { seq: ['G', 'A'], desc: t('shortcuts.goToAttendanceSeq', 'Go to Attendance (G then A)') },
    { seq: ['G', 'E'], desc: t('shortcuts.goToEmployeesSeq', 'Go to Employees (G then E)') },
    { seq: ['G', 'L'], desc: t('shortcuts.goToLeavesSeq', 'Go to Leaves (G then L)') },
    { seq: ['G', 'M'], desc: t('shortcuts.goToMissionsSeq', 'Go to Missions (G then M)') },
    { seq: ['G', 'R'], desc: t('shortcuts.goToRolesSeq', 'Go to Roles (G then R)') },
    { seq: ['G', 'P'], desc: t('shortcuts.goToProfileSeq', 'Go to Profile (G then P)') },
  ];

  const actionShortcuts = [
    { seq: ['N', 'L'], desc: t('shortcuts.newLeaveSeq', 'New Leave Request (N then L)') },
    { seq: ['N', 'M'], desc: t('shortcuts.newMissionSeq', 'New Mission Request (N then M)') },
  ];

  const globalShortcuts = [
    { keys: ['Ctrl', 'K'], desc: t('shortcuts.openCommandPalette', 'Open command palette') },
    { keys: ['?'], desc: t('shortcuts.showShortcuts', 'Show keyboard shortcuts') },
    { keys: ['Alt', 'S'], desc: t('shortcuts.openStyleguide', 'Open Design Styleguide (Alt+S)') },
    { keys: ['Esc'], desc: t('shortcuts.closeModals', 'Close modals/menus') },
    { keys: ['Enter'], desc: t('shortcuts.confirmAction', 'Confirm action / Submit form') },
    { keys: ['Tab'], desc: t('shortcuts.navForward', 'Navigate focus forward') },
    { keys: ['Shift', 'Tab'], desc: t('shortcuts.navBackward', 'Navigate focus backward') },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg font-semibold">
              {t('shortcuts.title', 'Keyboard Shortcuts')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {t('shortcuts.description', 'Navigate the application quickly with these shortcuts.')}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-5 divide-y divide-border/60">
          {/* Group 1: Navigation Sequences */}
          <div className="space-y-2 pt-2 first:pt-0">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isArabic ? 'اختصارات التنقل المتسلسل' : 'Sequential Navigation'}
            </h4>
            <div className="space-y-1.5">
              {navigationShortcuts.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 text-xs">
                  <span className="text-foreground font-medium">{s.desc}</span>
                  <div className="flex items-center gap-1 font-mono" dir="ltr">
                    <kbd className="inline-flex h-5.5 min-w-5.5 items-center justify-center rounded border border-border bg-muted px-1.5 text-[11px] font-semibold text-foreground">
                      {s.seq[0]}
                    </kbd>
                    <span className="text-muted-foreground text-[10px]">then</span>
                    <kbd className="inline-flex h-5.5 min-w-5.5 items-center justify-center rounded border border-border bg-muted px-1.5 text-[11px] font-semibold text-foreground">
                      {s.seq[1]}
                    </kbd>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group 2: Fast Actions */}
          <div className="space-y-2 pt-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
            </h4>
            <div className="space-y-1.5">
              {actionShortcuts.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 text-xs">
                  <span className="text-foreground font-medium">{s.desc}</span>
                  <div className="flex items-center gap-1 font-mono" dir="ltr">
                    <kbd className="inline-flex h-5.5 min-w-5.5 items-center justify-center rounded border border-border bg-muted px-1.5 text-[11px] font-semibold text-foreground">
                      {s.seq[0]}
                    </kbd>
                    <span className="text-muted-foreground text-[10px]">then</span>
                    <kbd className="inline-flex h-5.5 min-w-5.5 items-center justify-center rounded border border-border bg-muted px-1.5 text-[11px] font-semibold text-foreground">
                      {s.seq[1]}
                    </kbd>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group 3: System & Global */}
          <div className="space-y-2 pt-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isArabic ? 'التحكم العام والنظام' : 'Global & System Controls'}
            </h4>
            <div className="space-y-1.5">
              {globalShortcuts.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 text-xs">
                  <span className="text-foreground font-medium">{s.desc}</span>
                  <div className="flex items-center gap-1 font-mono" dir="ltr">
                    {s.keys.map((key, kIdx) => (
                      <React.Fragment key={kIdx}>
                        <kbd className="inline-flex h-5.5 min-w-5.5 items-center justify-center rounded border border-border bg-muted px-1.5 text-[11px] font-semibold text-foreground">
                          {key}
                        </kbd>
                        {kIdx < s.keys.length - 1 && <span className="text-muted-foreground text-[10px]">+</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
