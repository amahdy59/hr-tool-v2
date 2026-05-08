import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'muted' | 'pending' | 'noshow' | 'approved' | 'inoffice' | 'weekend' | 'rejected' | 'cancelled';
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ children, variant = 'muted', className }) => {
  const variants: Record<string, string> = {
    success: 'bg-[#E7F6EF] text-[#064E3B] border border-[#047857]',
    warning: 'bg-[#FFF4DE] text-[#7C2D12] border border-[#C2410C]',
    error: 'bg-[#FDECEC] text-[#7F1D1D] border border-[#B91C1C]',
    info: 'bg-[#EAF2FF] text-[#1E3A8A] border border-[#2563EB]',
    muted: 'bg-[#EEF2F7] text-[#334155] border border-[#94A3B8]',
    pending: 'bg-[#FFF4DE] text-[#7C2D12] border border-[#C2410C]',
    noshow: 'bg-[#EEF2F7] text-[#334155] border border-[#64748B]',
    approved: 'bg-[#E7F6EF] text-[#064E3B] border border-[#047857]',
    inoffice: 'bg-[#EAF2FF] text-[#1E3A8A] border border-[#2563EB]',
    weekend: 'bg-[#EEF2F7] text-[#334155] border border-[#94A3B8]',
    rejected: 'bg-[#EEF2F7] text-[#334155] border border-[#64748B]',
    cancelled: 'bg-[#FDECEC] text-[#7F1D1D] border border-[#B91C1C]',
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 rounded-full text-[var(--text-xs)] font-[var(--font-weight-semibold)] inline-flex items-center justify-center min-w-[72px]',
      variants[variant] || variants.muted,
      className
    )}>
      {children}
    </span>
  );
};
