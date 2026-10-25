import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  footerSlot?: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badge,
  headerAction,
  children,
  footerSlot,
  className,
}) => {
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'flex flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all sm:p-6',
        className
      )}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {subtitle && (
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {subtitle}
            </p>
          )}
          <h3 id={headingId} className="text-base font-bold text-foreground">
            {title}
          </h3>
        </div>

        {(badge || headerAction) && (
          <div className="flex items-center gap-2">
            {badge}
            {headerAction}
          </div>
        )}
      </div>

      <div className="relative min-w-0 flex-1">
        {children}
      </div>

      {footerSlot && (
        <div className="mt-4 pt-3 border-t border-border/60">
          {footerSlot}
        </div>
      )}
    </section>
  );
};

export interface ChartTooltipItem {
  name: string;
  value: string | number;
  color?: string;
  unit?: string;
}

export const ChartTooltipContent: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
  title?: string;
}> = ({ active, payload, label, title }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-2xl border border-border/80 bg-popover/95 p-3.5 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 text-xs">
      {(title || label) && (
        <p className="mb-2 font-semibold text-foreground border-b border-border/60 pb-1.5">
          {title || label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((item, idx) => (
          <div key={`tooltip-item-${idx}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: item.color || item.fill || 'var(--primary)' }}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-semibold text-foreground">
              {item.value}
              {item.unit ? ` ${item.unit}` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
