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
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
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
          className="rounded-[var(--radius-button)]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
