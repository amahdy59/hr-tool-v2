import React from 'react';

export const Logo: React.FC<{ className?: string; ariaLabel?: string }> = ({ className = "w-10 h-10", ariaLabel = "HR Logo" }) => {
  return (
    <svg
      viewBox="0 0 100 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={ariaLabel}
      role="img"
      data-no-auto-translate="true"
    >
      <text 
        x="50%" 
        y="50%" 
        dominantBaseline="central" 
        textAnchor="middle" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        fontSize="34" 
        fontWeight="600" 
        fill="currentColor" 
        letterSpacing="-0.05em"
      >
        H<tspan>R</tspan>
      </text>
    </svg>
  );
};
