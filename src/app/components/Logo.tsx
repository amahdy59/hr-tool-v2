import React from 'react';

export const Logo: React.FC<{ className?: string; ariaLabel?: string }> = ({ className = "w-10 h-10", ariaLabel = "HR Tool" }) => {
  return (
    <div
      className={`flex items-center justify-center font-bold text-center tracking-tight leading-none ${className}`}
      aria-label={ariaLabel}
      role="img"
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: "min(34px, 100%)",
      }}
    >
      {ariaLabel}
    </div>
  );
};
