import React from 'react';
import {
  Accessibility,
  Eye,
  Highlighter,
  Languages,
  Target,
  Type,
  ZoomIn,
  X,
  Moon,
  Sun,
  Monitor,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './ui/popover';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from './ui/sheet';
import { Switch } from './ui/switch';
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
}

type OptionDef = {
  id: string;
  icon: React.ElementType;
  label: string;
  meta: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel: string;
};

type SegmentedChoice<T extends string> = {
  value: T;
  label: string;
  icon: React.ElementType;
};

const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(12);
  }
};

const SegmentedControl = <T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  columnsClassName,
}: {
  value: T;
  onChange: (next: T) => void;
  options: SegmentedChoice<T>[];
  ariaLabel: string;
  columnsClassName: string;
}) => {
  const currentIndex = options.findIndex((option) => option.value === value);

  const moveSelection = (direction: 1 | -1) => {
    const nextIndex = (currentIndex + direction + options.length) % options.length;
    onChange(options[nextIndex].value);
    triggerHaptic();
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('grid gap-2 rounded-[var(--radius-card)] bg-muted/35 p-1.5', columnsClassName)}
    >
      {options.map((option) => {
        const Icon = option.icon;
        const checked = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => {
              onChange(option.value);
              triggerHaptic();
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                moveSelection(1);
              }
              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                moveSelection(-1);
              }
            }}
            className={cn(
              'flex min-h-14 flex-col items-center justify-center gap-1 rounded-[calc(var(--radius-card)-4px)] border px-2 py-2 text-center transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              checked
                ? 'border-primary/25 bg-background text-foreground shadow-sm'
                : 'border-transparent text-muted-foreground hover:bg-background/70 hover:text-foreground'
            )}
          >
            <Icon className={cn('h-4 w-4', checked && 'text-primary')} aria-hidden="true" />
            <span className="text-[11px] font-semibold leading-none">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const AccessibilityOption: React.FC<{ option: OptionDef }> = ({ option }) => {
  const { id, icon: Icon, label, meta, description, checked, onChange, ariaLabel } = option;

  return (
    <label
      htmlFor={id}
      className={cn(
        'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--radius-card)] px-4 py-3 cursor-pointer transition-all duration-200 border',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2',
        checked
          ? 'border-primary/25 bg-primary/[0.08] shadow-sm'
          : 'border-border/80 bg-card hover:border-primary/35 hover:bg-muted/35'
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className={cn('mt-0.5 flex h-9 w-9 items-center justify-center rounded-full transition-colors', checked ? 'bg-primary/15' : 'bg-muted')}>
          <Icon
            className={cn(
              'h-4 w-4 shrink-0 transition-colors duration-200',
              checked ? 'text-primary' : 'text-muted-foreground'
            )}
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              {label}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {meta}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            {description}
          </p>
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(next) => {
          onChange(next);
          triggerHaptic();
        }}
        aria-label={ariaLabel}
        className="shrink-0"
      />
    </label>
  );
};

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ settings }) => {
  const { t } = useTranslation();
  const {
    highContrast,
    setHighContrast,
    largeTargets,
    setLargeTargets,
    largeText,
    setLargeText,
    dyslexic,
    setDyslexic,
    focusHeavy,
    setFocusHeavy,
    theme,
    setTheme,
    language,
    setLanguage,
  } = settings;

  const readingOptions: OptionDef[] = [
    {
      id: 'toggle-contrast',
      icon: Eye,
      label: 'High Contrast',
      meta: 'Readability',
      description: 'Stronger text contrast for easier reading.',
      checked: highContrast,
      onChange: setHighContrast,
      ariaLabel: 'Toggle high contrast',
    },
    {
      id: 'toggle-text-scale',
      icon: ZoomIn,
      label: 'Larger Text',
      meta: 'Vision',
      description: 'Scales core text for comfortable reading.',
      checked: largeText,
      onChange: setLargeText,
      ariaLabel: 'Toggle larger text',
    },
    {
      id: 'toggle-dyslexic',
      icon: Type,
      label: 'Dyslexia Font',
      meta: 'Reading',
      description: 'Uses a more readable letterform style.',
      checked: dyslexic,
      onChange: setDyslexic,
      ariaLabel: 'Toggle dyslexia font',
    },
  ];

  const interactionOptions: OptionDef[] = [
    {
      id: 'toggle-targets',
      icon: Target,
      label: 'Large Targets',
      meta: 'Touch',
      description: 'Makes buttons and hit areas easier to use.',
      checked: largeTargets,
      onChange: setLargeTargets,
      ariaLabel: 'Toggle large targets',
    },
    {
      id: 'toggle-focus',
      icon: Highlighter,
      label: 'Focus Ring',
      meta: 'Keyboard',
      description: 'Shows stronger outlines while tabbing.',
      checked: focusHeavy,
      onChange: setFocusHeavy,
      ariaLabel: 'Toggle focus ring',
    },
  ];

  const allOptions = [...readingOptions, ...interactionOptions];
  const activeCount = allOptions.filter((option) => option.checked).length;
  const themeOptions: SegmentedChoice<'light' | 'dark' | 'system'>[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];
  const languageOptions: SegmentedChoice<'en' | 'ar'>[] = [
    { value: 'en', label: 'English', icon: Languages },
    { value: 'ar', label: 'العربية', icon: Languages },
  ];

  const triggerButton = (
    <Button
      variant="outline"
      className="relative flex h-11 w-11 items-center justify-center border-border/80 text-foreground transition-all duration-200 hover:border-primary/50 hover:shadow-sm lg:h-11 lg:w-auto lg:gap-2 lg:px-4"
      aria-label={t('header.accessibility')}
      title={t('header.accessibility')}
    >
      <Accessibility className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
      <span className="hidden lg:inline" style={{ fontFamily: "'Inter', sans-serif" }}>
        {t('header.accessibility')}
      </span>
      {activeCount > 0 && (
        <span className="absolute -top-1.5 -end-1.5 sm:top-auto sm:-translate-y-1/2 sm:start-auto sm:-end-2 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-card shadow-sm">
          {activeCount}
        </span>
      )}
    </Button>
  );

  const renderPanelContent = (closeButton: React.ReactNode) => (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-border/70 pb-4 shrink-0">
        <div className="space-y-2">
          <h2
            className="flex items-center gap-2 text-base font-semibold text-foreground"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Accessibility className="w-4 h-4 text-primary" />
            Accessibility Tools
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span style={{ fontFamily: "'Inter', sans-serif" }}>Clean, faster-to-scan preferences.</span>
            {activeCount > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                {activeCount} active
              </span>
            ) : null}
          </div>
        </div>
        {closeButton}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto pe-1 min-h-0">
        <section className="space-y-3 rounded-[var(--radius-card)] border border-border/70 bg-card/90 p-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              Appearance
            </p>
            <p className="text-xs text-muted-foreground">Keep core preferences together and easy to find.</p>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Theme</p>
              <SegmentedControl
                value={theme}
                onChange={setTheme}
                options={themeOptions}
                ariaLabel="Theme"
                columnsClassName="grid-cols-3"
              />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Language</p>
              <SegmentedControl
                value={language}
                onChange={setLanguage}
                options={languageOptions}
                ariaLabel="Language"
                columnsClassName="grid-cols-2"
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              Reading
            </p>
            <p className="text-xs text-muted-foreground">Improve legibility without overwhelming the panel.</p>
          </div>
          <div className="space-y-2">
            {readingOptions.map((option) => (
              <AccessibilityOption key={option.id} option={option} />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              Navigation
            </p>
            <p className="text-xs text-muted-foreground">Support touch, keyboard, and motor accessibility.</p>
          </div>
          <div className="space-y-2">
            {interactionOptions.map((option) => (
              <AccessibilityOption key={option.id} option={option} />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3 shrink-0">
        <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
          Keyboard friendly and responsive by default.
        </p>
        {activeCount > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-[var(--radius-sm)] px-3 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              setHighContrast(false);
              setLargeTargets(false);
              setLargeText(false);
              setDyslexic(false);
              setFocusHeavy(false);
              triggerHaptic();
            }}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Reset all
          </Button>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      <div className="sm:hidden h-full flex items-stretch">
        <Sheet>
          <SheetTrigger asChild>
            {triggerButton}
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[100dvh] flex flex-col w-full p-5 border-0 rounded-none bg-card z-[100] overflow-hidden">
            <SheetTitle className="sr-only">Accessibility Settings</SheetTitle>
            {renderPanelContent(null)}
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden sm:block h-full flex items-stretch">
        <Popover>
          <PopoverTrigger asChild>
            {triggerButton}
          </PopoverTrigger>
          <PopoverContent
            className="z-[100] flex max-h-[85vh] w-[26rem] flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--elevation-lg)]"
            align="end"
            sideOffset={8}
            collisionPadding={16}
          >
            {renderPanelContent(
              <PopoverClose className="p-1 rounded hover:bg-muted text-muted-foreground flex items-center justify-center min-w-8 min-h-8 border border-border/40 cursor-pointer" aria-label="Close accessibility panel">
                <X className="w-4 h-4" />
              </PopoverClose>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default AccessibilityPanel;
