import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 150,
  itemsPerPage = 15,
}) => {
  const [page, setPage] = useState(currentPage);
  const [pageInput, setPageInput] = useState(String(currentPage));
  const go = (p: number) => {
    const v = Math.max(1, Math.min(p, totalPages));
    setPage(v);
    setPageInput(String(v));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 py-2">
      <div className="flex items-center gap-2 text-[var(--text-sm)] text-muted-foreground w-full sm:w-auto justify-center sm:justify-start whitespace-nowrap shrink-0">
        Items Per Page
        <select className="h-11 sm:h-8 px-2 py-0 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] text-center outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer" dir="auto">
          <option>{itemsPerPage}</option>
          <option>30</option>
          <option>50</option>
        </select>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
        <button
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          className="min-w-11 min-h-11 sm:min-w-8 sm:min-h-8 p-1.5 flex items-center justify-center border border-border rounded-[var(--radius-sm)] hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <span className="text-[var(--text-sm)] text-foreground flex items-center gap-1 whitespace-nowrap shrink-0">
          Page
          <input
            type="text"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onBlur={() => go(Number(pageInput) || 1)}
            onKeyDown={(e) => e.key === 'Enter' && go(Number(pageInput) || 1)}
            className="w-10 h-11 sm:h-8 px-0 py-0 text-center border border-border rounded-[var(--radius-input)] bg-input-background text-foreground focus:ring-2 focus:ring-ring/50 outline-none text-[var(--text-sm)] leading-none shadow-sm"
            aria-label="Page number input"
            dir="auto"
          />
          of {totalPages}
        </span>
        <button
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          className="min-w-11 min-h-11 sm:min-w-8 sm:min-h-8 p-1.5 flex items-center justify-center border border-border rounded-[var(--radius-sm)] hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
      </div>
    </div>
  );
};
