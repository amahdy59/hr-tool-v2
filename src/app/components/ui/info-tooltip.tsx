import * as React from "react";
import { Info } from "lucide-react";

import { cn } from "./utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type InfoTooltipProps = {
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  contentClassName?: string;
  iconClassName?: string;
  side?: React.ComponentProps<typeof TooltipContent>["side"];
};

function InfoTooltip({
  children,
  ariaLabel = "Information",
  className,
  contentClassName,
  iconClassName,
  side = "top",
}: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(
            "inline-flex h-4 min-h-0 w-4 min-w-0 shrink-0 items-center justify-center rounded-full p-0 text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 cursor-pointer",
            className,
          )}
        >
          <Info className={cn("h-4 w-4", iconClassName)} aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className={cn("max-w-[260px] text-[var(--text-xs)]", contentClassName)}>
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

export { InfoTooltip };
