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
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './ui/popover';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from './ui/sheet';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { InfoTooltip } from './ui/info-tooltip';
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
  description: {
    en: string;
    ar: string;
  };
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
  compact = false,
  iconOnly = false,
}: {
  value: T;
  onChange: (next: T) => void;
  options: SegmentedChoice<T>[];
  ariaLabel: string;
  columnsClassName: string;
  compact?: boolean;
  iconOnly?: boolean;
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
      className={cn(
        'grid rounded-[var(--radius-card)] bg-muted/35 p-1.5',
        compact ? 'gap-1.5' : 'gap-2',
        columnsClassName
      )}
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
            aria-label={option.label}
            title={option.label}
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
              iconOnly
                ? 'flex h-10 w-10 items-center justify-center rounded-[calc(var(--radius-card)-4px)] border p-0 transition-all duration-200'
                : compact
                ? 'flex min-h-10 items-center justify-center gap-2 rounded-[calc(var(--radius-card)-4px)] border px-3 py-2 text-left transition-all duration-200'
                : 'flex min-h-14 flex-col items-center justify-center gap-1 rounded-[calc(var(--radius-card)-4px)] border px-2 py-2 text-center transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              checked
                ? 'border-primary/25 bg-background text-foreground shadow-sm'
                : 'border-transparent text-muted-foreground hover:bg-background/70 hover:text-foreground'
            )}
          >
            <Icon className={cn('h-4 w-4', checked && 'text-primary')} aria-hidden="true" />
            {!iconOnly && (
              <span className={cn('font-semibold leading-none', compact ? 'text-xs' : 'text-[11px]')}>{option.label}</span>
            )}
            {iconOnly && <span className="sr-only">{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
};

const AccessibilityOption: React.FC<{ option: OptionDef }> = ({ option }) => {
  const { id, icon: Icon, label, description, checked, onChange, ariaLabel } = option;
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  const tooltipText = isArabic ? description.ar : description.en;

  return (
    <label
      htmlFor={id}
      className={cn(
        'grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--radius-card)] px-3.5 py-2.5 cursor-pointer transition-all duration-200 border',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2',
        checked
          ? 'border-primary/25 bg-primary/[0.08] shadow-sm'
          : 'border-border/80 bg-card hover:border-primary/35 hover:bg-muted/35'
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(next) => {
          onChange(next === true);
          triggerHaptic();
        }}
        aria-label={ariaLabel}
        className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[6px] border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
      />
      <div className="min-w-0 flex items-center gap-3">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-full transition-colors', checked ? 'bg-primary/15' : 'bg-muted')}>
          <Icon
            className={cn(
              'h-4 w-4 shrink-0 transition-colors duration-200',
              checked ? 'text-primary' : 'text-muted-foreground'
            )}
            aria-hidden="true"
          />
        </div>
        <span className="truncate text-sm font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
          {label}
        </span>
      </div>
      <InfoTooltip ariaLabel={`${label} description`}>
        {tooltipText}
      </InfoTooltip>
    </label>
  );
};

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ settings }) => {
  const { t, i18n } = useTranslation();
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
      label: t('accessibility.options.highContrast.label'),
      description: {
        en: t('accessibility.options.highContrast.tooltip', { lng: 'en' }),
        ar: t('accessibility.options.highContrast.tooltip', { lng: 'ar' }),
      },
      checked: highContrast,
      onChange: setHighContrast,
      ariaLabel: t('accessibility.options.highContrast.aria'),
    },
    {
      id: 'toggle-text-scale',
      icon: ZoomIn,
      label: t('accessibility.options.largerText.label'),
      description: {
        en: t('accessibility.options.largerText.tooltip', { lng: 'en' }),
        ar: t('accessibility.options.largerText.tooltip', { lng: 'ar' }),
      },
      checked: largeText,
      onChange: setLargeText,
      ariaLabel: t('accessibility.options.largerText.aria'),
    },
    {
      id: 'toggle-dyslexic',
      icon: Type,
      label: t('accessibility.options.dyslexiaFont.label'),
      description: {
        en: t('accessibility.options.dyslexiaFont.tooltip', { lng: 'en' }),
        ar: t('accessibility.options.dyslexiaFont.tooltip', { lng: 'ar' }),
      },
      checked: dyslexic,
      onChange: setDyslexic,
      ariaLabel: t('accessibility.options.dyslexiaFont.aria'),
    },
  ];

  const interactionOptions: OptionDef[] = [
    {
      id: 'toggle-targets',
      icon: Target,
      label: t('accessibility.options.largeTargets.label'),
      description: {
        en: t('accessibility.options.largeTargets.tooltip', { lng: 'en' }),
        ar: t('accessibility.options.largeTargets.tooltip', { lng: 'ar' }),
      },
      checked: largeTargets,
      onChange: setLargeTargets,
      ariaLabel: t('accessibility.options.largeTargets.aria'),
    },
    {
      id: 'toggle-focus',
      icon: Highlighter,
      label: t('accessibility.options.focusRing.label'),
      description: {
        en: t('accessibility.options.focusRing.tooltip', { lng: 'en' }),
        ar: t('accessibility.options.focusRing.tooltip', { lng: 'ar' }),
      },
      checked: focusHeavy,
      onChange: setFocusHeavy,
      ariaLabel: t('accessibility.options.focusRing.aria'),
    },
  ];

  const allOptions = [...readingOptions, ...interactionOptions];
  const activeCount = allOptions.filter((option) => option.checked).length;
  const themeOptions: SegmentedChoice<'light' | 'dark' | 'system'>[] = [
    { value: 'light', label: t('accessibility.themeOptions.light'), icon: Sun },
    { value: 'dark', label: t('accessibility.themeOptions.dark'), icon: Moon },
    { value: 'system', label: t('accessibility.themeOptions.system'), icon: Monitor },
  ];
  const languageOptions: SegmentedChoice<'en' | 'ar'>[] = [
    { value: 'en', label: t('accessibility.languageOptions.english'), icon: Languages },
    { value: 'ar', label: t('accessibility.languageOptions.arabic'), icon: Languages },
  ];
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

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
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-border/70 pb-3 shrink-0">
        <div className="min-w-0 flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/[0.08]">
            <Accessibility className="w-4 h-4 text-primary" />
          </div>
          <h2
            className="text-base font-semibold leading-none text-foreground"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {t('accessibility.panelTitle')}
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            disabled={activeCount === 0}
            className="h-8 rounded-[var(--radius-sm)] px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-default disabled:opacity-40"
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
            {t('accessibility.resetAll')}
          </Button>
          {closeButton}
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto pe-1 min-h-0">
        <section className="space-y-3 rounded-[var(--radius-card)] border border-border/70 bg-card/90 p-3.5">
          <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t('accessibility.appearance')}
          </p>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <SegmentedControl
                value={theme}
                onChange={setTheme}
                options={themeOptions}
                ariaLabel={t('accessibility.themeGroup')}
                columnsClassName="grid-cols-3"
                iconOnly
              />
            </div>
            <div className="min-w-0">
              <SegmentedControl
                value={language}
                onChange={setLanguage}
                options={languageOptions}
                ariaLabel={t('accessibility.languageGroup')}
                columnsClassName="grid-cols-2"
                compact
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t('accessibility.reading')}
          </p>
          <div className="space-y-2">
            {readingOptions.map((option) => (
              <AccessibilityOption key={option.id} option={option} />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t('accessibility.navigation')}
          </p>
          <div className="space-y-2">
            {interactionOptions.map((option) => (
              <AccessibilityOption key={option.id} option={option} />
            ))}
          </div>
        </section>
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
            <SheetTitle className="sr-only">{t('accessibility.panelTitle')}</SheetTitle>
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
              <PopoverClose
                className="flex min-h-8 min-w-8 items-center justify-center rounded border border-border/40 p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                aria-label={isArabic ? 'إغلاق أدوات إمكانية الوصول' : 'Close accessibility panel'}
              >
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
