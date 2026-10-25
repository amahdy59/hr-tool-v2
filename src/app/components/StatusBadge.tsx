import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'muted' | 'pending' | 'noshow' | 'approved' | 'inoffice' | 'weekend' | 'rejected' | 'cancelled';
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ children, variant = 'muted', className }) => {
  const variants: Record<string, string> = {
    success: 'bg-[#E7F6EF] text-[#064E3B] border border-[#047857] dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-700',
    warning: 'bg-[#FFF4DE] text-[#7C2D12] border border-[#C2410C] dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700',
    error: 'bg-[#FDECEC] text-[#7F1D1D] border border-[#B91C1C] dark:bg-red-950/70 dark:text-red-200 dark:border-red-700',
    info: 'bg-[#EAF2FF] text-[#1E3A8A] border border-[#2563EB] dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-700',
    muted: 'bg-[#EEF2F7] text-[#334155] border border-[#94A3B8] dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-600',
    pending: 'bg-[#FFF4DE] text-[#7C2D12] border border-[#C2410C] dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700',
    noshow: 'bg-[#EEF2F7] text-[#334155] border border-[#64748B] dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-600',
    approved: 'bg-[#E7F6EF] text-[#064E3B] border border-[#047857] dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-700',
    inoffice: 'bg-[#EAF2FF] text-[#1E3A8A] border border-[#2563EB] dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-700',
    weekend: 'bg-[#EEF2F7] text-[#334155] border border-[#94A3B8] dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-600',
    rejected: 'bg-[#EEF2F7] text-[#334155] border border-[#64748B] dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-600',
    cancelled: 'bg-[#FDECEC] text-[#7F1D1D] border border-[#B91C1C] dark:bg-red-950/70 dark:text-red-200 dark:border-red-700',
  };

  const dots: Record<string, string> = {
    success: 'bg-emerald-500 dark:bg-emerald-400',
    approved: 'bg-emerald-500 dark:bg-emerald-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    pending: 'bg-amber-500 dark:bg-amber-400',
    error: 'bg-red-500 dark:bg-red-400',
    cancelled: 'bg-red-500 dark:bg-red-400',
    info: 'bg-blue-500 dark:bg-blue-400',
    inoffice: 'bg-blue-500 dark:bg-blue-400',
    muted: 'bg-slate-400 dark:bg-slate-500',
    noshow: 'bg-slate-400 dark:bg-slate-500',
    weekend: 'bg-slate-400 dark:bg-slate-500',
    rejected: 'bg-slate-400 dark:bg-slate-500',
  };

  return (
    <span className={cn(
      'px-3 py-1 rounded-full text-[var(--text-xs)] font-[var(--font-weight-semibold)] tracking-wide inline-flex items-center justify-center min-w-[76px] whitespace-nowrap shadow-2xs transition-all',
      variants[variant] || variants.muted,
      className
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full inline-block me-1.5 shrink-0', dots[variant] || dots.muted)} aria-hidden="true" />
      {children}
    </span>
  );
};
