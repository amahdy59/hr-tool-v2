import React from 'react';
import {
  Accessibility,
  Eye,
  Highlighter,
  Target,
  Type,
  ZoomIn,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
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
}

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
}

type OptionDef = {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel: string;
};

const AccessibilityOption: React.FC<{ option: OptionDef }> = ({ option }) => {
  const { id, icon: Icon, label, description, checked, onChange, ariaLabel } = option;

  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-center justify-between gap-3 rounded-[var(--radius)] px-3 py-2.5 -mx-3 cursor-pointer transition-all duration-200 group',
        checked
          ? 'bg-primary/8 ring-1 ring-primary/15'
          : 'hover:bg-muted/60'
      )}
    >
      <div className="flex gap-2.5 items-center min-w-0">
        <Icon
          className={cn(
            'w-4 h-4 shrink-0 transition-colors duration-200',
            checked ? 'text-primary' : 'text-muted-foreground/50'
          )}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <span
            className={cn(
              'text-xs font-medium block transition-colors duration-200',
              checked ? 'text-foreground' : 'text-muted-foreground'
            )}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {label}
          </span>
          <span
            className={cn(
              'text-[10px] block leading-4 transition-colors duration-200',
              checked ? 'text-muted-foreground' : 'text-muted-foreground/60'
            )}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {description}
          </span>
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        aria-label={ariaLabel}
        className={cn(
          'shrink-0 transition-opacity duration-200',
          !checked && 'opacity-40'
        )}
      />
    </label>
  );
};

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ settings }) => {
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
  } = settings;

  const options: OptionDef[] = [
    {
      id: 'toggle-contrast',
      icon: Eye,
      label: 'AAA High Contrast',
      description: 'Force maximum text-to-background contrast ratio (7:1).',
      checked: highContrast,
      onChange: setHighContrast,
      ariaLabel: 'Toggle AAA High Contrast',
    },
    {
      id: 'toggle-targets',
      icon: Target,
      label: 'AAA Large Targets',
      description: 'Resize interactive buttons/inputs to minimum 44px.',
      checked: largeTargets,
      onChange: setLargeTargets,
      ariaLabel: 'Toggle AAA Large Targets',
    },
    {
      id: 'toggle-text-scale',
      icon: ZoomIn,
      label: 'AAA Text Scale',
      description: 'Increase base text sizing by 120% for readability.',
      checked: largeText,
      onChange: setLargeText,
      ariaLabel: 'Toggle AAA Text Scale',
    },
    {
      id: 'toggle-dyslexic',
      icon: Type,
      label: 'Dyslexia Font',
      description: 'Change typeface to a more readable font style.',
      checked: dyslexic,
      onChange: setDyslexic,
      ariaLabel: 'Toggle Dyslexia Font',
    },
    {
      id: 'toggle-focus',
      icon: Highlighter,
      label: 'Focus Highlights',
      description: 'Apply heavy outlines to key elements when tabbed.',
      checked: focusHeavy,
      onChange: setFocusHeavy,
      ariaLabel: 'Toggle Focus Highlights',
    },
  ];

  const activeCount = options.filter((o) => o.checked).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative gap-2 border-border/80 hover:border-primary/50 text-foreground transition-all duration-200"
          aria-label="Accessibility Settings"
          title="Accessibility Settings"
        >
          <Accessibility className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="hidden sm:inline" style={{ fontFamily: "'Inter', sans-serif" }}>
            Accessibility
          </span>
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -end-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-card shadow-sm">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-5 rounded-[var(--radius-card)] border-border bg-card shadow-[var(--elevation-lg)]"
        align="end"
      >
        <div className="space-y-1">
          <div className="border-b border-border pb-3 mb-4">
            <h2
              className="text-sm font-semibold text-foreground flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Accessibility className="w-4 h-4 text-primary" />
              Accessibility Tools
            </h2>
            <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              Adjust your viewing and interaction preferences.
            </p>
          </div>

          <div className="space-y-0.5">
            {options.map((option) => (
              <AccessibilityOption key={option.id} option={option} />
            ))}
          </div>

          {activeCount > 0 && (
            <div className="border-t border-border pt-2.5 mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] h-7 px-2 hover:bg-destructive/10 hover:text-destructive text-muted-foreground cursor-pointer rounded-[var(--radius-sm)]"
                onClick={() => {
                  setHighContrast(false);
                  setLargeTargets(false);
                  setLargeText(false);
                  setDyslexic(false);
                  setFocusHeavy(false);
                }}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Reset all
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
