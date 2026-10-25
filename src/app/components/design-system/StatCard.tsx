import * as React from 'react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgClassName?: string;
  iconColorClassName?: string;
  badge?: {
    text: string;
    variant?: 'positive' | 'negative' | 'neutral' | 'warning';
  };
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBgClassName = 'bg-primary/10',
  iconColorClassName = 'text-primary',
  badge,
  subtitle,
  className,
  onClick,
}) => {
  const getBadgeClass = (variant: StatCardProps['badge']['variant'] = 'neutral') => {
    switch (variant) {
      case 'positive':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'negative':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-secondary text-secondary-foreground border-border/80';
    }
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${title}: ${value}`}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-200',
        onClick && 'cursor-pointer hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-2xs transition-transform duration-200 group-hover:scale-110',
            iconBgClassName,
            iconColorClassName
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2.5">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        {badge && (
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-2xs',
              getBadgeClass(badge.variant)
            )}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
};
