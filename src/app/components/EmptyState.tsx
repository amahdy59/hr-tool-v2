import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="relative mb-5 flex items-center justify-center">
        {/* Ambient decorative aura ring */}
        <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent blur-md pointer-events-none" />
        <div className="absolute -inset-1 rounded-full border border-dashed border-border/80 pointer-events-none" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-card to-muted/60 border border-border/80 shadow-xs">
          <Icon className="h-8 w-8 text-primary/80 dark:text-primary transition-transform duration-300 hover:scale-110" aria-hidden="true" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="rounded-xl shadow-xs"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
