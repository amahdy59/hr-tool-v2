import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const [pageInput, setPageInput] = useState(String(currentPage));

  // Sync state if prop changes
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handleGo = (p: number) => {
    const target = Math.max(1, Math.min(p, totalPages));
    onPageChange(target);
    setPageInput(String(target));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border bg-muted/20">
      {/* Items per page selector */}
      <div className="flex items-center gap-3 text-[var(--text-sm)] text-muted-foreground w-full sm:w-auto justify-center sm:justify-start whitespace-nowrap shrink-0">
        <span>Items Per Page</span>
        {onItemsPerPageChange ? (
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="h-11 sm:h-8 px-2 py-0 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] text-center outline-none cursor-pointer hover:bg-muted/50 focus:ring-2 focus:ring-ring/50 transition-colors shadow-sm"
            dir="auto"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        ) : (
          <div className="h-11 sm:h-8 px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] flex items-center justify-center cursor-not-allowed">
            {itemsPerPage}
          </div>
        )}
      </div>

      {/* Page navigation */}
      <div className="flex flex-row items-center justify-center sm:justify-end gap-2 pt-2 sm:pt-0 w-full sm:w-auto">
        <button
          onClick={() => handleGo(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-11 h-11 sm:w-8 sm:h-8 p-1.5 flex items-center justify-center border border-border rounded-[var(--radius-sm)] bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>

        <span className="text-[var(--text-sm)] text-foreground flex items-center gap-2 whitespace-nowrap">
          Page
          <input
            type="text"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onBlur={() => handleGo(Number(pageInput) || 1)}
            onKeyDown={(e) => e.key === 'Enter' && handleGo(Number(pageInput) || 1)}
            className="w-10 h-11 sm:h-8 px-1 py-0 text-center border border-border rounded-[var(--radius-input)] bg-input-background text-foreground focus:ring-2 focus:ring-ring/50 outline-none text-[var(--text-sm)] leading-[42px] sm:leading-[30px] shadow-sm"
            aria-label="Page number input"
            dir="auto"
          />
          <span className="text-muted-foreground">of {totalPages}</span>
        </span>

        <button
          onClick={() => handleGo(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-11 h-11 sm:w-8 sm:h-8 p-1.5 flex items-center justify-center border border-border rounded-[var(--radius-sm)] bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
      </div>
    </div>
  );
};
