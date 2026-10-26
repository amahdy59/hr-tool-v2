import React from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  ariaLabel?: string;
  variant?: 'icon' | 'full' | 'compact';
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/** A compact, readable monogram with no shared SVG IDs or filter clipping. */
export const LogoIcon: React.FC<{ className?: string; ariaLabel?: string }> = ({
  className = 'w-9 h-9',
  ariaLabel = 'HR Tool',
}) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"
    className={cn('shrink-0 select-none', className)} role="img" aria-label={ariaLabel}
    data-no-auto-translate="true">
    <title>{ariaLabel}</title>
    <rect x="1" y="1" width="38" height="38" rx="10" fill="#2563EB" />
    <path d="M9 12V28M17 12V28M9 20H17M23 28V12H27A4.5 4.5 0 0 1 27 21H23M27 21L32 28"
      stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Logo: React.FC<LogoProps> = ({
  className,
  ariaLabel = "HR Tool",
  variant = 'full',
  showSubtitle = false,
  size = 'md',
}) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  if (variant === 'icon') {
    return <LogoIcon className={className || iconSizes[size]} ariaLabel={ariaLabel} />;
  }

  if (variant === 'compact') {
    return (
      <div dir="ltr" data-no-auto-translate="true" className={cn("inline-flex items-center gap-2 select-none", className)}>
        <LogoIcon className={iconSizes[size]} ariaLabel={ariaLabel} />
        <span className={cn("font-bold tracking-tight text-foreground", textSizes[size])}>
          HR
        </span>
      </div>
    );
  }

  return (
    <div
      dir="ltr"
      data-no-auto-translate="true"
      className={cn("inline-flex items-center gap-2.5 select-none text-start", className)}
    >
      <LogoIcon className={iconSizes[size]} ariaLabel={ariaLabel} />
      <div className="flex flex-col justify-center leading-none min-w-0">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className={cn("font-black tracking-tight text-foreground whitespace-nowrap", textSizes[size])}>
            HR<span className="text-primary font-bold"> Tool</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase mt-0.5 whitespace-nowrap hidden sm:block">
            Workforce Suite
          </span>
        )}
      </div>
    </div>
  );
};
