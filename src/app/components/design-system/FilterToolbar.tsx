import * as React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { useTranslation } from 'react-i18next';

export interface FilterToolbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  activeFilterCount?: number;
  onFilterClick?: () => void;
  filterButtonLabel?: string;
  isFilterActive?: boolean;
  filterTriggerSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  activeFilterCount = 0,
  onFilterClick,
  filterButtonLabel = 'Filter',
  isFilterActive = false,
  filterTriggerSlot,
  actionsSlot,
  children,
  className,
}) => {
  const searchInputId = React.useId();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-border/80 bg-card/75 p-4 shadow-2xs backdrop-blur-md transition-all sm:flex-row sm:items-center sm:justify-between',
        className
      )}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
        {onSearchChange && (
          <div data-slot="search-field" className="input-shell relative min-w-0 w-full basis-full sm:basis-[220px] flex-1 max-w-md rounded-xl border border-border bg-input-background">
            <label htmlFor={searchInputId} className="sr-only">
              {searchPlaceholder}
            </label>
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground">
              <Search className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              id={searchInputId}
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 min-h-[44px] w-full rounded-[inherit] border-0 bg-transparent ps-9 pe-12 text-sm text-foreground shadow-2xs outline-none transition-all placeholder:text-muted-foreground hover:border-slate-300 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 dark:hover:border-slate-700 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                className="absolute inset-y-0 end-0 flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                aria-label={t('common.clearSearch', 'Clear search')}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {filterTriggerSlot
          ? filterTriggerSlot
          : onFilterClick && (
              <Button
                variant="outline"
                onClick={onFilterClick}
                className={cn(
                  'h-11 min-h-[44px] gap-2 rounded-xl border border-border/80 bg-card px-3.5 text-sm font-medium shadow-2xs transition-all active:scale-95 cursor-pointer',
                  (activeFilterCount > 0 || isFilterActive)
                    ? 'border-primary/60 bg-primary/10 text-primary shadow-xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                aria-label={`${filterButtonLabel} (${activeFilterCount} active)`}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                <span>{filterButtonLabel}</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            )}

        {children}
      </div>

      {actionsSlot && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60 sm:border-t-0 sm:pt-0 sm:justify-end">
          {actionsSlot}
        </div>
      )}
    </div>
  );
};
