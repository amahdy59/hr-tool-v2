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
}) => {
  const [missionType, setMissionType] = useState('Work From Home');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [notes, setNotes] = useState('');

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
