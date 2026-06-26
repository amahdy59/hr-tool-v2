import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { cn } from '@/lib/utils';
import { DatePicker } from './ui/date-picker';
import { parseISO, isValid } from 'date-fns';
import { FileText, Upload, X } from 'lucide-react';
import { 
  isEgyptianWeekend, 
  calculateWorkingDays, 
  isNewlyHiredRestricted, 
  isPreviousMonthRequestRestricted, 
  calculateAnnualEntitlement 
} from '@/lib/leaveCalculations';

interface RequestLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LeaveFormData) => void;
  initialData?: Partial<LeaveFormData>;
  mode?: 'add' | 'edit';
}

export interface LeaveFormData {
  leaveType: string;
  fromDate: string;
  toDate: string;
  daysRequested: number;
  notes: string;
}

const attachmentRequiredLeaveTypes = new Set([
  'Sick',
  'Maternity',
  'Paternity',
  'Family Care',
  'Hajj',
  'Marriage',
  'Bereavement',
]);

export const RequestLeaveModal: React.FC<RequestLeaveModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = 'add',
}) => {
  // Current user mock profile details (Ahmed Mahdy)
  const gender = 'Male';
  const graduationYear = 2013;
  const hireDate = '2023-04-15';

  const leaveTypes = useMemo(() => {
    return [
      'Sick',
      'Annual Leave',
      gender === 'Female' ? 'Maternity' : null,
      gender === 'Male' ? 'Paternity' : null,
      'Family Care',
      'Hajj',
      'Marriage',
      'Bereavement',
      'Unpaid',
    ].filter(Boolean) as string[];
  }, [gender]);

  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  React.useEffect(() => {
    if (open) {
      setLeaveType(initialData?.leaveType || 'Annual Leave');
      setFromDate(initialData?.fromDate || '');
      setToDate(initialData?.toDate || '');
      setNotes(initialData?.notes || '');
      setAttachments([]);
    }
  }, [open, initialData]);

  const annualEntitlement = calculateAnnualEntitlement(graduationYear);

  const leaveBalances = useMemo<Record<string, number>>(() => {
    return {
      'Sick': 45,
      'Annual Leave': annualEntitlement,
      'Maternity': 150, // 5 months
      'Paternity': 20,  // 4 weeks * 5 working days
      'Family Care': 10, // 2 weeks * 5 working days
      'Hajj': 20, // 4 weeks = 20 working days
      'Marriage': 5, // 1 week = 5 working days
      'Bereavement': 5, // 1 week = 5 working days
      'Unpaid': 30,
    };
  }, [annualEntitlement]);

  // Compute days between selected dates (excluding Egyptian weekends Fri & Sat)
  const daysRequested = useMemo(() => {
    return calculateWorkingDays(fromDate, toDate);
  }, [fromDate, toDate]);

  const currentBalance = leaveBalances[leaveType] ?? 21;
  const remainingBalance = Math.max(0, currentBalance - daysRequested);
  const requiresAttachment = mode === 'add' && attachmentRequiredLeaveTypes.has(leaveType);
  const attachmentMissing = requiresAttachment && attachments.length === 0;

  // Validate request based on user policies
  const validationError = useMemo(() => {
    if (!fromDate || !toDate) return null;
    const from = parseISO(fromDate);
    const to = parseISO(toDate);
    if (!isValid(from) || !isValid(to) || to < from) {
      return 'Invalid date range selected.';
    }

    if (isEgyptianWeekend(fromDate)) {
      return 'Leaves cannot start on Egyptian weekends (Fridays or Saturdays).';
    }
    if (isEgyptianWeekend(toDate)) {
      return 'Leaves cannot end on Egyptian weekends (Fridays or Saturdays).';
    }

    if (daysRequested === 0) {
      return 'The selected date range only contains weekend days.';
    }

    if (leaveType === 'Annual Leave' && isNewlyHiredRestricted(hireDate, fromDate)) {
      return 'Newly hired employees cannot request vacation during the first 3 months of work.';
    }

    if (leaveType === 'Annual Leave' && isPreviousMonthRequestRestricted(fromDate)) {
      return 'Cannot request vacation for the previous month after the 5th of the current month.';
    }

    const currentYear = new Date().getFullYear();
    if (leaveType === 'Annual Leave' && from.getFullYear() > currentYear) {
      return "Vacation requests cannot be made from next year's balance.";
    }

    if (daysRequested > currentBalance) {
      return `Request of ${daysRequested} days exceeds the available balance of ${currentBalance} days.`;
    }

    return null;
  }, [fromDate, toDate, leaveType, daysRequested, currentBalance, hireDate]);

  const handleSubmit = () => {
    if (attachmentMissing || validationError) return;

    onSubmit({
      leaveType,
      fromDate,
      toDate,
      daysRequested,
      notes,
    });
  };

  const dateLabel = useMemo(() => {
    if (!fromDate && !toDate) return 'No dates selected';
    if (fromDate && toDate && daysRequested > 0) {
      return `${daysRequested} working day${daysRequested !== 1 ? 's' : ''} selected (excluding weekends)`;
    }
    return 'Select both dates';
  }, [fromDate, toDate, daysRequested]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--section-heading-size)',
              fontWeight: 'var(--section-heading-weight)',
            }}
          >
            {mode === 'edit' ? 'Edit Request' : 'Request Leave'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {mode === 'edit' ? 'Edit your leave request' : 'Request a leave'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Leave Type Select */}
          <div className="space-y-1.5">
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
              className="text-foreground block text-start w-full"
            >
              Leave Type
            </label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger className="h-10 w-full rounded-[var(--radius-input)]">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Inputs with DatePicker */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-foreground block text-start w-full"
              >
                From
              </label>
              <DatePicker
                value={fromDate}
                onChange={(d) => {
                  setFromDate(d);
                  // Auto-set toDate if empty or if toDate < fromDate
                  if (!toDate || (d && toDate && d > toDate)) {
                    setToDate(d);
                  }
                }}
                placeholder="Start date"
              />
            </div>
            <div className="space-y-1.5">
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-foreground block text-start w-full"
              >
                To
              </label>
              <DatePicker
                value={toDate}
                onChange={setToDate}
                placeholder="End date"
              />
            </div>
          </div>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-normal)',
            }}
            className={cn(
              'text-muted-foreground -mt-3',
              (daysRequested > currentBalance || !!validationError) && 'text-destructive font-medium'
            )}
          >
            {validationError ? (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">⚠️ {validationError}</span>
            ) : (
              <>
                {dateLabel}
                {daysRequested > currentBalance && ' — exceeds available balance'}
              </>
            )}
          </p>

          {/* Notes */}
          <div className="space-y-1.5">
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
              className="text-foreground block text-start w-full"
            >
              Notes (optional)
            </label>
            <textarea dir="auto"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any notes for your leave request..."
              className="w-full px-3 py-2 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring resize-none transition-shadow"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            />
          </div>

          {requiresAttachment && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                  className="text-foreground"
                >
                  Attachment required
                </label>
                <span className="text-[10px] font-[var(--font-weight-medium)] text-muted-foreground">
                  PDF, PNG, JPG up to 10MB
                </span>
              </div>
              <label
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[var(--radius)] border border-dashed border-border/80 py-4 text-muted-foreground transition-all duration-200 hover:border-primary/80 hover:bg-primary/5 hover:text-primary focus-within:ring-2 focus-within:ring-ring"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <input
                  type="file"
                  className="sr-only"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    setAttachments(files);
                  }}
                />
                <Upload className="h-5 w-5 shrink-0" />
                <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)]">
                  Upload file or drag and drop
                </span>
                <span className="text-[10px] text-muted-foreground/80">
                  Required for {leaveType.toLowerCase()} requests
                </span>
              </label>
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file) => (
                    <div key={`${file.name}-${file.size}`} className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-muted/30 px-3 py-2">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate text-[var(--text-xs)] text-foreground">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() => setAttachments((current) => current.filter((item) => item !== file))}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Balance Info */}
          <div className="flex justify-between items-end bg-muted/50 p-4 rounded-[var(--radius)] border border-border">
            <div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-normal)',
                }}
                className="text-muted-foreground"
              >
                Current Balance
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}
                className="text-foreground block text-start w-full"
              >
                {currentBalance}
              </p>
            </div>
            {daysRequested > 0 && (
              <div className="text-center">
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                  className="text-muted-foreground"
                >
                  Requesting
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                  className="text-[var(--chart-4)]"
                >
                  −{daysRequested}
                </p>
              </div>
            )}
            <div className="text-end">
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-normal)',
                }}
                className="text-muted-foreground"
              >
                Remaining when approved
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}
                className={cn(
                  remainingBalance < 0 ? 'text-destructive' : 'text-[var(--chart-3)]'
                )}
              >
                {remainingBalance}
              </p>
            </div>
          </div>

          {/* Approver Info */}
          <div className="flex items-center gap-2">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
              className="text-muted-foreground"
            >
              Approver:
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
              className="text-foreground"
            >
              Tariq Mansour
            </p>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-chart-3 hover:bg-chart-3/90 text-white"
            onClick={handleSubmit}
            disabled={daysRequested === 0 || !!validationError || attachmentMissing}
          >
            {mode === 'edit' ? 'Save Changes' : '✈ Book time off'}
            {daysRequested > 0 && mode === 'add' && (
              <span className="ms-1 opacity-80">
                ({daysRequested} day{daysRequested !== 1 ? 's' : ''})
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
