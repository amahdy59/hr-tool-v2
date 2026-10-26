import React from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  ariaLabel?: string;
  variant?: 'icon' | 'full' | 'compact';
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Modern HR Tool Brand Logo Mark
 * Represents human connectivity, organizational intelligence, and workforce synergy.
 * Fully accessible with WCAG 2.2 AAA contrast, high-contrast mode (.hc) support,
 * and scalable vector paths.
 */
export const LogoIcon: React.FC<{ className?: string; ariaLabel?: string }> = ({
  className = "w-9 h-9",
  ariaLabel = "HR Tool Insignia",
}) => {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      role="img"
      aria-label={ariaLabel}
      data-no-auto-translate="true"
    >
      <title>{ariaLabel}</title>
      <defs>
        {/* Dynamic Brand Gradients */}
        <linearGradient id="hr-brand-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        <linearGradient id="hr-accent-gradient" x1="24" y1="8" x2="36" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>

        <linearGradient id="hr-mark-gradient" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>

        {/* Ambient Drop Shadow for depth */}
        <filter id="hr-mark-shadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Rounded squircle emblem container */}
      <rect
        width="40"
        height="40"
        rx="10"
        className="fill-[url(#hr-brand-gradient)] dark:fill-[url(#hr-brand-gradient)] hc:fill-card hc:stroke-2 hc:stroke-foreground"
      />

      {/* Geometric Human & Monogram Motif (H + R Nexus) */}
      <g filter="url(#hr-mark-shadow)" className="hc:filter-none">
        {/* Left vertical pillar of 'H' */}
        <rect
          x="10.5"
          y="11"
          width="4"
          height="18"
          rx="2"
          className="fill-[url(#hr-mark-gradient)] hc:fill-foreground"
        />

        {/* Dynamic connecting nexus crossbar */}
        <path
          d="M13 18.5H23C24.1 18.5 25 19.4 25 20.5C25 21.6 24.1 22.5 23 22.5H13C11.9 22.5 11 21.6 11 20.5C11 19.4 11.9 18.5 13 18.5Z"
          className="fill-[url(#hr-mark-gradient)] hc:fill-foreground"
        />

        {/* Right vertical pillar of 'R' */}
        <rect
          x="20.5"
          y="11"
          width="4"
          height="18"
          rx="2"
          className="fill-[url(#hr-mark-gradient)] hc:fill-foreground"
        />

        {/* Upper rounded loop of 'R' */}
        <path
          d="M23 11H27C29.76 11 31.5 12.74 31.5 15.2C31.5 17.66 29.76 19.4 27 19.4H23V11Z"
          fill="none"
          stroke="url(#hr-mark-gradient)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hc:stroke-foreground"
        />

        {/* Dynamic dynamic sweeping leg of 'R' */}
        <path
          d="M26 18.5L30.2 27.2C30.7 28.2 30 29.5 28.8 29.5C28.2 29.5 27.7 29.1 27.4 28.6L23.8 21.5"
          fill="none"
          stroke="url(#hr-mark-gradient)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hc:stroke-foreground"
        />

        {/* Human Talent Spark Node (Cyan / Emerald Glow) */}
        <circle
          cx="29.5"
          cy="9.5"
          r="2.75"
          className="fill-[url(#hr-accent-gradient)] stroke-white stroke-[1.5] dark:stroke-slate-900 hc:fill-foreground hc:stroke-card"
        />
      </g>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className,
  ariaLabel = "HR Tool",
  variant = 'full',
  showSubtitle = true,
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
      <div className={cn("inline-flex items-center gap-2 select-none", className)}>
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
            HR<span className="text-primary font-bold">Tool</span>
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 shrink-0">
            PRO
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
