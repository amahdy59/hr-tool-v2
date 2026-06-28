import React from 'react';
import { Search, Filter, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFilterProps {
  placeholder?: string;
  label?: string;
  showInfo?: boolean;
  className?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  placeholder = 'Search...',
  label,
  showInfo = false,
  className,
}) => {
  const searchId = React.useId();
  const helpId = React.useId();
  const resolvedLabel = label || 'Search';

  return (
    <div className={cn('flex-1 space-y-1.5 cursor-default', className)}>
      {label && (
        <div className="flex items-center gap-2">
          <label htmlFor={searchId} className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground">{label}</label>
          {showInfo && <Info className="w-4 h-4 text-primary" />}
        </div>
      )}
      {showInfo && (
        <p id={helpId} className="sr-only">
          Search results update as you type. Use the filter button to refine the results.
        </p>
      )}
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative flex items-center gap-2 cursor-default">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <input
            id={searchId}
            type="search"
            placeholder={placeholder}
            aria-label={resolvedLabel}
            aria-describedby={showInfo ? helpId : undefined}
            autoComplete="search"
            className="w-full min-h-[44px] ps-10 pe-4 border border-border rounded-[var(--radius-input)] bg-input-background focus:ring-4 focus:ring-ring/40 focus:border-ring outline-none text-[var(--text-sm)] text-foreground transition-shadow cursor-text"
          />
        </div>
        <button type="button" aria-label={`Open filters for ${resolvedLabel.toLowerCase()}`} className="min-h-[44px] px-3 border border-border rounded-[var(--radius-input)] bg-card hover:bg-muted transition-colors cursor-pointer flex items-center justify-center">
          <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};
