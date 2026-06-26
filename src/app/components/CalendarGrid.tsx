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
// We override flat colors with semi-transparent high-contrast border layouts.
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

// ─── Component ───────────────────────────────────────────────────────────────

export const CalendarGrid: React.FC<CalendarGridProps> = ({ events: externalEvents, onViewRequest }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

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
    { key: 'inoffice', color: 'bg-blue-600 dark:bg-blue-400', label: isArabic ? 'في المكتب' : 'In-Office' },
    { key: 'wfh', color: 'bg-emerald-600 dark:bg-emerald-400', label: isArabic ? 'العمل من المنزل' : 'Work From Home' },
    { key: 'sick', color: 'bg-red-600 dark:bg-red-400', label: isArabic ? 'إجازة مرضية' : 'Sick Leave' },
    { key: 'annual', color: 'bg-amber-600 dark:bg-amber-400', label: isArabic ? 'إجازة سنوية' : 'Annual Leave' },
    { key: 'mission', color: 'bg-purple-600 dark:bg-purple-400', label: isArabic ? 'مهمة' : 'Mission' },
    { key: 'weekend', color: 'bg-gray-400 dark:bg-gray-600', label: isArabic ? 'عطلة نهاية الأسبوع' : 'Weekend' },
  ];

  return (
    <div 
      className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)] focus-visible:outline-none"
      dir={isArabic ? 'rtl' : 'ltr'}
      role="grid"
      aria-label={isArabic ? 'جدول المواعيد والغياب' : 'Attendance and Leave Calendar'}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <button
          onClick={goToPrevMonth}
          aria-label={isArabic ? 'الشهر السابق' : 'Previous month'}
          className="w-11 h-11 flex items-center justify-center hover:bg-muted rounded-[var(--radius-sm)] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <PrevMonthIcon className="calendar-nav-icon w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[var(--text-base)] font-[var(--font-weight-semibold)] text-foreground">
            {monthLabel}
          </span>
          <span className="text-[var(--text-base)] font-[var(--font-weight-semibold)] text-foreground">
            {viewYear}
          </span>
          <button
            onClick={() => { setViewMonth(now.getMonth()); setViewYear(now.getFullYear()); }}
            className="text-[var(--text-xs)] font-[var(--font-weight-medium)] text-primary hover:text-primary/80 border border-primary/30 rounded px-2.5 py-1 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {isArabic ? 'اليوم' : 'Today'}
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          aria-label={isArabic ? 'الشهر التالي' : 'Next month'}
          className="w-11 h-11 flex items-center justify-center hover:bg-muted rounded-[var(--radius-sm)] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <NextMonthIcon className="calendar-nav-icon w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* --- RESPONSIVE CONDITIONAL RENDERING --- */}
      {isMobile ? (
        /* Mobile List / Agenda View */
        <div className="divide-y divide-border max-h-[480px] overflow-y-auto" role="rowgroup">
          {gridCells
            .filter(cell => cell.isCurrentMonth && (cell.events.length > 0 || cell.isToday))
            .map((cell, idx) => (
              <div 
                key={`${cell.dateStr}-${idx}`} 
                className={cn(
                  "p-4 flex gap-4 items-start transition-colors", 
                  cell.isToday && "bg-primary/5 dark:bg-primary/10"
                )}
                role="row"
              >
                <div className="flex flex-col items-center justify-center min-w-[48px] h-[48px] rounded-full bg-muted shrink-0 relative">
                  {cell.isToday && (
                    <span className="absolute -top-1 px-1.5 py-0.2 bg-primary text-[8px] font-bold text-primary-foreground rounded-full uppercase">
                      {isArabic ? 'اليوم' : 'Today'}
                    </span>
                  )}
                  <span className="text-[var(--text-xs)] text-muted-foreground">
                    {dayLabels[new Date(cell.dateStr).getDay()].slice(0, 3)}
                  </span>
                  <span className="text-[var(--text-sm)] font-bold text-foreground -mt-0.5">
                    {cell.day}
                  </span>
                </div>

                <div className="flex-1 space-y-2">
                  {cell.events.length === 0 ? (
                    <p className="text-[var(--text-xs)] text-muted-foreground/60 italic pt-3">
                      {isArabic ? 'لا توجد طلبات أو مهام' : 'No requests or events'}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {cell.events.map((ev, eIdx) => {
                        const IconComponent = getEventIcon(ev.type);
                        const isDimmed = isEventDimmed(ev.type);
                        const isInteractive = !!ev.id && !!onViewRequest && ev.status === 'pending';
                        
                        return (
                          <div 
                            key={eIdx}
                            onClick={() => {
                              if (isInteractive && ev.id && onViewRequest) {
                                onViewRequest({
                                  id: ev.id,
                                  type: ev.type,
                                  status: ev.status as 'approved' | 'pending' | 'noshow',
                                  range: ev.range ?? '',
                                  duration: ev.duration ?? '',
                                });
                              }
                            }}
                            className={cn(
                              "flex items-center gap-2 p-2.5 rounded-[var(--radius)] text-[var(--text-xs)] font-[var(--font-weight-medium)] border transition-all",
                              getAccessibleEventStyle(ev.type, isDimmed),
                              isInteractive ? "cursor-pointer hover:scale-[1.01] active:scale-[0.99]" : "cursor-default"
                            )}
                          >
                            <IconComponent className="w-4 h-4 shrink-0" />
                            <span className="flex-1 truncate">{ev.label}</span>
                            {ev.status && (
                              <span className={cn(
                                "text-[9px] uppercase px-1.5 py-0.5 rounded font-bold tracking-wider",
                                ev.status === 'approved' ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                              )}>
                                {ev.status}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        /* Desktop Grid View */
        <>
          {/* Day Labels */}
          <div className="grid grid-cols-7 border-b border-border" role="row">
            {dayLabels.map((day) => (
              <div
                key={day}
                role="columnheader"
                className="py-2 text-center text-[var(--text-xs)] font-[var(--font-weight-medium)] text-muted-foreground bg-muted/20 border-e border-border last:border-e-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Date Cells */}
          <div className="grid grid-cols-7" style={{ minHeight: 380 }} role="rowgroup">
            {gridCells.map((cell, idx) => {
              const isTodayHighlight = cell.isToday;
              return (
                <div
                  key={`${cell.dateStr}-${idx}`}
                  role="gridcell"
                  aria-selected={isTodayHighlight}
                  tabIndex={cell.isCurrentMonth ? 0 : -1}
                  className={cn(
                    'border-e border-b border-border p-2 flex flex-col gap-1.5 min-h-[90px] relative transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    !cell.isCurrentMonth && 'bg-muted/10',
                    isTodayHighlight && 'bg-primary/5 dark:bg-primary/10 border-t-2 border-t-primary',
                    idx % 7 === 6 && 'border-e-0',
                    Math.floor(idx / 7) === Math.floor((gridCells.length - 1) / 7) && 'border-b-0'
                  )}
                >
                  {/* Day number & Empty Cell Interactive Plus Indicator */}
                  <div className="flex justify-between items-center w-full">
                    {cell.isCurrentMonth && cell.events.length === 0 ? (
                      <button 
                        aria-label={isArabic ? 'أضف طلب جديد لهذا اليوم' : 'Add new request for this day'}
                        className="w-5 h-5 flex items-center justify-center rounded-full border border-dashed border-border/80 text-muted-foreground/0 group-hover:text-primary group-hover:border-primary/50 transition-all hover:bg-primary/10 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div />
                    )}
                    <div
                      className={cn(
                        'w-6 h-6 flex items-center justify-center rounded-full text-[var(--text-xs)] shrink-0 font-bold',
                        cell.isToday && 'bg-primary text-primary-foreground font-[var(--font-weight-bold)] shadow-sm scale-110',
                        !cell.isCurrentMonth && 'text-muted-foreground/30',
                        cell.isCurrentMonth && !cell.isToday && 'text-foreground'
                      )}
                    >
                      {cell.day}
                    </div>
                  </div>

                  {/* Events */}
                  <div className="flex flex-col gap-1.5 w-full overflow-hidden">
                    {cell.events.map((ev, eIdx) => {
                      const isDimmed = isEventDimmed(ev.type);
                      const isInteractive = !!ev.id && !!onViewRequest && ev.status === 'pending';
                      const IconComponent = getEventIcon(ev.type);
                      
                      const eventClassName = cn(
                        'text-[10px] leading-tight py-1.5 px-2 rounded-[var(--radius-sm)] font-[var(--font-weight-medium)] w-full text-start flex items-center gap-1.5 border-none outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all',
                        getAccessibleEventStyle(ev.type, isDimmed),
                        isInteractive
                          ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] ring-1 ring-inset ring-white/10 dark:ring-white/5'
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
                          aria-label={`${ev.label} - ${ev.status ?? 'no status'}`}
                        >
                          <IconComponent className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{ev.label}</span>
                        </button>
                      ) : (
                        <span key={eIdx} title={ev.label} className={eventClassName}>
                          <IconComponent className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{ev.label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
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
            <span className="text-[var(--text-xs)] text-muted-foreground">{item.label}</span>
          </button>
        ))}
        <span className="text-[var(--text-xs)] text-muted-foreground/60 ms-auto italic">
          {isArabic ? '• اضغط على أيقونات التصفية للتصفية أو الطلبات المعلقة للتعديل' : '• Click on filter icons to filter or pending requests to edit'}
        </span>
      </div>
    </div>
  );
};
