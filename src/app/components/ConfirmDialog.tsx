import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'default' | 'destructive';
  confirmClassName?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive'; // added for backward compatibility
  noCard?: boolean;
  showInfoIcon?: boolean;
  infoTooltip?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  confirmVariant,
  confirmClassName,
  onConfirm = () => {},
  onCancel,
  variant,
  noCard = false,
  showInfoIcon = false,
  infoTooltip,
}) => {
  const resolvedConfirmVariant = confirmVariant || variant || 'destructive';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)] flex items-center gap-2">
            <span>{title}</span>
            {showInfoIcon && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full inline-flex items-center justify-center cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
                    <Info className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {infoTooltip || (title === 'New Request Type' ? 'Select a request type to continue' : 'Information about this action')}
                </TooltipContent>
              </Tooltip>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>

        {noCard ? (
          <div className="w-full">
            {message}
          </div>
        ) : (
          <div className="flex gap-3 p-4 bg-primary/5 rounded-[var(--radius)] border border-primary/20">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-[var(--text-sm)] font-[var(--font-weight-normal)] text-foreground w-full">
              {message}
            </div>
          </div>
        )}

        <DialogFooter className="pt-2 gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onCancel?.();
              onOpenChange(false);
            }}
            className="w-full sm:w-auto rounded-[var(--radius-button)]"
          >
            {cancelLabel}
          </Button>
          {confirmLabel && (
            <Button
              variant={resolvedConfirmVariant}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className={cn("w-full sm:w-auto rounded-[var(--radius-button)]", confirmClassName)}
            >
              {confirmLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};