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
import { differenceInBusinessDays, parseISO, isValid, format } from 'date-fns';

interface RequestLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LeaveFormData) => void;
}

export interface LeaveFormData {
  leaveType: string;
  fromDate: string;
  toDate: string;
  daysRequested: number;
  notes: string;
}

const leaveTypes = [
  'Sick',
  'Annual Leave',
  'Maternity',
  'Paternity',
  'Family Care',
  'Hajj',
  'Marriage',
  'Bereavement',
  'Unpaid',
];

// Balance per leave type (mock data)
const leaveBalances: Record<string, number> = {
  'Sick': 45,
  'Annual Leave': 21,
  'Maternity': 150,
  'Paternity': 14,
  'Family Care': 14,
  'Hajj': 28,
  'Marriage': 7,
  'Bereavement': 7,
  'Unpaid': 7,
};

export const RequestLeaveModal: React.FC<RequestLeaveModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [notes, setNotes] = useState('');

  // Compute days between selected dates (business days, inclusive)
  const daysRequested = useMemo(() => {
    if (!fromDate || !toDate) return 0;
    const from = parseISO(fromDate);
    const to = parseISO(toDate);
    if (!isValid(from) || !isValid(to) || to < from) return 0;
    // differenceInBusinessDays doesn't include start day, so add 1
    return differenceInBusinessDays(to, from) + 1;
  }, [fromDate, toDate]);

  const currentBalance = leaveBalances[leaveType] ?? 21;
  const remainingBalance = Math.max(0, currentBalance - daysRequested);

  const handleSubmit = () => {
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
      return `${daysRequested} day${daysRequested !== 1 ? 's' : ''} selected`;
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
            Request Leave
          </DialogTitle>
          <DialogDescription className="sr-only">
            Request a leave
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
              className="text-foreground"
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-foreground"
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
                className="text-foreground"
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
              daysRequested > 0 && daysRequested > currentBalance && 'text-destructive'
            )}
          >
            {dateLabel}
            {daysRequested > currentBalance && ' — exceeds available balance'}
          </p>

          {/* Notes */}
          <div className="space-y-1.5">
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
              className="text-foreground"
            >
              Notes (optional)
            </label>
            <textarea
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
                className="text-foreground"
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
              Mahmoud Abbas
            </p>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-chart-3 hover:bg-chart-3/90 text-white"
            onClick={handleSubmit}
            disabled={daysRequested === 0 || daysRequested > currentBalance}
          >
            ✈ Book time off
            {daysRequested > 0 && (
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