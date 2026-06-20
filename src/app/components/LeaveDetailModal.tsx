import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import {
  FileText,
  Upload,
  Check,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaveDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveData: LeaveDetail | null;
  onEditRequest: (id: string) => void;
  onCancelRequest: (id: string) => void;
}

export interface LeaveDetail {
  id: string;
  type: string;
  dateRange: string;
  duration: string;
  status: 'requested' | 'hr' | 'complete' | 'cancelled';
  attachments: Attachment[];
  notes: NoteEntry[];
}

interface Attachment {
  name: string;
  size: string;
  date?: string;
}

interface NoteEntry {
  author: string;
  role: string;
  text: string;
  avatar?: string;
}

const stepLabels = ['Requested', 'HR', 'Complete'];

export const LeaveDetailModal: React.FC<LeaveDetailModalProps> = ({
  open,
  onOpenChange,
  leaveData,
  onEditRequest,
  onCancelRequest,
}) => {
  if (!leaveData) return null;

  const getStepIndex = () => {
    switch (leaveData.status) {
      case 'requested':
        return 0;
      case 'hr':
        return 1;
      case 'complete':
        return 2;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] max-h-[90vh] overflow-y-auto gap-3">
        <DialogHeader className="pe-8">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-1 text-start">
            <DialogTitle
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              {leaveData.type}
            </DialogTitle>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-normal)',
              }}
              className="text-muted-foreground"
            >
              {leaveData.dateRange} ({leaveData.duration})
            </span>
          </div>
          <DialogDescription className="sr-only">
            Leave request details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Attachments */}
          <div className="space-y-2">
            <h4
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
              className="text-foreground"
            >
              Attachment(s)
            </h4>
            <div className="space-y-2">
              {leaveData.attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 border border-border rounded-[var(--radius)] bg-card"
                >
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                      className="text-foreground truncate"
                    >
                      {file.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-normal)',
                      }}
                      className="text-muted-foreground"
                    >
                      {file.size}
                      {file.date && ` - ${file.date}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="text-muted-foreground hover:text-foreground" aria-label={`Review ${file.name}`}>
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <Button variant="outline" type="button" className="w-full border-dashed gap-2 rounded-[var(--radius-button)] text-muted-foreground h-[var(--button-height-default)]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <Upload className="w-4 h-4 shrink-0" />
              Upload File
            </Button>
          </div>

          {/* Notes */}
          {leaveData.notes.length > 0 && (
            <div className="space-y-2.5">
              <h4
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}
                className="text-foreground"
              >
                Notes:
              </h4>
              <div className="space-y-2.5">
                {leaveData.notes.map((note, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                        className="text-primary uppercase"
                      >
                        {note.author
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-semibold)',
                          }}
                          className="text-foreground"
                        >
                          {note.author}
                        </p>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/60" />
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-normal)',
                          }}
                          className="text-muted-foreground"
                        >
                          {note.role}
                        </p>
                      </div>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-normal)',
                        }}
                        className="text-muted-foreground mt-0.5"
                      >
                        {note.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Stepper */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-start">
              {stepLabels.map((label, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                const isLastStep = idx === stepLabels.length - 1;
                return (
                  <React.Fragment key={label}>
                    <div className="flex min-w-[64px] flex-col items-center gap-1.5">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center border transition-colors',
                          isCompleted
                            ? 'bg-chart-3 border-chart-3 text-white'
                            : 'border-border bg-card text-muted-foreground'
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            {idx + 1}
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 'var(--text-xs)',
                          fontWeight: isCurrent
                            ? 'var(--font-weight-semibold)'
                            : 'var(--font-weight-normal)',
                        }}
                        className={cn(
                          'text-center',
                          isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {label}
                      </span>
                    </div>
                    {!isLastStep && (
                      <div className="flex items-center pt-4 px-1 sm:px-2">
                        <div
                          className={cn(
                            'h-0.5 w-full transition-colors',
                            idx < currentStep ? 'bg-chart-3' : 'bg-border'
                          )}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="outline"
              className="w-full rounded-[var(--radius-button)]"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
              onClick={() => onEditRequest(leaveData.id)}
            >
              Edit Request
            </Button>
            <Button
              variant="destructive"
              className="w-full rounded-[var(--radius-button)] flex items-center gap-2"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
              onClick={() => onCancelRequest(leaveData.id)}
            >
              <span className="text-white">x</span> Cancel request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
