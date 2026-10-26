import * as React from 'react';
import { Inbox, type LucideIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/app/components/EmptyState';
import { Pagination } from '@/app/components/Pagination';
import { Button } from '@/app/components/ui/button';
import { useTranslation } from 'react-i18next';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  align?: 'start' | 'center' | 'end';
  isRowHeader?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T, index: number) => string | number;
  caption?: string;
  isLoading?: boolean;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  banded?: boolean;
  density?: 'compact' | 'comfortable';
  selectedRowKeys?: (string | number)[];
  selectionBanner?: {
    count: number;
    total?: number;
    onClear?: () => void;
    actions?: React.ReactNode;
  };
  onRowClick?: (row: T, index: number) => void;
  // Optional Pagination
  pagination?: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems?: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (items: number) => void;
  };
  className?: string;
  tableClassName?: string;
  headerSlot?: React.ReactNode;
  rowClassName?: (row: T, index: number) => string | undefined;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  caption,
  isLoading,
  emptyIcon = Inbox,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records to display at this time.',
  emptyActionLabel,
  onEmptyAction,
  banded = true,
  density = 'comfortable',
  selectedRowKeys,
  selectionBanner,
  onRowClick,
  pagination,
  className,
  tableClassName,
  rowClassName,
  headerSlot,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const selectedSet = React.useMemo(
    () => new Set(selectedRowKeys ?? []),
    [selectedRowKeys]
  );

  const cellPadding = density === 'compact' ? 'px-3 py-2 text-xs' : 'px-4 py-3.5 text-sm';
  const headerPadding = density === 'compact' ? 'px-3 py-2 text-[11px]' : 'px-4 py-3.5 text-xs';

  return (
    <div className={cn('border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden flex flex-col', className)}>
      {headerSlot && (
        <div className="border-b border-border/70 bg-card/60 backdrop-blur-md px-5 py-4">
          {headerSlot}
        </div>
      )}

      {/* Enterprise Selection Banner (GitHub / AWS Console pattern) */}
      {selectionBanner && selectionBanner.count > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-primary/10 border-b border-primary/20 text-sm animate-in fade-in-50 duration-150">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {selectionBanner.count}
            </span>
            <span className="font-medium text-foreground">
              {selectionBanner.count} {selectionBanner.total ? `of ${selectionBanner.total}` : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            {selectionBanner.actions}
            {selectionBanner.onClear && (
              <Button
                variant="ghost"
                size="sm"
                onClick={selectionBanner.onClear}
                className="h-8 gap-1 rounded-lg text-xs hover:bg-primary/15 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
                Clear
              </Button>
            )}
          </div>
        </div>
      )}

      <div role="region" aria-label={caption || t('common.scrollableTable', 'Scrollable table')} tabIndex={0} className="overflow-x-auto w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        <table className={cn('w-full border-collapse text-start text-sm', tableClassName)}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-muted/50 border-b border-border/80 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              {columns.map((col) => {
                const alignClass =
                  col.align === 'end'
                    ? 'text-end'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-start';

                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      'whitespace-nowrap font-semibold uppercase tracking-wider text-muted-foreground',
                      headerPadding,
                      alignClass,
                      col.headerClassName
                    )}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-xs font-medium">Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                    className="py-12 border-0 bg-transparent shadow-none"
                  />
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const key = keyExtractor(row, index);
                const isSelected = selectedSet.has(key);
                const customRowClass = rowClassName ? rowClassName(row, index) : '';

                return (
                  <tr
                    key={key}
                    data-state={isSelected ? 'selected' : undefined}
                    aria-selected={isSelected}
                    onClick={onRowClick ? (e) => {
                      if ((e.target as HTMLElement).closest('button, a, input, select, textarea, [role="button"], [role="checkbox"], [role="switch"]')) return;
                      onRowClick(row, index);
                    } : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                              e.preventDefault();
                              onRowClick(row, index);
                            }
                          }
                        : undefined
                    }
                    tabIndex={onRowClick ? 0 : undefined}
                    className={cn(
                      'transition-colors duration-150',
                      isSelected
                        ? 'bg-primary/10 dark:bg-primary/15 border-s-4 border-s-primary'
                        : banded
                        ? 'even:bg-muted/[0.15] hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08]'
                        : 'hover:bg-muted/30',
                      onRowClick && 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                      customRowClass
                    )}
                  >
                    {columns.map((col) => {
                      const alignClass =
                        col.align === 'end'
                          ? 'text-end'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-start';

                      const content = col.render ? col.render(row, index) : (row as any)[col.key];

                      if (col.isRowHeader) {
                        return (
                          <th
                            key={col.key}
                            scope="row"
                            className={cn(
                              'whitespace-nowrap text-foreground font-semibold align-middle',
                              cellPadding,
                              alignClass,
                              col.cellClassName
                            )}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {content}
                          </th>
                        );
                      }

                      return (
                        <td
                          key={col.key}
                          className={cn(
                            'whitespace-nowrap text-foreground align-middle',
                            cellPadding,
                            alignClass,
                            col.cellClassName
                          )}
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="no-print border-t border-border/70">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            itemsPerPage={pagination.itemsPerPage}
            totalItems={pagination.totalItems}
            onPageChange={pagination.onPageChange}
            onItemsPerPageChange={pagination.onItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
}
