import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'muted' | 'pending' | 'noshow' | 'approved' | 'inoffice' | 'weekend' | 'rejected' | 'cancelled';
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ children, variant = 'muted', className }) => {
  const variants: Record<string, string> = {
    success: 'bg-chart-3/15 text-chart-3',
    warning: 'bg-chart-4/15 text-chart-4',
    error: 'bg-destructive/15 text-destructive',
    info: 'bg-primary/15 text-primary',
    muted: 'bg-muted text-muted-foreground',
    pending: 'bg-chart-4/15 text-chart-4',
    noshow: 'bg-chart-5/15 text-chart-5',
    approved: 'bg-chart-3/15 text-chart-3',
    inoffice: 'bg-primary/15 text-primary',
    weekend: 'bg-muted text-muted-foreground',
    rejected: 'bg-destructive/15 text-destructive',
    cancelled: 'bg-destructive/15 text-destructive',
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 rounded-full text-[var(--text-xs)] font-[var(--font-weight-medium)] inline-flex items-center justify-center min-w-[72px]',
      variants[variant] || variants.muted,
      className
    )}>
      {children}
    </span>
  );
};
