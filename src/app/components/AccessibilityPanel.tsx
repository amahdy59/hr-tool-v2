import React from 'react';
import { 
  Accessibility, 
  Eye, 
  Target, 
  ZoomIn, 
  Type, 
  Highlighter 
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Switch } from './ui/switch';
import { Button } from './ui/button';

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

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ settings }) => {
  const {
    highContrast, setHighContrast,
    largeTargets, setLargeTargets,
    largeText, setLargeText,
    dyslexic, setDyslexic,
    focusHeavy, setFocusHeavy
  } = settings;

  // Track if any setting is enabled for the badge counter
  const activeCount = [highContrast, largeTargets, largeText, dyslexic, focusHeavy].filter(Boolean).length;

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
          <span className="hidden sm:inline" style={{ fontFamily: "'Inter', sans-serif" }}>Accessibility</span>
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-card shadow-sm animate-pulse">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-5 rounded-[var(--radius-card)] border-border bg-card shadow-[var(--elevation-lg)]" align="end">
        <div className="space-y-4">
          <div className="border-b border-border pb-2.5">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              <Accessibility className="w-4 h-4 text-primary" />
              Accessibility Tools
            </h2>
            <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              Customize your viewing and interaction experience to meet WCAG 2.1 AAA accessibility.
            </p>
          </div>

          <div className="space-y-3.5">
            {/* 1. High Contrast */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2.5 items-start">
                <Eye className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <label htmlFor="toggle-contrast" className="text-xs font-medium text-foreground block cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>
                    AAA High Contrast
                  </label>
                  <span className="text-[10px] text-muted-foreground block" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Force maximum text-to-background contrast ratio (7:1).
                  </span>
                </div>
              </div>
              <Switch 
                id="toggle-contrast"
                checked={highContrast} 
                onCheckedChange={setHighContrast}
                aria-label="Toggle AAA High Contrast"
              />
            </div>

            {/* 2. Touch/Click Targets */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2.5 items-start">
                <Target className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <label htmlFor="toggle-targets" className="text-xs font-medium text-foreground block cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>
                    AAA Large Targets
                  </label>
                  <span className="text-[10px] text-muted-foreground block" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Resize interactive buttons/inputs to minimum 44px.
                  </span>
                </div>
              </div>
              <Switch 
                id="toggle-targets"
                checked={largeTargets} 
                onCheckedChange={setLargeTargets}
                aria-label="Toggle AAA Large Targets"
              />
            </div>

            {/* 3. Text Scaling */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2.5 items-start">
                <ZoomIn className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <label htmlFor="toggle-text-scale" className="text-xs font-medium text-foreground block cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>
                    AAA Text Scale
                  </label>
                  <span className="text-[10px] text-muted-foreground block" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Increase base text sizing by 120% for readability.
                  </span>
                </div>
              </div>
              <Switch 
                id="toggle-text-scale"
                checked={largeText} 
                onCheckedChange={setLargeText}
                aria-label="Toggle AAA Text Scale"
              />
            </div>

            {/* 4. Dyslexic-Friendly */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2.5 items-start">
                <Type className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <label htmlFor="toggle-dyslexic" className="text-xs font-medium text-foreground block cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Dyslexia Font
                  </label>
                  <span className="text-[10px] text-muted-foreground block" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Change typeface to a more readable font style.
                  </span>
                </div>
              </div>
              <Switch 
                id="toggle-dyslexic"
                checked={dyslexic} 
                onCheckedChange={setDyslexic}
                aria-label="Toggle Dyslexia Font"
              />
            </div>

            {/* 5. Visual Focus Guides */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2.5 items-start">
                <Highlighter className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <label htmlFor="toggle-focus" className="text-xs font-medium text-foreground block cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Focus Highlights
                  </label>
                  <span className="text-[10px] text-muted-foreground block" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Apply heavy outlines to key elements when tabbed.
                  </span>
                </div>
              </div>
              <Switch 
                id="toggle-focus"
                checked={focusHeavy} 
                onCheckedChange={setFocusHeavy}
                aria-label="Toggle Focus Highlights"
              />
            </div>
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
