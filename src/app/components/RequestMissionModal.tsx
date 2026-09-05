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
import { DatePicker } from './ui/date-picker';
import { differenceInBusinessDays, parseISO, isValid } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

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

export const RequestMissionModal: React.FC<RequestMissionModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const [missionType, setMissionType] = useState('Work From Home');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [notes, setNotes] = useState('');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  React.useEffect(() => {
    if (open) {
      setMissionType(initialData?.missionType || 'Work From Home');
      setFromDate(initialData?.fromDate || '');
      setToDate(initialData?.toDate || '');
      setNotes(initialData?.notes || '');
      setAttemptedSubmit(false);
    }
  }, [open, initialData]);

  const daysRequested = useMemo(() => {
    if (!fromDate || !toDate) return 0;
    const from = parseISO(fromDate);
    const to = parseISO(toDate);
    if (!isValid(from) || !isValid(to) || to < from) return 0;
    return differenceInBusinessDays(to, from) + 1;
  }, [fromDate, toDate]);

  const validationError = useMemo(() => {
    if (!attemptedSubmit) return null;
    if (!fromDate || !toDate) {
      return isArabic ? 'يرجى تحديد تاريخي البداية والنهاية للمأمورية.' : 'Please select both start and end dates for the mission.';
    }
    const from = parseISO(fromDate);
    const to = parseISO(toDate);
    if (!isValid(from) || !isValid(to) || to < from) {
      return isArabic ? 'نطاق التاريخ المحدد غير صحيح.' : 'Invalid date range selected.';
    }
    return null;
  }, [attemptedSubmit, fromDate, toDate, isArabic]);

  const hasDateError = attemptedSubmit && !!validationError;

  const handleSubmit = () => {
    setAttemptedSubmit(true);
    if (!fromDate) {
      document.getElementById('mission-from-date')?.focus();
      return;
    }
    if (!toDate || (fromDate && toDate && toDate < fromDate)) {
      document.getElementById('mission-to-date')?.focus();
      return;
    }
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
            Request mission
          </DialogTitle>
          <DialogDescription className="sr-only">
            Request a mission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-1">
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
              htmlFor="mission-type"
              className="text-foreground block text-start w-full"
            >
              Mission type
            </label>
            <Select value={missionType} onValueChange={setMissionType}>
              <SelectTrigger id="mission-type" className="h-10 w-full rounded-[var(--radius-input)]" aria-label="Mission type">
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                htmlFor="mission-from-date"
                className="text-foreground block text-start w-full"
              >
                From
              </label>
              <DatePicker
                value={fromDate}
                id="mission-from-date"
                aria-label="Mission start date"
                aria-describedby={hasDateError ? "mission-date-error" : "mission-date-help"}
                aria-invalid={hasDateError}
                onChange={(date) => {
                  setFromDate(date);
                  if (!toDate || (date && toDate && date > toDate)) {
                    setToDate(date);
                  }
                }}
                placeholder="Start date"
              />
            </div>
            <div className="space-y-1">
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                htmlFor="mission-to-date"
                className="text-foreground block text-start w-full"
              >
                To
              </label>
              <DatePicker
                value={toDate}
                id="mission-to-date"
                aria-label="Mission end date"
                aria-describedby={hasDateError ? "mission-date-error" : "mission-date-help"}
                aria-invalid={hasDateError}
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
              hasDateError && 'text-destructive font-medium'
            )}
            id={hasDateError ? "mission-date-error" : "mission-date-help"}
            role={hasDateError ? "alert" : undefined}
            aria-live="polite"
          >
            {validationError ? (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">⚠️ {validationError}</span>
            ) : (
              dateLabel
            )}
          </p>

          <div className="space-y-1">
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
              htmlFor="mission-notes"
              className="text-foreground block text-start w-full"
            >
              Notes (optional)
            </label>
            <textarea
              id="mission-notes"
              dir="auto"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
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

          <Button
            className="w-full bg-chart-3 hover:bg-chart-3/90 text-white"
            onClick={handleSubmit}
            disabled={daysRequested === 0}
          >
            Book mission
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
