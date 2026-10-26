import React from 'react';
import { ChevronDown, CircleHelp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HelpDisclosure({ title, defaultOpen = false, className, children }: {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)} className={cn('group/help rounded-xl border border-border bg-card', className)}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <CircleHelp className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1">{title}</span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open/help:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
      </summary>
      <div className="border-t border-border">{children}</div>
    </details>
  );
}
