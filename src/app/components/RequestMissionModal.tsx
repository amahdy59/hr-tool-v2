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
import { differenceInBusinessDays, parseISO, isValid } from 'date-fns';

interface RequestMissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MissionFormData) => void;
  initialData?: Partial<MissionFormData>;
}

export interface MissionFormData {
  missionType: string;
  fromDate: string;
  toDate: string;
  daysRequested: number;
  notes: string;
}

const missionTypes = [
  'Work From Home',
  'SE Returns (RTO)',
  'VISA leaving',
  'Embassy Interview',
  'Military Postpone',
  'Travel Insurance',
  'Other',
];

const MISSION_BALANCE = 21;

export const RequestMissionModal: React.FC<RequestMissionModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}) => {
  const [missionType, setMissionType] = useState('Work From Home');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (open) {
      setMissionType(initialData?.missionType || 'Work From Home');
      setFromDate(initialData?.fromDate || '');
      setToDate(initialData?.toDate || '');
      setNotes(initialData?.notes || '');
    }
  }, [open, initialData]);

  // Compute days between selected dates
  const daysRequested = useMemo(() => {
    if (!fromDate || !toDate) return 0;
    const from = parseISO(fromDate);
    const to = parseISO(toDate);
    if (!isValid(from) || !isValid(to) || to < from) return 0;
    return differenceInBusinessDays(to, from) + 1;
  }, [fromDate, toDate]);

  const currentBalance = MISSION_BALANCE;
  const remainingBalance = Math.max(0, currentBalance - daysRequested);

  const handleSubmit = () => {
    onSubmit({ missionType, fromDate, toDate, daysRequested, notes });
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
            Request Mission
          </DialogTitle>
          <DialogDescription className="sr-only">
            Request a mission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Mission Type Select */}
          <div className="space-y-1.5">
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
              className="text-foreground block text-start w-full"
            >
              Mission Type
            </label>
            <Select value={missionType} onValueChange={setMissionType}>
              <SelectTrigger className="h-10 w-full rounded-[var(--radius-input)]">
                <SelectValue placeholder="Select mission type" />
              </SelectTrigger>
              <SelectContent>
                {missionTypes.map((type) => (
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
              className="text-foreground block text-start w-full"
            >
              Notes (optional)
            </label>
            <textarea dir="auto"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any notes for your mission request..."
              className="w-full px-3 py-2 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring resize-none transition-shadow"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            />
          </div>

          {/* Balance Info */}
          <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3.5 rounded-[var(--radius-lg)] border border-border">
            <div className="flex flex-col items-center justify-center p-3 rounded-[var(--radius)] bg-card/60 border border-border/50 text-center shadow-xs">
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-muted-foreground uppercase tracking-wider mb-1 text-center"
              >
                Current Balance
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-weight-bold)',
                }}
                className="text-foreground"
              >
                {currentBalance}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-[var(--radius)] bg-card/60 border border-border/50 text-center shadow-xs">
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-muted-foreground uppercase tracking-wider mb-1 text-center"
              >
                Requesting
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-weight-bold)',
                }}
                className={daysRequested > 0 ? "text-[var(--chart-4)]" : "text-muted-foreground/60"}
              >
                {daysRequested > 0 ? `-${daysRequested}` : '0'}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-[var(--radius)] bg-card/60 border border-border/50 text-center shadow-xs">
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                className="text-muted-foreground uppercase tracking-wider mb-1 text-center"
              >
                Remaining when approved
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-weight-bold)',
                }}
                className={cn(
                  remainingBalance < 0 ? 'text-destructive animate-pulse' : 'text-[var(--chart-3)]'
                )}
              >
                {remainingBalance}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-chart-3 hover:bg-chart-3/90 text-white"
            onClick={handleSubmit}
            disabled={daysRequested === 0 || daysRequested > currentBalance}
          >
            ✈ Book mission
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
