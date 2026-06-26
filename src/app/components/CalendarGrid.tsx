import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CalendarEvent {
  id?: string;
  type: string;
  label: string;
  color: string;
  textColor?: string;
  status?: 'approved' | 'pending' | 'noshow';
  range?: string;
  duration?: string;
  /** Date this event starts, as YYYY-MM-DD */
  startDate?: string;
  /** Date this event ends, as YYYY-MM-DD */
  endDate?: string;
}

interface CalendarGridProps {
  /** Structured leave / attendance events keyed to a date. Pass in real data from the parent. */
  events?: CalendarEvent[];
  onViewRequest?: (item: { id: string; type: string; status: 'approved' | 'pending' | 'noshow'; range: string; duration: string }) => void;
}

// ─── Static attendance mock (attendance records for the current user – gender-neutral) ─
// These are keyed to actual calendar dates (YYYY-MM-DD) so they display in the right cells.
const TODAY = new Date();
const todayStr = (d: Date) => d.toISOString().split('T')[0];

const buildMockAttendance = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Past days in this month → attendance records
  for (let d = 1; d < now.getDate(); d++) {
    const date = new Date(year, month, d);
    const day = date.getDay(); // 0=Sun,6=Sat
    const dateStr = todayStr(date);

    // Fri+Sat → weekend (configurable; simplified here)
    if (day === 5 || day === 6) {
      events.push({ type: 'weekend', label: 'Weekend', color: 'bg-muted', textColor: 'text-muted-foreground', startDate: dateStr, endDate: dateStr });
    } else if (d % 5 === 0) {
      events.push({ type: 'wfh', label: 'Work From Home', color: 'bg-chart-3', startDate: dateStr, endDate: dateStr });
    } else {
      events.push({ type: 'inoffice', label: 'In-Office', color: 'bg-chart-1', startDate: dateStr, endDate: dateStr });
    }
  }

  // A few leave requests spread across recent & upcoming dates
  const future1 = new Date(year, month, now.getDate() + 3);
  const future1End = new Date(year, month, now.getDate() + 5);
  const past1 = new Date(year, month, Math.max(1, now.getDate() - 8));
  const past1End = new Date(year, month, Math.max(1, now.getDate() - 6));

  events.push({
    id: 'leave-1',
    type: 'Annual Leave',
    label: 'Annual Leave',
    color: 'bg-chart-4',
    status: 'pending',
    startDate: todayStr(future1),
    endDate: todayStr(future1End),
    range: `${future1.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${future1End.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`,
    duration: '3 days',
  });

  events.push({
    id: 'leave-2',
    type: 'Sick',
    label: 'Sick Leave',
    color: 'bg-chart-3',
    status: 'approved',
    startDate: todayStr(past1),
    endDate: todayStr(past1End),
    range: `${past1.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${past1End.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`,
    duration: '3 days',
  });

  // A mission request next week
  const mission1 = new Date(year, month, now.getDate() + 10);
  const mission1End = new Date(year, month, now.getDate() + 11);
  events.push({
    id: 'mission-1',
    type: 'Mission',
    label: 'Mission',
    color: 'bg-secondary',
    textColor: 'text-secondary-foreground',
    status: 'pending',
    startDate: todayStr(mission1),
    endDate: todayStr(mission1End),
    range: `${mission1.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${mission1End.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`,
    duration: '2 days',
  });

  return events;
};

const MOCK_ATTENDANCE = buildMockAttendance();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0=Sun

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const arabicMonthNames = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

// ─── Component ───────────────────────────────────────────────────────────────

export const CalendarGrid: React.FC<CalendarGridProps> = ({ events: externalEvents, onViewRequest }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const allEvents = useMemo(() => [...MOCK_ATTENDANCE, ...(externalEvents ?? [])], [externalEvents]);

  // Build the grid: 6 rows × 7 cols
  const gridCells = useMemo(() => {
    const cells: Array<{ dateStr: string; day: number; isCurrentMonth: boolean; isToday: boolean; events: CalendarEvent[] }> = [];
    const total = daysInMonth(viewYear, viewMonth);
    const startDow = firstDayOfMonth(viewYear, viewMonth); // 0=Sun

    // prev-month padding
    const prevMonthTotal = daysInMonth(viewYear, viewMonth - 1 < 0 ? 11 : viewMonth - 1);
    for (let i = startDow - 1; i >= 0; i--) {
      const day = prevMonthTotal - i;
      const pm = viewMonth - 1 < 0 ? 11 : viewMonth - 1;
      const py = viewMonth - 1 < 0 ? viewYear - 1 : viewYear;
      const dateStr = `${py}-${String(pm + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({ dateStr, day, isCurrentMonth: false, isToday: false, events: [] });
    }

    // current month days
    for (let d = 1; d <= total; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === todayStr(now);

      // Collect events that overlap this date
      const dayEvents = allEvents.filter(ev => {
        if (!ev.startDate) return false;
        const start = ev.startDate;
        const end = ev.endDate ?? ev.startDate;
        return dateStr >= start && dateStr <= end;
      });

      cells.push({ dateStr, day: d, isCurrentMonth: true, isToday, events: dayEvents });
    }

    // next-month padding to fill remaining cells (max 42)
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nm = viewMonth + 1 > 11 ? 0 : viewMonth + 1;
      const ny = viewMonth + 1 > 11 ? viewYear + 1 : viewYear;
      const dateStr = `${ny}-${String(nm + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ dateStr, day: d, isCurrentMonth: false, isToday: false, events: [] });
    }

    return cells;
  }, [viewYear, viewMonth, allEvents]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const dayLabels = isArabic
    ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthLabel = isArabic ? arabicMonthNames[viewMonth] : monthNames[viewMonth];
  const PrevMonthIcon = isArabic ? ChevronRight : ChevronLeft;
  const NextMonthIcon = isArabic ? ChevronLeft : ChevronRight;

  return (
    <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <button
          onClick={goToPrevMonth}
          aria-label={isArabic ? 'الشهر السابق' : 'Previous month'}
          className="w-11 h-11 flex items-center justify-center hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer"
        >
          <PrevMonthIcon className="calendar-nav-icon w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">
            {monthLabel}
          </span>
          <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">
            {viewYear}
          </span>
          <button
            onClick={() => { setViewMonth(now.getMonth()); setViewYear(now.getFullYear()); }}
            className="text-[var(--text-xs)] font-[var(--font-weight-medium)] text-primary hover:text-primary/80 border border-primary/30 rounded px-2 py-0.5 transition-colors cursor-pointer"
          >
            {isArabic ? 'اليوم' : 'Today'}
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          aria-label={isArabic ? 'الشهر التالي' : 'Next month'}
          className="w-11 h-11 flex items-center justify-center hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer"
        >
          <NextMonthIcon className="calendar-nav-icon w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 border-b border-border">
        {dayLabels.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-[var(--text-xs)] font-[var(--font-weight-medium)] text-muted-foreground bg-muted/20 border-e border-border last:border-e-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Date Cells */}
      <div className="grid grid-cols-7" style={{ minHeight: 380 }}>
        {gridCells.map((cell, idx) => (
          <div
            key={`${cell.dateStr}-${idx}`}
            className={cn(
              'border-e border-b border-border p-1.5 flex flex-col gap-1 min-h-[80px] relative',
              !cell.isCurrentMonth && 'bg-muted/10',
              idx % 7 === 6 && 'border-e-0',
              Math.floor(idx / 7) === Math.floor((gridCells.length - 1) / 7) && 'border-b-0'
            )}
          >
            {/* Day number */}
            <div
              className={cn(
                'w-6 h-6 flex items-center justify-center rounded-full text-[var(--text-xs)] shrink-0 ms-auto',
                cell.isToday && 'bg-primary text-primary-foreground font-[var(--font-weight-semibold)]',
                !cell.isCurrentMonth && 'text-muted-foreground/40',
                cell.isCurrentMonth && !cell.isToday && 'text-foreground'
              )}
            >
              {cell.day}
            </div>

            {/* Events */}
            <div className="flex flex-col gap-0.5 w-full overflow-hidden">
              {cell.events.map((ev, eIdx) => {
                const isInteractive = !!ev.id && !!onViewRequest && ev.status === 'pending';
                const eventClassName = cn(
                  'text-[10px] leading-tight py-0.5 px-1.5 rounded-[3px] truncate font-[var(--font-weight-medium)] w-full text-start block border-none outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all',
                  ev.color,
                  ev.textColor ?? 'text-white',
                  isInteractive
                    ? 'cursor-pointer hover:brightness-90 active:scale-[0.98] ring-1 ring-inset ring-white/20'
                    : 'cursor-default'
                );

                return isInteractive ? (
                  <button
                    key={eIdx}
                    type="button"
                    onClick={() => {
                      if (ev.id && onViewRequest) {
                        onViewRequest({
                          id: ev.id,
                          type: ev.type,
                          status: ev.status as 'approved' | 'pending' | 'noshow',
                          range: ev.range ?? '',
                          duration: ev.duration ?? '',
                        });
                      }
                    }}
                    title={ev.label}
                    className={eventClassName}
                  >
                    {ev.label}
                  </button>
                ) : (
                  <span key={eIdx} title={ev.label} className={eventClassName}>
                    {ev.label}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 border-t border-border bg-muted/10">
        {[
          { color: 'bg-chart-1', label: isArabic ? 'في المكتب' : 'In-Office' },
          { color: 'bg-chart-3', label: isArabic ? 'إجازة مقبولة' : 'Approved Leave' },
          { color: 'bg-chart-4', label: isArabic ? 'في الانتظار' : 'Pending' },
          { color: 'bg-secondary', label: isArabic ? 'مهمة' : 'Mission' },
          { color: 'bg-muted border border-border', label: isArabic ? 'عطلة' : 'Weekend' },
          { color: 'bg-chart-3', label: isArabic ? 'العمل من المنزل' : 'Work From Home' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={cn('w-3 h-3 rounded-sm shrink-0', item.color)} />
            <span className="text-[var(--text-xs)] text-muted-foreground">{item.label}</span>
          </div>
        ))}
        <span className="text-[var(--text-xs)] text-muted-foreground/60 ms-auto italic">
          {isArabic ? '• الطلبات المعلقة قابلة للنقر للتعديل' : '• Pending requests are clickable to edit'}
        </span>
      </div>
    </div>
  );
};
