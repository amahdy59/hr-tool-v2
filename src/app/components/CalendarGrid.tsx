import React, { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Briefcase, 
  Home, 
  Building, 
  Stethoscope, 
  Calendar as CalendarIcon, 
  Compass, 
  Palmtree 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isEgyptianWeekend } from '@/lib/leaveCalculations';

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
  onAddRequest?: (dateStr: string) => void;
}

// ─── Static attendance mock (attendance records for the current user – gender-neutral) ─
// These are keyed to actual calendar dates (YYYY-MM-DD) so they display in the right cells.
const todayStr = (d: Date) => d.toISOString().split('T')[0];

const buildMockAttendance = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Past days in this month → attendance records
  for (let d = 1; d < now.getDate(); d++) {
    const date = new Date(year, month, d);
    const day = date.getDay(); // 0=Sun, 6=Sat
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

const getLocalizedEventLabel = (label: string, type: string, isArabic: boolean) => {
  if (!isArabic) return label;

  const normalizedLabel = label.toLowerCase();
  const normalizedType = type.toLowerCase();

  if (normalizedLabel.includes('in-office') || normalizedLabel.includes('in office') || normalizedType.includes('office')) return 'من المكتب';
  if (normalizedLabel.includes('work from home') || normalizedLabel.includes('home') || normalizedType === 'wfh') return 'العمل من المنزل';
  if (normalizedLabel.includes('sick') || normalizedType.includes('sick')) return 'إجازة مرضية';
  if (normalizedLabel.includes('annual') || normalizedType.includes('annual')) return 'إجازة سنوية';
  if (normalizedLabel.includes('mission') || normalizedType.includes('mission')) return 'مأمورية';
  if (normalizedLabel.includes('weekend') || normalizedType.includes('weekend')) return 'عطلة نهاية الأسبوع';

  return label;
};

// Map event types to Lucide Icons
const getEventIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('office')) return Building;
  if (t.includes('home') || t === 'wfh') return Home;
  if (t.includes('sick')) return Stethoscope;
  if (t.includes('annual')) return Palmtree;
  if (t.includes('mission')) return Briefcase;
  if (t.includes('weekend')) return Compass;
  return CalendarIcon;
};

// WCAG AAA standard high-contrast accessible styles mapped dynamically.
const getAccessibleEventStyle = (type: string, isDimmed: boolean) => {
  const t = type.toLowerCase();
  let baseStyle = '';
  
  if (t.includes('office')) {
    baseStyle = 'bg-blue-500/10 border-s-4 border-blue-600 text-blue-800 dark:text-blue-300 dark:bg-blue-950/20';
  } else if (t.includes('home') || t === 'wfh') {
    baseStyle = 'bg-emerald-500/10 border-s-4 border-emerald-600 text-emerald-800 dark:text-emerald-300 dark:bg-emerald-950/20';
  } else if (t.includes('sick')) {
    baseStyle = 'bg-red-500/10 border-s-4 border-red-600 text-red-800 dark:text-red-300 dark:bg-red-950/20';
  } else if (t.includes('annual')) {
    baseStyle = 'bg-amber-500/10 border-s-4 border-amber-600 text-amber-800 dark:text-amber-300 dark:bg-amber-950/20';
  } else if (t.includes('mission')) {
    baseStyle = 'bg-purple-500/10 border-s-4 border-purple-600 text-purple-800 dark:text-purple-300 dark:bg-purple-950/20';
  } else {
    // weekend or default
    baseStyle = 'bg-gray-500/5 border-s-4 border-gray-400 text-gray-700 dark:text-gray-300 dark:bg-gray-800/20';
  }

  return cn(baseStyle, isDimmed && 'opacity-20');
};

const getStartOfWeek = (d: Date) => {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
  const day = date.getDay(); // 0 is Sunday
  date.setDate(date.getDate() - day);
  return date;
};

const addDays = (d: Date, days: number) => {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
};

// ─── Component ───────────────────────────────────────────────────────────────

export const CalendarGrid: React.FC<CalendarGridProps> = ({ events: externalEvents, onViewRequest, onAddRequest }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const now = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'three-day'>('month');

  // Interactive filter state for legend categories
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Responsive mobile media query listener
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // Sync view selection with responsiveness: mobile defaults to 3-day view, desktop defaults to month
  useEffect(() => {
    if (isMobile) {
      setCalendarView('three-day');
    } else {
      setCalendarView('month');
    }
  }, [isMobile]);

  const allEvents = useMemo(() => [...MOCK_ATTENDANCE, ...(externalEvents ?? [])], [externalEvents]);

  // Build the month grid: 6 rows × 7 cols
  const gridCells = useMemo(() => {
    const cells: Array<{ dateStr: string; day: number; isCurrentMonth: boolean; isToday: boolean; events: CalendarEvent[] }> = [];
    const viewYear = currentDate.getFullYear();
    const viewMonth = currentDate.getMonth();
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
  }, [currentDate, allEvents]);

  // Build the week grid: 7 cells
  const weekCells = useMemo(() => {
    const cells: Array<{ dateStr: string; day: number; isCurrentMonth: boolean; isToday: boolean; events: CalendarEvent[] }> = [];
    const startOfWeek = getStartOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      const date = addDays(startOfWeek, i);
      const dateStr = todayStr(date);
      const isToday = dateStr === todayStr(now);

      const dayEvents = allEvents.filter(ev => {
        if (!ev.startDate) return false;
        const start = ev.startDate;
        const end = ev.endDate ?? ev.startDate;
        return dateStr >= start && dateStr <= end;
      });

      cells.push({
        dateStr,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
        isToday,
        events: dayEvents
      });
    }
    return cells;
  }, [currentDate, allEvents]);

  // Build the 3-day grid: 3 cells
  const threeDayCells = useMemo(() => {
    const cells: Array<{ dateStr: string; day: number; isCurrentMonth: boolean; isToday: boolean; events: CalendarEvent[] }> = [];
    for (let i = 0; i < 3; i++) {
      const date = addDays(currentDate, i);
      const dateStr = todayStr(date);
      const isToday = dateStr === todayStr(now);

      const dayEvents = allEvents.filter(ev => {
        if (!ev.startDate) return false;
        const start = ev.startDate;
        const end = ev.endDate ?? ev.startDate;
        return dateStr >= start && dateStr <= end;
      });

      cells.push({
        dateStr,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
        isToday,
        events: dayEvents
      });
    }
    return cells;
  }, [currentDate, allEvents]);

  const goToPrev = () => {
    if (calendarView === 'month') {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1, 12, 0, 0));
    } else if (calendarView === 'week') {
      setCurrentDate(prev => addDays(prev, -7));
    } else {
      setCurrentDate(prev => addDays(prev, -3));
    }
  };

  const goToNext = () => {
    if (calendarView === 'month') {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1, 12, 0, 0));
    } else if (calendarView === 'week') {
      setCurrentDate(prev => addDays(prev, 7));
    } else {
      setCurrentDate(prev => addDays(prev, 3));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const dayLabels = isArabic
    ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Header range title computation
  const headerTitle = useMemo(() => {
    if (calendarView === 'month') {
      const monthLabel = isArabic ? arabicMonthNames[currentDate.getMonth()] : monthNames[currentDate.getMonth()];
      return `${monthLabel} ${currentDate.getFullYear()}`;
    } else if (calendarView === 'week') {
      const start = getStartOfWeek(currentDate);
      const end = addDays(start, 6);
      
      const format = (d: Date) => {
        const m = isArabic ? arabicMonthNames[d.getMonth()] : monthNames[d.getMonth()].slice(0, 3);
        return `${d.getDate()} ${m}`;
      };
      
      return `${format(start)} – ${format(end)} (${currentDate.getFullYear()})`;
    } else {
      // 3-day view
      const start = currentDate;
      const end = addDays(currentDate, 2);
      
      const format = (d: Date) => {
        const m = isArabic ? arabicMonthNames[d.getMonth()] : monthNames[d.getMonth()].slice(0, 3);
        return `${d.getDate()} ${m}`;
      };
      
      return `${format(start)} – ${format(end)} (${currentDate.getFullYear()})`;
    }
  }, [calendarView, currentDate, isArabic]);

  // Helper to determine if an event matches the current filter settings
  const isEventDimmed = (evType: string) => {
    if (!activeFilter) return false;
    const filter = activeFilter.toLowerCase();
    const type = evType.toLowerCase();
    
    if (filter === 'inoffice') return !type.includes('office');
    if (filter === 'wfh') return !type.includes('home') && type !== 'wfh';
    if (filter === 'sick') return !type.includes('sick');
    if (filter === 'annual') return !type.includes('annual');
    if (filter === 'mission') return !type.includes('mission');
    if (filter === 'weekend') return !type.includes('weekend');
    return false;
  };

  // Toggle dynamic filters
  const toggleFilter = (filterKey: string) => {
    if (activeFilter === filterKey) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterKey);
    }
  };

  // Clean, premium design variables for Legend items
  const legendItems = [
    { key: 'inoffice', color: 'bg-blue-600 dark:bg-blue-400', label: isArabic ? 'من المكتب' : 'In-Office' },
    { key: 'wfh', color: 'bg-emerald-600 dark:bg-emerald-400', label: isArabic ? 'العمل من المنزل' : 'Work From Home' },
    { key: 'sick', color: 'bg-red-600 dark:bg-red-400', label: isArabic ? 'إجازة مرضية' : 'Sick Leave' },
    { key: 'annual', color: 'bg-amber-600 dark:bg-amber-400', label: isArabic ? 'إجازة سنوية' : 'Annual Leave' },
    { key: 'mission', color: 'bg-purple-600 dark:bg-purple-400', label: isArabic ? 'مهمة' : 'Mission' },
    { key: 'weekend', color: 'bg-gray-400 dark:bg-gray-600', label: isArabic ? 'عطلة نهاية الأسبوع' : 'Weekend' },
  ];

  const cellsToRender = calendarView === 'month' ? gridCells : weekCells;
  const calendarRows = useMemo(() => {
    const rows: typeof cellsToRender[] = [];
    for (let i = 0; i < cellsToRender.length; i += 7) {
      rows.push(cellsToRender.slice(i, i + 7));
    }
    return rows;
  }, [cellsToRender]);

  return (
    <div 
      className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)] focus-visible:outline-none"
      dir={isArabic ? 'rtl' : 'ltr'}
      role="region"
      aria-label={isArabic ? 'جدول المواعيد والغياب' : 'Attendance and Leave Calendar'}
    >
      {/* Calendar Header with Navigation, Range Display, and View Toggles */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 border-b border-border bg-muted/30">
        
        {/* Navigation Actions */}
        <div className="flex items-center justify-between md:justify-start gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={goToPrev}
              aria-label={isArabic ? 'السابق' : 'Previous'}
              className="w-11 h-11 flex items-center justify-center hover:bg-muted border border-border/80 bg-card rounded-[var(--radius-sm)] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {isArabic ? (
                <ChevronRight className="calendar-nav-icon w-4.5 h-4.5 text-muted-foreground" />
              ) : (
                <ChevronLeft className="calendar-nav-icon w-4.5 h-4.5 text-muted-foreground" />
              )}
            </button>

            <button
              onClick={goToToday}
              className="min-h-11 text-[12px] font-semibold text-foreground hover:bg-muted border border-border/80 bg-card rounded-[var(--radius-sm)] px-3.5 py-1.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {isArabic ? 'اليوم' : 'Today'}
            </button>

            <button
              onClick={goToNext}
              aria-label={isArabic ? 'التالي' : 'Next'}
              className="w-11 h-11 flex items-center justify-center hover:bg-muted border border-border/80 bg-card rounded-[var(--radius-sm)] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {isArabic ? (
                <ChevronLeft className="calendar-nav-icon w-4.5 h-4.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="calendar-nav-icon w-4.5 h-4.5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Date Title / Active Range */}
        <div className="text-center md:text-start self-center">
          <span className="text-[15px] font-bold text-foreground tracking-wide">
            {headerTitle}
          </span>
        </div>

        {/* View Switcher Segmented Control */}
        <div className="flex items-center bg-muted/65 p-1 rounded-lg border border-border/60 self-center md:self-auto shadow-inner min-w-[210px] justify-between">
          <button
            onClick={() => setCalendarView('month')}
            className={cn(
              "flex-1 text-center py-1.5 px-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              calendarView === 'month' 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isArabic ? 'شهر' : 'Month'}
          </button>
          <button
            onClick={() => setCalendarView('week')}
            className={cn(
              "flex-1 text-center py-1.5 px-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              calendarView === 'week' 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isArabic ? 'أسبوع' : 'Week'}
          </button>
          <button
            onClick={() => setCalendarView('three-day')}
            className={cn(
              "flex-1 text-center py-1.5 px-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              calendarView === 'three-day' 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isArabic ? '٣ أيام' : '3 Days'}
          </button>
        </div>
      </div>

      {/* --- GRID VIEWS --- */}
      {calendarView === 'three-day' ? (
        /* 3-Day Layout (Optimized for Mobile/Compact) */
        <div role="grid" aria-label={isArabic ? 'جدول المواعيد والغياب' : 'Attendance and Leave Calendar'} className="w-full">
          <div className="grid grid-cols-3 divide-x divide-border rtl:divide-x-reverse" style={{ minHeight: 380 }} role="row">
          {threeDayCells.map((cell, idx) => {
            const isTodayHighlight = cell.isToday;
            const cellDate = new Date(cell.dateStr);
            const dayName = dayLabels[cellDate.getDay()];
            const isWeekend = isEgyptianWeekend(cell.dateStr);
            
            return (
              <div
                key={`${cell.dateStr}-${idx}`}
                role="gridcell"
                aria-selected={isTodayHighlight}
                className={cn(
                  'p-3.5 flex flex-col gap-3 min-h-[280px] transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  isWeekend && 'bg-muted/30 dark:bg-muted/5',
                  isTodayHighlight && 'bg-primary/5 dark:bg-primary/10 border-t-2 border-t-primary'
                )}
              >
                {/* Header for the Day Column */}
                <div className="flex items-center justify-between gap-1 border-b border-border pb-2.5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {dayName}
                    </span>
                    <span className={cn(
                      "text-base font-extrabold mt-0.5",
                      isTodayHighlight ? "text-primary" : "text-foreground"
                    )}>
                      {cell.day}
                    </span>
                  </div>
                  {/* Quick Add request button */}
                  {!isWeekend && (
                    <button 
                      onClick={() => onAddRequest?.(cell.dateStr)}
                      aria-label={isArabic ? 'أضف طلب جديد لهذا اليوم' : 'Add new request for this day'}
                      className="w-11 h-11 flex items-center justify-center rounded-full border border-dashed border-border/80 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all hover:bg-primary/10 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Event list for the Day Column */}
                <div className="flex flex-col gap-2 w-full overflow-hidden">
                  {cell.events.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic py-5 text-center">
                      {isArabic ? 'لا توجد فعاليات' : 'No events'}
                    </div>
                  ) : (
                    cell.events.map((ev, eIdx) => {
                      const isDimmed = isEventDimmed(ev.type);
                      const isInteractive = !!ev.id && !!onViewRequest && ev.status === 'pending';
                      const IconComponent = getEventIcon(ev.type);
                      const eventLabel = getLocalizedEventLabel(ev.label, ev.type, isArabic);
                      
                      const eventClassName = cn(
                        'text-[10px] leading-tight py-2 px-2.5 rounded-[var(--radius-sm)] font-semibold w-full text-start flex items-center gap-2 border-none outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all',
                        getAccessibleEventStyle(ev.type, isDimmed),
                        isInteractive
                          ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] ring-1 ring-inset ring-white/10 dark:ring-white/5 shadow-sm'
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
                          title={eventLabel}
                          className={eventClassName}
                          aria-label={`${eventLabel} - ${ev.status ?? 'no status'}`}
                        >
                          <IconComponent className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{eventLabel}</span>
                        </button>
                      ) : (
                        <span key={eIdx} title={eventLabel} className={eventClassName}>
                          <IconComponent className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{eventLabel}</span>
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      ) : (
        /* 7-Column Grid Layout (Month and Week Views) */
        <div role="grid" aria-label={isArabic ? 'جدول المواعيد والغياب' : 'Attendance and Leave Calendar'} className="w-full">
          {/* Enhanced Day-of-Week Labels */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/20" role="row">
            {dayLabels.map((day) => (
              <div
                key={day}
                role="columnheader"
                className="py-3 px-2 text-center text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-wider text-muted-foreground border-e border-border last:border-e-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7" style={{ minHeight: calendarView === 'week' ? 180 : 380 }} role="rowgroup">
            {calendarRows.map((row, rowIndex) => (
              <div key={`calendar-row-${rowIndex}`} role="row" className="contents">
                {row.map((cell, cellIndex) => {
                  const idx = rowIndex * 7 + cellIndex;
              const isTodayHighlight = cell.isToday;
              const isWeekend = isEgyptianWeekend(cell.dateStr);
              return (
                <div
                  key={`${cell.dateStr}-${idx}`}
                  role="gridcell"
                  aria-selected={isTodayHighlight}
                  tabIndex={cell.isCurrentMonth ? 0 : -1}
                  className={cn(
                    'border-e border-b border-border p-2.5 flex flex-col gap-1.5 min-h-[90px] relative transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    !cell.isCurrentMonth && 'bg-muted/10',
                    isWeekend && 'bg-muted/30 dark:bg-muted/5 border-dashed',
                    isTodayHighlight && 'bg-primary/5 dark:bg-primary/10 border-t-2 border-t-primary',
                    idx % 7 === 6 && 'border-e-0',
                    calendarView === 'month' && Math.floor(idx / 7) === 5 && 'border-b-0',
                    calendarView === 'week' && 'border-b-0'
                  )}
                >
                  {/* Day number & Empty Cell Interactive Plus Indicator */}
                  <div className="flex justify-between items-center w-full">
                    {cell.isCurrentMonth && cell.events.length === 0 && !isWeekend ? (
                      <button 
                        onClick={() => {
                          if (onAddRequest) {
                            onAddRequest(cell.dateStr);
                          }
                        }}
                        aria-label={isArabic ? 'أضف طلب جديد لهذا اليوم' : 'Add new request for this day'}
                        className="w-11 h-11 flex items-center justify-center rounded-full border border-dashed border-border/80 text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100 group-focus-within:opacity-100 transition-all hover:text-primary hover:border-primary/50 hover:bg-primary/10 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div />
                    )}
                    <div
                      className={cn(
                        'w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0 font-bold',
                        cell.isToday && 'bg-primary text-primary-foreground font-extrabold shadow-sm scale-110',
                        isWeekend && !cell.isToday && 'text-muted-foreground font-semibold',
                        !cell.isCurrentMonth && !cell.isToday && 'text-muted-foreground',
                        cell.isCurrentMonth && !cell.isToday && !isWeekend && 'text-foreground'
                      )}
                    >
                      {cell.day}
                    </div>
                  </div>

                  {/* Events List */}
                  <div className="flex flex-col gap-1.5 w-full overflow-hidden">
                    {cell.events.map((ev, eIdx) => {
                      const isDimmed = isEventDimmed(ev.type);
                      const isInteractive = !!ev.id && !!onViewRequest && ev.status === 'pending';
                      const IconComponent = getEventIcon(ev.type);
                      const eventLabel = getLocalizedEventLabel(ev.label, ev.type, isArabic);
                      
                      const eventClassName = cn(
                        'text-[10px] leading-tight py-1.5 px-2 rounded-[var(--radius-sm)] font-semibold w-full text-start flex items-center gap-1.5 border-none outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all',
                        getAccessibleEventStyle(ev.type, isDimmed),
                        isInteractive
                          ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] ring-1 ring-inset ring-white/10 dark:ring-white/5 shadow-sm'
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
                          title={eventLabel}
                          className={eventClassName}
                          aria-label={`${eventLabel} - ${ev.status ?? 'no status'}`}
                        >
                          <IconComponent className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{eventLabel}</span>
                        </button>
                      ) : (
                        <span key={eIdx} title={eventLabel} className={eventClassName}>
                          <IconComponent className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{eventLabel}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
              })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Legend with toggle filter functionality */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-4 py-3.5 border-t border-border bg-muted/10">
        {legendItems.map(item => (
          <button
            key={item.key}
            onClick={() => toggleFilter(item.key)}
            className={cn(
              "flex items-center gap-2 px-2 py-1 rounded-[var(--radius-sm)] border border-transparent transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none hover:bg-muted",
              activeFilter === item.key && "bg-muted/80 border-border shadow-inner font-semibold"
            )}
            aria-label={isArabic ? `تصفية حسب ${item.label}` : `Filter by ${item.label}`}
            aria-pressed={activeFilter === item.key}
          >
            <div className={cn('w-3.5 h-3.5 rounded-sm shrink-0 border border-black/10 dark:border-white/10', item.color)} />
            <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
          </button>
        ))}
        <span className="text-[11px] text-muted-foreground ms-auto italic">
          {isArabic ? '• اضغط على أيقونات التصفية للتصفية أو الطلبات المعلقة للتعديل' : '• Click on filter icons to filter or pending requests to edit'}
        </span>
      </div>
    </div>
  );
};
