import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
  totalItems?: number;
}

const PAGE_SIZE_OPTIONS = [10, 15, 30, 50];

const getVisiblePageItems = (currentPage: number, totalPages: number) => {
  const pages: Array<number | 'ellipsis-start' | 'ellipsis-end'> = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }
    return pages;
  }

  if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, 'ellipsis-end', totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1, 'ellipsis-start', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages);
  }

  return pages;
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  totalItems,
}) => {
  const { t, i18n } = useTranslation();
  const pageSizeLabelId = React.useId();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  const PreviousIcon = isArabic ? ChevronRight : ChevronLeft;
  const NextIcon = isArabic ? ChevronLeft : ChevronRight;
  const pageCount = Math.max(1, totalPages);
  const normalizedCurrentPage = Math.min(Math.max(currentPage, 1), pageCount);
  const hasResults = totalItems === undefined || totalItems > 0;
  const hasPageNavigation = pageCount > 1 && hasResults;

  if (!hasPageNavigation && !onItemsPerPageChange && totalItems === undefined) {
    return null;
  }

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= pageCount && page !== normalizedCurrentPage) {
      onPageChange(page);
    }
  };

  const pageNumbers = getVisiblePageItems(normalizedCurrentPage, pageCount);
  const startItem = totalItems !== undefined && totalItems > 0 ? (normalizedCurrentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems !== undefined ? Math.min(normalizedCurrentPage * itemsPerPage, totalItems) : 0;

  return (
    <nav
      aria-label={t('pagination.label', 'Pagination')}
      className="flex flex-col gap-4 border-t border-border/70 bg-card/60 backdrop-blur-md px-4 py-4 sm:flex-row sm:items-center sm:justify-between rounded-b-2xl"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex w-full flex-col items-center justify-center gap-3 text-[var(--text-sm)] text-muted-foreground sm:w-auto sm:flex-row sm:justify-start">
        {onItemsPerPageChange && (
          <label className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
            <span id={pageSizeLabelId}>{t('pagination.itemsPerPage', 'Items Per Page')}</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
              <SelectTrigger
                aria-labelledby={pageSizeLabelId}
                className="h-11 min-h-[44px] w-[92px] bg-card border border-border/80 text-foreground hover:bg-muted/80 focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:border-ring rounded-xl transition-all shadow-2xs font-[var(--font-weight-medium)]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" className="min-w-[var(--radix-select-trigger-width)]">
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)} className="ps-2.5 pe-8">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        )}

        {totalItems !== undefined && (
          <div className="text-center text-[var(--text-sm)] font-medium text-muted-foreground sm:text-start" aria-live="polite">
            {totalItems === 0
              ? t('pagination.empty', 'No entries found')
              : t('pagination.info', {
                  defaultValue: 'Showing {{start}} to {{end}} of {{total}} entries',
                  start: startItem,
                  end: endItem,
                  total: totalItems,
                })}
          </div>
        )}
      </div>

      {hasPageNavigation && (
        <ul className="m-0 flex w-full list-none flex-row items-center justify-center gap-1.5 p-1 bg-muted/40 backdrop-blur-md rounded-2xl border border-border/70 shadow-2xs sm:w-auto sm:justify-end">
          <li className="list-item">
            <Button
              variant="outline"
              onClick={() => handlePageClick(normalizedCurrentPage - 1)}
              disabled={normalizedCurrentPage <= 1}
              aria-label={t('pagination.previous', 'Previous Page')}
              className={cn(
                "h-10 px-3.5 bg-card/80 border border-border/70 hover:border-border text-foreground hover:bg-card rounded-xl disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-2xs cursor-pointer"
              )}
            >
              <PreviousIcon className="pagination-nav-icon h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline text-xs font-semibold">{t('pagination.previousText', 'Previous')}</span>
            </Button>
          </li>

          {pageNumbers.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <li key={`ellipsis-${index}`} className="list-item">
                  <span
                    className="flex h-10 w-9 items-center justify-center text-xs font-semibold text-muted-foreground"
                    aria-hidden="true"
                  >
                    ...
                  </span>
                  <span className="sr-only">{t('pagination.skippedPages', 'Skipped pages')}</span>
                </li>
              );
            }

            const isActive = page === normalizedCurrentPage;
            return (
              <li
                key={`page-${page}`}
                className={cn(
                  !isActive && page !== 1 && page !== pageCount ? 'hidden min-[380px]:list-item' : undefined,
                  'list-item'
                )}
              >
                <Button
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => handlePageClick(page)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={t('pagination.page', { defaultValue: 'Page {{page}}', page })}
                  className={cn(
                    'h-10 min-w-10 px-3 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs',
                    isActive
                      ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                      : 'bg-card/80 border border-border/70 text-foreground hover:bg-card hover:border-border'
                  )}
                >
                  {page}
                </Button>
              </li>
            );
          })}

          <li className="list-item">
            <Button
              variant="outline"
              onClick={() => handlePageClick(normalizedCurrentPage + 1)}
              disabled={normalizedCurrentPage >= pageCount}
              aria-label={t('pagination.next', 'Next Page')}
              className={cn(
                "h-10 px-3.5 bg-card/80 border border-border/70 hover:border-border text-foreground hover:bg-card rounded-xl disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-2xs cursor-pointer"
              )}
            >
              <span className="hidden sm:inline text-xs font-semibold">{t('pagination.nextText', 'Next')}</span>
              <NextIcon className="pagination-nav-icon h-4 w-4" aria-hidden="true" />
            </Button>
          </li>
        </ul>
      )}
    </nav>
  );
};
