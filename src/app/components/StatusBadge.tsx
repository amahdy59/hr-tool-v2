import React from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  UserX,
  Coffee,
  MinusCircle,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'muted'
    | 'pending'
    | 'noshow'
    | 'approved'
    | 'inoffice'
    | 'weekend'
    | 'rejected'
    | 'cancelled';
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'default';
}

const statusIcons: Record<string, LucideIcon> = {
  success: CheckCircle2,
  approved: CheckCircle2,
  warning: Clock,
  pending: Clock,
  error: XCircle,
  cancelled: XCircle,
  rejected: XCircle,
  info: Building2,
  inoffice: Building2,
  noshow: UserX,
  weekend: Coffee,
  muted: MinusCircle,
};

export const StatusBadge: React.FC<BadgeProps> = ({
  children,
  variant = 'muted',
  className,
  showIcon = true,
  size = 'default',
}) => {
  const variants: Record<string, string> = {
    success:
      'bg-emerald-500/15 text-emerald-800 border-emerald-500/30 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-700',
    warning:
      'bg-amber-500/15 text-amber-800 border-amber-500/30 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700',
    error:
      'bg-rose-500/15 text-rose-800 border-rose-500/30 dark:bg-red-950/70 dark:text-red-200 dark:border-red-700',
    info:
      'bg-blue-500/15 text-blue-800 border-blue-500/30 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-700',
    muted:
      'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-600',
    pending:
      'bg-amber-500/15 text-amber-800 border-amber-500/30 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700',
    noshow:
      'bg-slate-500/15 text-slate-700 border-slate-500/30 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-600',
    approved:
      'bg-emerald-500/15 text-emerald-800 border-emerald-500/30 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-700',
    inoffice:
      'bg-blue-500/15 text-blue-800 border-blue-500/30 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-700',
    weekend:
      'bg-purple-500/15 text-purple-800 border-purple-500/30 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-600',
    rejected:
      'bg-rose-500/15 text-rose-800 border-rose-500/30 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-600',
    cancelled:
      'bg-rose-500/15 text-rose-800 border-rose-500/30 dark:bg-red-950/70 dark:text-red-200 dark:border-red-700',
  };

  const dots: Record<string, string> = {
    success: 'bg-emerald-500 dark:bg-emerald-400',
    approved: 'bg-emerald-500 dark:bg-emerald-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    pending: 'bg-amber-500 dark:bg-amber-400',
    error: 'bg-rose-500 dark:bg-rose-400',
    cancelled: 'bg-rose-500 dark:bg-rose-400',
    info: 'bg-blue-500 dark:bg-blue-400',
    inoffice: 'bg-blue-500 dark:bg-blue-400',
    muted: 'bg-slate-400 dark:bg-slate-500',
    noshow: 'bg-slate-400 dark:bg-slate-500',
    weekend: 'bg-purple-400 dark:bg-purple-400',
    rejected: 'bg-rose-400 dark:bg-rose-400',
  };

  const Icon = statusIcons[variant] || MinusCircle;

  return (
    <span
      className={cn(
        'rounded-full font-semibold tracking-wide inline-flex items-center justify-center whitespace-nowrap border shadow-2xs backdrop-blur-xs transition-all duration-200',
        size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1 min-w-[64px]' : 'px-2.5 py-1 text-xs gap-1.5 min-w-[76px]',
        variants[variant] || variants.muted,
        className
      )}
    >
      {showIcon ? (
        <Icon className={cn('shrink-0', size === 'sm' ? 'size-3' : 'size-3.5')} aria-hidden="true" />
      ) : (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full inline-block shrink-0',
            dots[variant] || dots.muted
          )}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
