import React, { useState } from 'react';
import {
  Accessibility,
  ChevronDown,
  Eye,
  Highlighter,
  Target,
  Type,
  ZoomIn,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
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

const AccessibilityOption: React.FC<{ option: OptionDef; emphasized?: boolean }> = ({
  option,
  emphasized = false,
}) => {
  const { id, icon: Icon, label, description, checked, onChange, ariaLabel } = option;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-[var(--radius-sm)] px-2 py-1.5 -mx-2 transition-colors',
        emphasized && checked && 'bg-primary/5',
        !checked && 'opacity-90'
      )}
    >
      <div className="flex gap-2.5 items-start min-w-0">
        <Icon
          className={cn(
            'w-4 h-4 mt-0.5 shrink-0',
            checked ? 'text-primary' : 'text-muted-foreground'
          )}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <label
            htmlFor={id}
            className={cn(
              'text-xs font-medium block cursor-pointer',
              checked ? 'text-foreground' : 'text-muted-foreground'
            )}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {label}
          </label>
          <span className="text-[10px] text-muted-foreground block" style={{ fontFamily: "'Inter', sans-serif" }}>
            {description}
          </span>
        </div>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} aria-label={ariaLabel} />
    </div>
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

  const [showInactive, setShowInactive] = useState(false);

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

  const activeOptions = options.filter((o) => o.checked);
  const inactiveOptions = options.filter((o) => !o.checked);
  const activeCount = activeOptions.length;
  const inactiveCount = inactiveOptions.length;
  const allInactive = activeCount === 0;

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
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-card shadow-sm">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-5 rounded-[var(--radius-card)] border-border bg-card shadow-[var(--elevation-lg)]"
        align="end"
      >
        <div className="space-y-4">
          <div className="border-b border-border pb-2.5">
            <h2
              className="text-sm font-semibold text-foreground flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Accessibility className="w-4 h-4 text-primary" />
              Accessibility Tools
            </h2>
            <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              Customize your viewing and interaction experience to meet WCAG 2.1 AAA accessibility.
            </p>
          </div>

          <div className="space-y-3.5">
            {allInactive ? (
              <div className="space-y-3.5">
                {options.map((option) => (
                  <AccessibilityOption key={option.id} option={option} />
                ))}
              </div>
            ) : (
              <>
                {activeOptions.length > 0 && (
                  <div className="space-y-3.5">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Active ({activeCount})
                    </p>
                    {activeOptions.map((option) => (
                      <AccessibilityOption key={option.id} option={option} emphasized />
                    ))}
                  </div>
                )}

                {inactiveCount > 0 && (
                  <Collapsible open={showInactive} onOpenChange={setShowInactive}>
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-dashed border-border px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 hover:text-foreground"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        aria-expanded={showInactive}
                      >
                        <span>
                          {showInactive ? 'Hide' : 'Show'} inactive options ({inactiveCount})
                        </span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 shrink-0 transition-transform',
                            showInactive && 'rotate-180'
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 space-y-3.5 border-t border-border pt-3">
                      {inactiveOptions.map((option) => (
                        <AccessibilityOption key={option.id} option={option} />
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </>
            )}
          </div>

          {activeCount > 0 && (
            <div className="border-t border-border pt-2.5 flex justify-end">
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
                  setShowInactive(false);
                }}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Reset all settings
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
