import * as React from 'react';
import { Inbox, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/app/components/EmptyState';
import { Pagination } from '@/app/components/Pagination';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  align?: 'start' | 'center' | 'end';
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
  pagination,
  className,
  tableClassName,
  rowClassName,
  headerSlot,
}: DataTableProps<T>) {
  return (
    <div className={cn('border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden flex flex-col', className)}>
      {headerSlot && (
        <div className="border-b border-border/70 bg-card/60 backdrop-blur-md px-5 py-4">
          {headerSlot}
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <table className={cn('w-full border-collapse text-start text-sm', tableClassName)}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-muted/50 border-b border-border/80">
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
                      'whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground',
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
                const customRowClass = rowClassName ? rowClassName(row, index) : '';

                return (
                  <tr
                    key={key}
                    className={cn(
                      'hover:bg-muted/30 transition-colors duration-150',
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

                      return (
                        <td
                          key={col.key}
                          className={cn(
                            'whitespace-nowrap px-4 py-3.5 text-foreground align-middle text-sm',
                            alignClass,
                            col.cellClassName
                          )}
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {col.render ? col.render(row, index) : (row as any)[col.key]}
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
