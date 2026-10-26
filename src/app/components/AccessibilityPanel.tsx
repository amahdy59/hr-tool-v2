import React from 'react';
import { Accessibility, Eye, Highlighter, Languages, Target, Type, ZoomIn, Moon, Sun, Monitor } from 'lucide-react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export interface AccessibilitySettings {
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  largeTargets: boolean;
  setLargeTargets: (v: boolean) => void;
  largeText: boolean;
  setLargeText: (v: boolean) => void;
  dyslexic: boolean;
  setDyslexic: (v: boolean) => void;
  focusHeavy: boolean;
  setFocusHeavy: (v: boolean) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (v: 'light' | 'dark' | 'system') => void;
  language: 'en' | 'ar';
  setLanguage: (v: 'en' | 'ar') => void;
}

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  triggerClassName?: string;
  forceShowLabel?: boolean;
  compact?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mobileReturnFocus?: React.RefObject<HTMLButtonElement>;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  settings, triggerClassName, forceShowLabel = false, compact = false,
  open: controlledOpen, onOpenChange, mobileReturnFocus,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const instanceId = React.useId();
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  const direction = isArabic ? 'rtl' : 'ltr';
  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = (open: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(open);
    onOpenChange?.(open);
  };
  const options = [
    { key: 'highContrast', icon: Eye, checked: settings.highContrast, onChange: settings.setHighContrast },
    { key: 'largerText', icon: ZoomIn, checked: settings.largeText, onChange: settings.setLargeText },
    { key: 'dyslexiaFont', icon: Type, checked: settings.dyslexic, onChange: settings.setDyslexic },
    { key: 'largeTargets', icon: Target, checked: settings.largeTargets, onChange: settings.setLargeTargets },
    { key: 'focusRing', icon: Highlighter, checked: settings.focusHeavy, onChange: settings.setFocusHeavy },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn('h-11 shrink-0 rounded-xl text-muted-foreground hover:text-foreground', forceShowLabel && !compact ? 'gap-2 px-3' : 'w-11 px-0', triggerClassName)}
          aria-label={t('header.accessibility')}
          title={t('header.accessibility')}
        >
          <Accessibility className="h-5 w-5" aria-hidden="true" />
          {forceShowLabel && !compact && <span>{t('header.accessibility')}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={(event) => { if (mobileReturnFocus && window.innerWidth < 1024) { event.preventDefault(); mobileReturnFocus.current?.focus(); } }}
        dir={direction}
        data-panel="accessibility"
        className="gap-6 bg-card pt-[max(3.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-w-lg sm:p-6"
        onOpenAutoFocus={(event) => { event.preventDefault(); titleRef.current?.focus(); }}
      >
        <DialogHeader className="pe-10 text-start">
          <DialogTitle ref={titleRef} tabIndex={-1} className="text-lg outline-none">{t('accessibility.panelTitle')}</DialogTitle>
          <DialogDescription>{t('accessibility.description')}</DialogDescription>
        </DialogHeader>

        <section className="space-y-4" aria-labelledby={instanceId + '-appearance'}>
          <h3 id={instanceId + '-appearance'} className="text-sm font-semibold">{t('accessibility.appearance')}</h3>
          <RadioGroup.Root
            value={settings.theme} onValueChange={(value) => settings.setTheme(value as AccessibilitySettings['theme'])} dir={direction}
            aria-label={t('accessibility.themeGroup')} className="grid grid-cols-3 gap-2"
          >
            {([{ value: 'light', icon: Sun }, { value: 'dark', icon: Moon }, { value: 'system', icon: Monitor }] as const).map(({ value, icon: Icon }) => (
              <RadioGroup.Item key={value} value={value} className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-xl sm:flex-row sm:gap-2 border border-border bg-card px-2 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t('accessibility.themeOptions.' + value)}</span>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
          <RadioGroup.Root
            value={settings.language} onValueChange={(value) => settings.setLanguage(value as 'en' | 'ar')} dir={direction}
            data-no-auto-translate
            aria-label={t('accessibility.languageGroup')} className="grid grid-cols-2 gap-2"
          >
            {(['en', 'ar'] as const).map((value) => (
              <RadioGroup.Item key={value} value={value} lang={value} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Languages className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{value === 'en' ? 'English' : 'العربية'}</span>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </section>

        <section className="space-y-3" aria-labelledby={instanceId + '-reading'}>
          <h3 id={instanceId + '-reading'} className="text-sm font-semibold">{t('accessibility.readingAndInteraction')}</h3>
          <div className="divide-y divide-border rounded-xl border border-border">
            {options.map(({ key, icon: Icon, checked, onChange }) => (
              <label key={key} htmlFor={instanceId + '-' + key} className="flex min-h-16 cursor-pointer items-start gap-3 p-3 hover:bg-muted/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-ring">
                <Icon className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="min-w-0 flex-1 space-y-1">
                  <span id={instanceId + '-' + key + '-label'} className="block text-sm font-medium">{t('accessibility.options.' + key + '.label')}</span>
                  <span id={instanceId + '-' + key + '-description'} className="block text-xs leading-relaxed text-muted-foreground">{t('accessibility.options.' + key + '.tooltip')}</span>
                </span>
                <Checkbox id={instanceId + '-' + key} checked={checked} onCheckedChange={(value) => onChange(value === true)} aria-labelledby={instanceId + '-' + key + '-label'} aria-describedby={instanceId + '-' + key + '-description'} className="mt-1 shrink-0" />
              </label>
            ))}
          </div>
        </section>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <Button variant="outline" className="h-auto min-h-11 max-w-full whitespace-normal px-3 py-2 text-start" disabled={!options.some((option) => option.checked)} onClick={() => options.forEach((option) => option.onChange(false))}>
            {t('accessibility.resetAll')}
          </Button>
          <DialogClose asChild><Button>{t('common.done')}</Button></DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityPanel;
