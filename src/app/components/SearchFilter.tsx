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
  return (
    <div className={cn('flex-1 space-y-1.5 cursor-default', className)}>
      {label && (
        <div className="flex items-center gap-2">
          <label className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground">{label}</label>
          {showInfo && <Info className="w-4 h-4 text-primary" />}
        </div>
      )}
      <div className="relative flex items-center gap-2 cursor-default">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={placeholder}
            className="w-full h-10 pl-10 pr-4 border border-border rounded-[var(--radius-input)] bg-input-background focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none text-[var(--text-sm)] text-foreground transition-shadow cursor-text"
          />
        </div>
        <button className="h-10 px-3 border border-border rounded-[var(--radius-input)] bg-card hover:bg-muted transition-colors cursor-pointer flex items-center justify-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};
