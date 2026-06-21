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
  Eye,
  Calendar,
  Clock,
  AlertCircle,
  XCircle,
  FileCheck,
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

  // Status Badge Styling
  const getStatusBadge = () => {
    switch (leaveData.status) {
      case 'requested':
      case 'hr':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-[var(--font-weight-medium)] bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            Pending Approval
          </span>
        );
      case 'complete':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-[var(--font-weight-medium)] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            <Check className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-[var(--font-weight-medium)] bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto gap-6 p-6 scrollbar-thin">
        {/* Modal Header */}
        <DialogHeader className="text-start pe-8 space-y-1.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <DialogTitle
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
              className="text-foreground"
            >
              {leaveData.type}
            </DialogTitle>
            {getStatusBadge()}
          </div>
          <DialogDescription className="sr-only">
            Leave request details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-[var(--radius)] border border-border/80 bg-muted/20">
              <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">Date Range</span>
                <span className="block text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground truncate">{leaveData.dateRange}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-[var(--radius)] border border-border/80 bg-muted/20">
              <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">Duration</span>
                <span className="block text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground truncate">{leaveData.duration}</span>
              </div>
            </div>
          </div>

          {/* Stepper (Only show if not cancelled) */}
          {leaveData.status !== 'cancelled' && (
            <div className="p-4 rounded-[var(--radius)] border border-border bg-card shadow-[var(--elevation-sm)] space-y-3">
              <span className="block text-[11px] text-muted-foreground font-[var(--font-weight-medium)] uppercase tracking-wider text-start">Request Flow</span>
              <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-start pt-1">
                {stepLabels.map((label, idx) => {
                  const isCompleted = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  const isLastStep = idx === stepLabels.length - 1;
                  return (
                    <React.Fragment key={label}>
                      <div className="flex min-w-[64px] flex-col items-center gap-1.5">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300',
                            isCompleted
                              ? 'bg-chart-3 border-chart-3 text-white shadow-sm'
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
                              'h-[3px] w-full transition-all duration-300 rounded-full',
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
          )}

          {/* Attachments Section */}
          <div className="space-y-3">
            <h4
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
              className="text-foreground text-start"
            >
              Attachment(s)
            </h4>
            <div className="space-y-2">
              {leaveData.attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 border border-border/80 rounded-[var(--radius)] bg-card hover:bg-muted/10 hover:border-border transition-all duration-200 shadow-sm"
                >
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center shrink-0 text-muted-foreground">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0 text-start">
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
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                      aria-label={`Review ${file.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Upload Drop Zone */}
            <button
              type="button"
              className="w-full border border-dashed border-border/80 hover:border-primary/80 hover:bg-primary/5 transition-all duration-200 py-3 rounded-[var(--radius)] flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Upload className="w-5 h-5 shrink-0" />
              <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)]">Upload file or drag and drop</span>
              <span className="text-[10px] text-muted-foreground/80">PDF, PNG, JPG up to 10MB</span>
            </button>
          </div>

          {/* Notes / Timeline Section */}
          {leaveData.notes.length > 0 && (
            <div className="space-y-3">
              <h4
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}
                className="text-foreground text-start"
              >
                Notes:
              </h4>
              <div className="space-y-3" style={{ unicodeBidi: 'plaintext' }}>
                {leaveData.notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-3 rounded-[var(--radius)] border border-border/60 bg-muted/10 text-start"
                  >
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
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
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
                          lineHeight: '1.6',
                        }}
                        className="text-muted-foreground mt-1 whitespace-pre-line"
                      >
                        {note.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(leaveData.status === 'requested' || leaveData.status === 'hr') && (
            <div className="flex flex-col gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full rounded-[var(--radius-button)] h-[var(--button-height-default)]"
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
                className="w-full rounded-[var(--radius-button)] flex items-center justify-center gap-2 h-[var(--button-height-default)]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                onClick={() => onCancelRequest(leaveData.id)}
              >
                <XCircle className="w-4 h-4 shrink-0 text-white" />
                Cancel request
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
