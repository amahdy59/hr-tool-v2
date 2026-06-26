import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

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
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  const PreviousIcon = isArabic ? ChevronRight : ChevronLeft;
  const NextIcon = isArabic ? ChevronLeft : ChevronRight;

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic to show: 1 ... current-1 current current+1 ... totalPages
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'ellipsis-end', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis-start', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          'ellipsis-start',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          'ellipsis-end',
          totalPages
        );
      }
    }

    return pages;
  };

  if (totalPages <= 1 && !onItemsPerPageChange) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div 
      className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60 bg-muted/10 rounded-b-[var(--radius)]"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Items per page selector */}
      <div className="flex items-center gap-2.5 text-[var(--text-sm)] text-muted-foreground w-full sm:w-auto justify-center sm:justify-start whitespace-nowrap shrink-0">
        <span>{t('pagination.itemsPerPage', 'Items Per Page')}</span>
        {onItemsPerPageChange ? (
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="min-h-[44px] sm:h-9 px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] text-center outline-none cursor-pointer hover:bg-muted/50 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm font-medium"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        ) : (
          <div className="min-h-[44px] sm:h-9 px-3.5 border border-border rounded-[var(--radius-input)] bg-muted/30 text-muted-foreground text-[var(--text-sm)] flex items-center justify-center font-medium">
            {itemsPerPage}
          </div>
        )}
      </div>

      {/* Page navigation */}
      <div className="flex items-center justify-center sm:justify-end gap-1.5 pt-1 sm:pt-0 w-full sm:w-auto">
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            "w-11 h-11 flex items-center justify-center border border-border rounded-[var(--radius-button)] bg-card text-foreground hover:bg-muted transition-all duration-200 cursor-pointer shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          )}
          aria-label={t('pagination.previous', 'Previous Page')}
        >
          <PreviousIcon className="pagination-nav-icon w-4.5 h-4.5 text-foreground" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-11 h-11 flex items-center justify-center text-muted-foreground/60 select-none text-[var(--text-sm)] font-medium"
                >
                  •••
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={`page-${page}`}
                onClick={() => handlePageClick(page)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={t('pagination.page', { defaultValue: 'Page {{page}}', page })}
                className={cn(
                  "w-11 h-11 flex items-center justify-center rounded-[var(--radius-button)] text-[var(--text-sm)] font-medium transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/95"
                    : "border border-border bg-card text-foreground hover:bg-muted shadow-sm"
                )}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            "w-11 h-11 flex items-center justify-center border border-border rounded-[var(--radius-button)] bg-card text-foreground hover:bg-muted transition-all duration-200 cursor-pointer shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          )}
          aria-label={t('pagination.next', 'Next Page')}
        >
          <NextIcon className="pagination-nav-icon w-4.5 h-4.5 text-foreground" />
        </button>
      </div>
    </div>
  );
};
