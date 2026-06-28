import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  Search,
  Info,
  Download,
  Filter,
  X,
  HelpCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';
import { Checkbox } from './ui/checkbox';
import { Pagination } from './Pagination';
import { Button } from './ui/button';
import { DatePicker } from './ui/date-picker';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { localizePersonName } from '@/lib/localizedNames';
import {
  AttendanceService,
  DepartmentService,
  EmployeeService,
  JobTitleService,
} from '../../lib/services/dbServices';

// ── CSS variable colors for charts ──
const CHART_COLORS = {
  inOffice: 'var(--chart-1)',
  missions: 'var(--chart-5)',
  leaves: 'var(--chart-2)',
  noShow: 'var(--chart-4)',
  unfilled: 'var(--chart-3)',
};

// ── Raw CSS values for recharts (can't use var() directly) ──
const CHART_RAW_COLORS = {
  inOffice: '#1E40AF',   // --chart-1 / --primary
  missions: '#616161',   // --chart-5 / --muted-foreground
  leaves: '#FFCA28',     // --chart-2 / --secondary
  noShow: '#9A3412',     // --chart-4 / --accent
  unfilled: '#166534',   // --chart-3 / --success
};

// ── Summary chart data ──
// Company policy: employees must attend from office ≥ 40% of total working hours
const OFFICE_GOAL_PERCENT = 40;
const EXPECTED_WORKING_HOURS = 284; // Expected for a typical month (22 days × ~8h + rounding)

const summaryData = [
  {
    id: 'in-office',
    name: 'In-office',
    hours: 152,
    percentage: 53.4,
    color: CHART_RAW_COLORS.inOffice,
    cssColor: CHART_COLORS.inOffice,
    severity: 'positive' as const,
  },
  {
    id: 'missions',
    name: 'Missions',
    hours: 69,
    percentage: 24.2,
    color: CHART_RAW_COLORS.missions,
    cssColor: CHART_COLORS.missions,
    severity: 'neutral' as const,
  },
  {
    id: 'leaves',
    name: 'Leaves',
    hours: 3,
    percentage: 1.2,
    color: CHART_RAW_COLORS.leaves,
    cssColor: CHART_COLORS.leaves,
    severity: 'neutral' as const,
  },
  {
    id: 'no-show',
    name: 'No Show',
    hours: 29,
    percentage: 10.1,
    color: CHART_RAW_COLORS.noShow,
    cssColor: CHART_COLORS.noShow,
    severity: 'negative' as const,
  },
  {
    id: 'unfilled',
    name: 'Unfilled',
    hours: 32,
    percentage: 11.1,
    color: CHART_RAW_COLORS.unfilled,
    cssColor: CHART_COLORS.unfilled,
    severity: 'warning' as const,
  },
];

const totalHours = summaryData.reduce((s, d) => s + d.hours, 0);
const officeHours = summaryData.find(d => d.id === 'in-office')?.hours ?? 0;
const officePercent = totalHours > 0 ? Math.round((officeHours / totalHours) * 1000) / 10 : 0;
const meetsOfficeGoal = officePercent >= OFFICE_GOAL_PERCENT;
const officeGoalHours = Math.round((OFFICE_GOAL_PERCENT / 100) * EXPECTED_WORKING_HOURS);
const officeGoalDelta = Math.round((officePercent - OFFICE_GOAL_PERCENT) * 10) / 10;
const actualHoursPercent = Math.round((totalHours / EXPECTED_WORKING_HOURS) * 1000) / 10;
const maxSummaryHours = Math.max(...summaryData.map((item) => item.hours));

// Severity → color map for #4 (color-coded hours)
const severityHoursClass = (severity: 'positive' | 'neutral' | 'negative' | 'warning') => {
  switch (severity) {
    case 'negative': return 'text-destructive';
    case 'warning': return 'text-chart-4';
    default: return 'text-foreground';
  }
};

// ── Mock day rows ──
type DayStatus =
  | 'In-office'
  | 'Weekend'
  | 'No Show'
  | 'Mission'
  | 'Annual Leave'
  | 'Sick Leave'
  | 'Unfilled'
  | 'Holiday';

interface DayRecord {
  id: number;
  day: string;
  date: string;
  timeIn: string;
  timeOut: string;
  totalHours: string;
  status: DayStatus;
}

const mockDays: DayRecord[] = [
  { id: 1, day: 'Friday', date: '3 November 2023', timeIn: '---', timeOut: '---', totalHours: '---', status: 'Weekend' },
  { id: 2, day: 'Saturday', date: '4 November 2023', timeIn: '---', timeOut: '---', totalHours: '---', status: 'Weekend' },
  { id: 3, day: 'Sunday', date: '5 November 2023', timeIn: '10:37', timeOut: '18:50', totalHours: '8h 13m', status: 'In-office' },
  { id: 4, day: 'Monday', date: '6 November 2023', timeIn: '09:46', timeOut: '16:34', totalHours: '6h 48m', status: 'In-office' },
  { id: 5, day: 'Tuesday', date: '7 November 2023', timeIn: '---', timeOut: '---', totalHours: '---', status: 'No Show' },
  { id: 6, day: 'Wednesday', date: '8 November 2023', timeIn: '10:50', timeOut: '17:50', totalHours: '7h 00m', status: 'In-office' },
  { id: 7, day: 'Thursday', date: '9 November 2023', timeIn: '08:30', timeOut: '17:00', totalHours: '8h 30m', status: 'Mission' },
  { id: 8, day: 'Friday', date: '10 November 2023', timeIn: '---', timeOut: '---', totalHours: '---', status: 'Weekend' },
  { id: 9, day: 'Saturday', date: '11 November 2023', timeIn: '---', timeOut: '---', totalHours: '---', status: 'Weekend' },
  { id: 10, day: 'Sunday', date: '12 November 2023', timeIn: '09:00', timeOut: '17:30', totalHours: '8h 30m', status: 'In-office' },
  { id: 11, day: 'Monday', date: '13 November 2023', timeIn: '---', timeOut: '---', totalHours: '---', status: 'Annual Leave' },
  { id: 12, day: 'Tuesday', date: '14 November 2023', timeIn: '---', timeOut: '---', totalHours: '---', status: 'Sick Leave' },
  { id: 13, day: 'Wednesday', date: '15 November 2023', timeIn: '10:00', timeOut: '18:00', totalHours: '8h 00m', status: 'In-office' },
  { id: 14, day: 'Thursday', date: '16 November 2023', timeIn: '---', timeOut: '---', totalHours: '---', status: 'Holiday' },
  { id: 15, day: 'Friday', date: '17 November 2023', timeIn: '---', timeOut: '---', totalHours: '---', status: 'Weekend' },
];

// ── Filter options ──
const ALL_FILTER_VALUE = 'All';
const uniqueSorted = (values: Array<string | undefined | null>) =>
  Array.from(new Set(values.map((value) => value?.trim()).filter(Boolean) as string[]))
    .sort((a, b) => a.localeCompare(b));
const months = [
  { value: 'all', label: 'All' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];
const years = ['2021', '2022', '2023', '2024', '2025', '2026'];

const employeeNames = [
  'Maryam Hussein',
  'Ahmed Salem',
  'Sara Khalil',
  'Omar Farouk',
  'Fatima Noor',
  'Mohamed Shalaby',
];

// ── Status badge variant map ──
const statusVariantMap: Record<DayStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'muted' | 'pending' | 'noshow' | 'approved' | 'inoffice' | 'weekend'; label: string }> = {
  'In-office': { variant: 'inoffice', label: 'In-office' },
  'Weekend': { variant: 'weekend', label: 'Weekend' },
  'No Show': { variant: 'noshow', label: 'No Show' },
  'Mission': { variant: 'info', label: 'Mission' },
  'Annual Leave': { variant: 'approved', label: 'Annual Leave' },
  'Sick Leave': { variant: 'warning', label: 'Sick Leave' },
  'Unfilled': { variant: 'muted', label: 'Unfilled' },
  'Holiday': { variant: 'success', label: 'Holiday' },
};

// ── Custom Recharts Tooltip ──
const CustomBarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-3 shadow-[var(--elevation-sm)]">
      <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">{d.name}</p>
      <p className="text-[var(--text-xs)] text-muted-foreground">{d.hours} hours ({d.percentage}%)</p>
    </div>
  );
};

// ── Main Component ──
export const Attendance: React.FC = () => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('11');
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedPeriodDate, setSelectedPeriodDate] = useState('2023-11-01');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('Mohamed Shalaby');

  // Advanced filter state
  const [filterDepartment, setFilterDepartment] = useState(ALL_FILTER_VALUE);
  const [filterJobTitle, setFilterJobTitle] = useState(ALL_FILTER_VALUE);
  const [filterGradYear, setFilterGradYear] = useState('');
  const [filterHiredAfter, setFilterHiredAfter] = useState('');
  const [filterActivityTypes, setFilterActivityTypes] = useState<string[]>([]);
  const [filterEmploymentTypes, setFilterEmploymentTypes] = useState<string[]>([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([ALL_FILTER_VALUE]);
  const [jobTitleOptions, setJobTitleOptions] = useState<string[]>([ALL_FILTER_VALUE]);
  const [activityTypeOptions, setActivityTypeOptions] = useState<string[]>([]);
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [pageInput, setPageInput] = useState('1');

  // State for days
  const [days, setDays] = useState<DayRecord[]>(mockDays);

  React.useEffect(() => {
    let isMounted = true;

    const loadFilterOptions = async () => {
      try {
        const [departmentList, jobTitleList, employeeList] = await Promise.all([
          DepartmentService.getAll(),
          JobTitleService.getAll(),
          EmployeeService.getAll(),
        ]);

        if (!isMounted) return;

        const nextDepartments = [ALL_FILTER_VALUE, ...uniqueSorted(departmentList.map((department) => department.name))];
        const nextJobTitles = [ALL_FILTER_VALUE, ...uniqueSorted(jobTitleList.map((jobTitle) => jobTitle.title))];
        const nextActivityTypes = uniqueSorted(employeeList.map((employee) => employee.activityType));
        const nextEmploymentTypes = uniqueSorted(employeeList.map((employee) => employee.contractType));

        setDepartmentOptions(nextDepartments);
        setJobTitleOptions(nextJobTitles);
        setActivityTypeOptions(nextActivityTypes);
        setEmploymentTypeOptions(nextEmploymentTypes);

        setFilterDepartment((current) => nextDepartments.includes(current) ? current : ALL_FILTER_VALUE);
        setFilterJobTitle((current) => nextJobTitles.includes(current) ? current : ALL_FILTER_VALUE);
        setFilterActivityTypes((current) => current.filter((type) => nextActivityTypes.includes(type)));
        setFilterEmploymentTypes((current) => current.filter((type) => nextEmploymentTypes.includes(type)));
      } catch (err) {
        console.error('Failed to load attendance filter options:', err);
        toast.error('Unable to load filter options from the database');
      }
    };

    loadFilterOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const dbList = await AttendanceService.getByDate(todayStr);
        if (dbList.length > 0) {
          // If we have live database logs, display them
          const mapped = dbList.map((a, index) => ({
            id: index + 1,
            day: new Date(a.date).toLocaleDateString('en-US', { weekday: 'long' }),
            date: new Date(a.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
            timeIn: a.clockIn || '---',
            timeOut: a.clockOut || '---',
            totalHours: a.clockIn && a.clockOut ? '8h 00m' : '---',
            status: a.status === 'Present' ? 'In-office' as const : a.status as any
          }));
          setDays(mapped);
        }
      } catch (err) {
        console.error('Failed to load attendance:', err);
      }
    };
    fetchAttendance();
  }, []);

  // Compute
  const totalPages = Math.max(1, Math.ceil(days.length / itemsPerPage));
  const paginatedDays = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return days.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, days]);

  // Filter helpers
  const toggleActivityType = (type: string) => {
    setFilterActivityTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleEmploymentType = (type: string) => {
    setFilterEmploymentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const applyFilters = () => {
    let count = 0;
    if (filterDepartment !== ALL_FILTER_VALUE) count++;
    if (filterJobTitle !== ALL_FILTER_VALUE) count++;
    if (filterGradYear) count++;
    if (filterHiredAfter) count++;
    if (filterActivityTypes.length > 0) count++;
    if (filterEmploymentTypes.length > 0) count++;
    setActiveFiltersCount(count);
    setFilterOpen(false);
    toast.success('Filters applied successfully', {
      description: count > 0 ? `${count} filter${count > 1 ? 's' : ''} active` : 'Showing all results',
    });
  };

  const clearFilters = () => {
    setFilterDepartment(ALL_FILTER_VALUE);
    setFilterJobTitle(ALL_FILTER_VALUE);
    setFilterGradYear('');
    setFilterHiredAfter('');
    setFilterActivityTypes([]);
    setFilterEmploymentTypes([]);
    setActiveFiltersCount(0);
    toast.info('All filters cleared');
  };

  const handleDownload = () => {
    toast.success('Download started', {
      description: 'Attendance data is being exported to CSV.',
    });
  };

  const handleSummaryExport = () => {
    toast.success('Monthly summary exported to CSV', {
      description: `${monthLabel} ${selectedYear} attendance summary is ready for HR review.`,
    });
  };

  const handlePeriodChange = (date: string) => {
    setSelectedPeriodDate(date);
    if (!date) {
      setSelectedMonth('all');
      return;
    }

    const [year, month] = date.split('-');
    setSelectedYear(year);
    setSelectedMonth(String(Number(month)));
  };

  const handlePageChange = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
    setPageInput(String(p));
  };

  const monthLabel = months.find((m) => m.value === selectedMonth)?.label ?? 'All';

  return (
    <div className="space-y-6 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6 max-w-7xl mx-auto">
      {/* ── Page Title ── */}
      <div>
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--page-title-size)', fontWeight: 'var(--page-title-weight)' }} className="text-foreground">Employee Attendance</h2>
      </div>

      {/* ── Search & Filters Row ── */}
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        {/* Search + filter button */}
        <div className="w-full flex-1 space-y-1 sm:min-w-[280px]">
          <div className="flex items-center gap-2">
            <label htmlFor="attendance-employee-search" className="text-foreground">Search Employees</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="h-11 w-11 cursor-pointer rounded-[var(--radius-sm)] hover:bg-muted" aria-label="Show employee search tips">
                  <Info className="w-4 h-4 text-primary" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[260px]">
                <ul className="space-y-1 text-[var(--text-xs)]">
                  <li>Search results are based on selected filters.</li>
                  <li>To search all employees, <strong>clear all filters</strong>.</li>
                  <li>Search by <strong>name</strong>, <strong>email</strong>, or <strong>Employee#</strong>.</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="relative flex items-center gap-2">
            <form role="search" onSubmit={(e) => e.preventDefault()} className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="attendance-employee-search"
                type="search"
                placeholder="Search by name, email, or Employee#..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="search"
                className="w-full h-[44px] ps-10 pe-4 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow text-[var(--text-sm)]"
              />
            </form>

            {/* Filter Popover */}
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <button
                  aria-label={activeFiltersCount > 0 ? `Open filters, ${activeFiltersCount} active` : 'Open filters'}
                  className={cn(
                    'relative h-[44px] px-3 border rounded-[var(--radius-input)] bg-card hover:bg-muted transition-colors cursor-pointer flex items-center justify-center gap-1.5',
                    activeFiltersCount > 0 ? 'border-primary text-primary' : 'border-border text-muted-foreground'
                  )}
                >
                  <Filter className="w-4 h-4" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" collisionPadding={16} className="w-80 p-0">
                <FilterPanel
                  department={filterDepartment}
                  setDepartment={setFilterDepartment}
                  jobTitle={filterJobTitle}
                  setJobTitle={setFilterJobTitle}
                  gradYear={filterGradYear}
                  setGradYear={setFilterGradYear}
                  hiredAfter={filterHiredAfter}
                  setHiredAfter={setFilterHiredAfter}
                  activityTypes={filterActivityTypes}
                  toggleActivityType={toggleActivityType}
                  employmentTypes={filterEmploymentTypes}
                  toggleEmploymentType={toggleEmploymentType}
                  departmentOptions={departmentOptions}
                  jobTitleOptions={jobTitleOptions}
                  activityTypeOptions={activityTypeOptions}
                  employmentTypeOptions={employmentTypeOptions}
                  onApply={applyFilters}
                  onClear={clearFilters}
                  onClose={() => setFilterOpen(false)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Employee */}
        <div className="w-full space-y-1 sm:w-52">
          <label htmlFor="attendance-employee-select" className="text-foreground">Employee</label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger id="attendance-employee-select" className="min-h-[44px] rounded-[var(--radius-input)]" aria-label="Employee">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employeeNames.map((n) => (
                <SelectItem key={n} value={n}>{localizePersonName(n, language)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Period */}
        <div className="w-full space-y-1 sm:w-56">
          <label htmlFor="attendance-period" className="text-foreground">Attendance Period</label>
          <DatePicker
            id="attendance-period"
            value={selectedPeriodDate}
            onChange={handlePeriodChange}
            placeholder="Select date"
            aria-label="Attendance period"
          />
        </div>
      </div>

      {/* ── Context label ── */}
      <p className="text-[var(--text-sm)] text-foreground">
        Showing attendance for <span className="font-[var(--font-weight-semibold)] text-primary">{localizePersonName(selectedEmployee, language)}</span>
        {selectedMonth !== 'all' && <> &middot; {monthLabel} {selectedYear}</>}
      </p>

      {/* ── Summary View ── */}
      <section className="bg-card border border-border rounded-[var(--radius-card)] p-4 shadow-[var(--elevation-sm)] sm:p-6" aria-labelledby="attendance-summary-heading">
        <div className="mb-5 flex flex-col items-start gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[var(--text-xs)] font-[var(--font-weight-semibold)] text-muted-foreground">
              Attendance
            </p>
            <h3 id="attendance-summary-heading" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Summary View</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-xs)] text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {monthLabel} {selectedYear}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSummaryExport}
                  aria-label="Export monthly attendance summary"
                  className="h-11 w-11"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-[var(--text-xs)]">Export monthly summary to CSV</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div
          className={cn(
            'mb-5 flex flex-col gap-3 rounded-[var(--radius-card)] border p-4 sm:flex-row sm:items-center sm:justify-between',
            meetsOfficeGoal
              ? 'border-[var(--chart-3)]/70 bg-[var(--chart-3)]/10'
              : 'border-destructive/70 bg-destructive/10'
          )}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {meetsOfficeGoal ? (
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--chart-3)]" aria-hidden="true" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
            )}
            <div>
              <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">
                Office Attendance: {officePercent}%
              </p>
              <p className={cn('text-[var(--text-xs)] font-[var(--font-weight-medium)]', meetsOfficeGoal ? 'text-[var(--chart-3)]' : 'text-destructive')}>
                {meetsOfficeGoal ? '▲' : '▼'} {Math.abs(officeGoalDelta)}% {meetsOfficeGoal ? 'above' : 'below'} the {OFFICE_GOAL_PERCENT}% company goal
              </p>
            </div>
          </div>
          <span className="rounded-full bg-card px-3 py-1 text-[var(--text-xs)] font-[var(--font-weight-semibold)] text-foreground shadow-[var(--elevation-sm)]">
            {meetsOfficeGoal ? 'Goal met' : 'Goal missed'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 items-start xl:grid-cols-[minmax(430px,1fr)_minmax(340px,0.9fr)] xl:gap-8">
          {/* Left: summary table */}
          <div className="hidden w-full overflow-x-auto sm:block">
            <table className="min-w-[430px] w-full text-start border-collapse cursor-default" aria-label={`Attendance summary for ${monthLabel} ${selectedYear}`}>
              <caption className="sr-only">Attendance summary by category, hours, and percentage</caption>
              <thead>
                <tr className="text-[var(--text-xs)] font-[var(--font-weight-medium)] text-muted-foreground border-b border-border">
                  <th scope="col" className="text-start pb-3 pe-6 font-medium min-w-[180px]">Category</th>
                  <th scope="col" className="text-end pb-3 px-6 font-medium min-w-[150px]">
                    <span className="inline-flex items-center justify-end gap-1.5">
                      Hours
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] hover:bg-muted" aria-label="Explain attendance hours">
                            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[260px]">
                          <p className="text-[var(--text-xs)]">Hours are calculated based on clock-in/clock-out records. Lunch breaks are excluded. Minimum day threshold is 4 hours.</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </th>
                  <th scope="col" className="text-end pb-3 ps-6 font-medium min-w-[120px]">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr className="text-[var(--text-sm)] bg-muted/20">
                  <th scope="row" className="py-3 pe-6 text-start font-[var(--font-weight-medium)] text-foreground">Expected Working Hours</th>
                  <td className="py-3 px-6 text-end font-[var(--font-weight-medium)] text-foreground">{EXPECTED_WORKING_HOURS}h</td>
                  <td className="py-3 ps-6 text-end text-muted-foreground">—</td>
                </tr>
                <tr className="text-[var(--text-sm)] bg-muted/10">
                  <th scope="row" className="py-3 pe-6 text-start font-[var(--font-weight-medium)] text-foreground">Actual Hours Logged</th>
                  <td className="py-3 px-6 text-end font-[var(--font-weight-medium)] text-foreground">{totalHours}h</td>
                  <td className="py-3 ps-6 text-end text-muted-foreground">{actualHoursPercent}%</td>
                </tr>
                {summaryData.map((item) => (
                  <tr
                    key={item.id}
                    className="text-[var(--text-sm)] hover:bg-muted/30 transition-colors"
                  >
                    <th scope="row" className="py-3 pe-6 text-start font-[var(--font-weight-normal)]">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{ backgroundColor: item.cssColor }}
                        />
                        <span className="text-foreground">{item.name}</span>
                      </div>
                    </th>
                    <td className={cn('py-3 px-6 text-end font-[var(--font-weight-medium)]', severityHoursClass(item.severity))}>
                      <div className="ms-auto max-w-[120px] space-y-1">
                        <span>{item.hours}h</span>
                        <span className="block h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                          <span
                            className="block h-full rounded-full"
                            style={{ width: `${Math.max(4, (item.hours / maxSummaryHours) * 100)}%`, backgroundColor: item.cssColor }}
                          />
                        </span>
                      </div>
                    </td>
                    <td className="py-3 ps-6 text-end text-muted-foreground">{item.percentage}%</td>
                  </tr>
                ))}
                {/* Total */}
                <tr className="font-[var(--font-weight-semibold)] text-[var(--text-sm)] text-foreground border-t border-border">
                  <th scope="row" className="py-4 pe-6 text-start font-semibold">Total Hours</th>
                  <td className="py-4 px-6 text-end font-semibold">{totalHours}h</td>
                  <td className="py-4 ps-6 text-end font-semibold">100%</td>
                </tr>
              </tbody>
            </table>
            <Pagination currentPage={1} totalPages={1} itemsPerPage={15} onPageChange={() => {}} onItemsPerPageChange={() => {}} />
          </div>

          <div className="space-y-3 sm:hidden" aria-label={`Attendance summary cards for ${monthLabel} ${selectedYear}`}>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-card)] border border-border bg-muted/20 p-3">
                <p className="text-[var(--text-xs)] text-muted-foreground">Expected</p>
                <p className="text-[var(--text-lg)] font-[var(--font-weight-semibold)] text-foreground">{EXPECTED_WORKING_HOURS}h</p>
              </div>
              <div className="rounded-[var(--radius-card)] border border-border bg-muted/20 p-3">
                <p className="text-[var(--text-xs)] text-muted-foreground">Actual</p>
                <p className="text-[var(--text-lg)] font-[var(--font-weight-semibold)] text-foreground">{totalHours}h</p>
              </div>
            </div>
            {summaryData.map((item) => (
              <div
                key={item.id}
                className="rounded-[var(--radius-card)] border border-border bg-card p-3 shadow-[var(--elevation-sm)]"
                style={{ borderInlineStart: `4px solid ${item.cssColor}` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground">{item.name}</span>
                  <span className={cn('text-[var(--text-sm)] font-[var(--font-weight-semibold)]', severityHoursClass(item.severity))}>{item.hours}h</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(4, (item.hours / maxSummaryHours) * 100)}%`, backgroundColor: item.cssColor }} />
                  </div>
                  <span className="min-w-12 text-end text-[var(--text-xs)] text-muted-foreground">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: horizontal bar chart */}
          <div className="h-[280px] xl:hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={summaryData}
                layout="vertical"
                margin={i18n.language === 'ar' ? { top: 4, right: 30, left: 10, bottom: 4 } : { top: 4, right: 10, left: 20, bottom: 4 }}
                barCategoryGap="24%"
              >
                <defs>
                  {summaryData.map((entry) => (
                    <pattern key={entry.id} id={`summary-mobile-${entry.id}`} width="8" height="8" patternUnits="userSpaceOnUse">
                      <rect width="8" height="8" fill={entry.color} />
                      <path d="M0 8L8 0" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                    </pattern>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                  unit="h"
                  reversed={i18n.language === 'ar'}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={110}
                  orientation={i18n.language === 'ar' ? 'right' : 'left'}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'Inter, sans-serif', textAnchor: 'end' }}
                  dx={i18n.language === 'ar' ? 8 : -8}
                />
                <RechartsTooltip content={<CustomBarTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
                <ReferenceLine
                  x={officeGoalHours}
                  stroke="var(--ring)"
                  strokeDasharray="4 4"
                  label={{ value: 'Min. Office Target', fill: 'var(--foreground)', fontSize: 11, position: 'insideTop' }}
                />
                <Bar dataKey="hours" radius={i18n.language === 'ar' ? [4, 0, 0, 4] : [0, 4, 4, 0]} maxBarSize={28}>
                  {summaryData.map((entry) => (
                    <Cell key={entry.id} fill={`url(#summary-mobile-${entry.id})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Desktop: vertical bar chart */}
          <div className="hidden h-[280px] min-w-0 overflow-hidden xl:block">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={summaryData}
                margin={i18n.language === 'ar' ? { top: 8, right: 16, left: 8, bottom: 18 } : { top: 8, right: 8, left: 16, bottom: 18 }}
                barCategoryGap="18%"
              >
                <defs>
                  {summaryData.map((entry) => (
                    <pattern key={entry.id} id={`summary-desktop-${entry.id}`} width="8" height="8" patternUnits="userSpaceOnUse">
                      <rect width="8" height="8" fill={entry.color} />
                      <path d="M0 8L8 0" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                    </pattern>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                  dy={4}
                  reversed={i18n.language === 'ar'}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}
                  unit="h"
                  dx={i18n.language === 'ar' ? 4 : -4}
                />
                <RechartsTooltip content={<CustomBarTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
                <ReferenceLine
                  y={officeGoalHours}
                  stroke="var(--ring)"
                  strokeDasharray="4 4"
                  label={{ value: 'Min. Office Target', fill: 'var(--foreground)', fontSize: 11, position: 'insideTopRight' }}
                />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={52}>
                  {summaryData.map((entry) => (
                    <Cell key={entry.id} fill={`url(#summary-desktop-${entry.id})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ── Annual and Sick Leaves ── */}
      <section className="space-y-3" aria-labelledby="attendance-leave-balances-heading">
        <h3 id="attendance-leave-balances-heading" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Annual and Sick Leaves</h3>
        <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
          <div className="overflow-x-auto">
            <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
              <caption className="sr-only">Annual and sick leave balance details</caption>
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Leave Type</th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-start">Total Balance</th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-start">Bridge</th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-start">From Last Year</th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-start">Used Balance</th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-start">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground font-[var(--font-weight-medium)]">Annual Leave</td>
                  <td className="px-4 py-3 text-foreground text-start">21 days</td>
                  <td className="px-4 py-3 text-foreground text-start">5</td>
                  <td className="px-4 py-3 text-foreground text-start">4</td>
                  <td className="px-4 py-3 text-start">
                    <span className="text-[var(--chart-4)] font-[var(--font-weight-medium)]">6</span>
                  </td>
                  <td className="px-4 py-3 text-start">
                    <span className="text-[var(--chart-3)] font-[var(--font-weight-semibold)]">14</span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground font-[var(--font-weight-medium)]">Sick Leave</td>
                  <td className="px-4 py-3 text-foreground text-start">14 days</td>
                  <td className="px-4 py-3 text-foreground text-start">0</td>
                  <td className="px-4 py-3 text-foreground text-start">2</td>
                  <td className="px-4 py-3 text-start">
                    <span className="text-[var(--chart-4)] font-[var(--font-weight-medium)]">3</span>
                  </td>
                  <td className="px-4 py-3 text-start">
                    <span className="text-[var(--chart-3)] font-[var(--font-weight-semibold)]">13</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Pagination currentPage={1} totalPages={1} itemsPerPage={15} onPageChange={() => {}} onItemsPerPageChange={() => {}} />
        </div>
      </section>

      {/* ── Days View ── */}
      <section className="space-y-3" aria-labelledby="attendance-days-heading">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h3 id="attendance-days-heading" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Days View</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="h-11 w-11 cursor-pointer rounded-[var(--radius-sm)] hover:bg-muted" aria-label="Show daily attendance table details">
                  <Info className="w-4 h-4 text-primary" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-[var(--text-xs)]">Detailed daily attendance records for the selected period.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Download Data
          </Button>
        </div>

        <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
          <div className="overflow-x-auto">
            <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
              <caption className="sr-only">Daily attendance records for the selected employee and period</caption>
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Day</th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Date</th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Time In</th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Time Out</th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Total Hours</th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Day Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedDays.map((row) => {
                  const statusConfig = statusVariantMap[row.status];
                  const isWeekend = row.status === 'Weekend';
                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        'transition-colors cursor-default',
                        isWeekend ? 'bg-muted/20' : 'hover:bg-muted/30'
                      )}
                    >
                      <td className={cn('px-4 py-3', isWeekend ? 'text-muted-foreground' : 'text-foreground')}>{row.day}</td>
                      <td className={cn('px-4 py-3', isWeekend ? 'text-muted-foreground' : 'text-foreground')}>{row.date}</td>
                      <td className={cn('px-4 py-3 tabular-nums', isWeekend ? 'text-muted-foreground' : 'text-foreground')}>{row.timeIn}</td>
                      <td className={cn('px-4 py-3 tabular-nums', isWeekend ? 'text-muted-foreground' : 'text-foreground')}>{row.timeOut}</td>
                      <td className={cn('px-4 py-3 tabular-nums', isWeekend ? 'text-muted-foreground' : 'text-foreground font-[var(--font-weight-medium)]')}>
                        {row.totalHours}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={(v) => { setItemsPerPage(v); setCurrentPage(1); setPageInput('1'); }}
            totalItems={mockDays.length}
          />
        </div>
      </section>
    </div>
  );
};

// ── Filter Panel ──
interface FilterPanelProps {
  department: string;
  setDepartment: (v: string) => void;
  jobTitle: string;
  setJobTitle: (v: string) => void;
  gradYear: string;
  setGradYear: (v: string) => void;
  hiredAfter: string;
  setHiredAfter: (v: string) => void;
  activityTypes: string[];
  toggleActivityType: (v: string) => void;
  employmentTypes: string[];
  toggleEmploymentType: (v: string) => void;
  departmentOptions: string[];
  jobTitleOptions: string[];
  activityTypeOptions: string[];
  employmentTypeOptions: string[];
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  department,
  setDepartment,
  jobTitle,
  setJobTitle,
  gradYear,
  setGradYear,
  hiredAfter,
  setHiredAfter,
  activityTypes: selectedActivity,
  toggleActivityType,
  employmentTypes: selectedEmployment,
  toggleEmploymentType,
  departmentOptions,
  jobTitleOptions,
  activityTypeOptions,
  employmentTypeOptions,
  onApply,
  onClear,
  onClose,
}) => {
  return (
    <div className="p-4 space-y-4 max-h-[var(--radix-popover-content-available-height,480px)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Filter Options</span>
        <button onClick={onClose} className="h-11 w-11 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer" aria-label="Close filters">
          <X className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </div>

      {/* Department */}
      <div className="space-y-1">
        <label htmlFor="attendance-filter-department" className="text-foreground">Department</label>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger id="attendance-filter-department" className="min-h-[44px] rounded-[var(--radius-input)]" aria-label="Department">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {departmentOptions.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Job Title */}
      <div className="space-y-1">
        <label htmlFor="attendance-filter-job-title" className="text-foreground">Job Title</label>
        <Select value={jobTitle} onValueChange={setJobTitle}>
          <SelectTrigger id="attendance-filter-job-title" className="min-h-[44px] rounded-[var(--radius-input)]" aria-label="Job title">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {jobTitleOptions.map((j) => (
              <SelectItem key={j} value={j}>{j}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Graduation Year */}
      <div className="space-y-1">
        <label htmlFor="attendance-filter-grad-year" className="text-foreground">Graduation Year</label>
        <input
          id="attendance-filter-grad-year"
          type="text"
          inputMode="numeric"
          value={gradYear}
          onChange={(e) => setGradYear(e.target.value)}
          placeholder="e.g. 2013"
          className="w-full min-h-[44px] px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow"
        />
      </div>

      {/* Hired After */}
      <div className="space-y-1">
        <label htmlFor="attendance-filter-hired-after" className="text-foreground">Hired After</label>
        <DatePicker id="attendance-filter-hired-after" value={hiredAfter} onChange={setHiredAfter} placeholder="Select date" aria-label="Hired after" />
      </div>

      {/* Activity Type */}
      <fieldset className="space-y-2">
        <legend className="text-foreground">Activity Type</legend>
        <div className="space-y-2">
          {activityTypeOptions.map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={selectedActivity.includes(type)}
                onCheckedChange={() => toggleActivityType(type)}
              />
              <span className="text-[var(--text-sm)] text-foreground group-hover:text-primary transition-colors font-[var(--font-weight-normal)]">
                {type}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Employment Type */}
      <fieldset className="space-y-2">
        <legend className="text-foreground">Employment Type</legend>
        <div className="space-y-2">
          {employmentTypeOptions.map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={selectedEmployment.includes(type)}
                onCheckedChange={() => toggleEmploymentType(type)}
              />
              <span className="text-[var(--text-sm)] text-foreground group-hover:text-primary transition-colors font-[var(--font-weight-normal)]">
                {type}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <Button onClick={onApply} className="w-full rounded-[var(--radius-button)]">
          Apply Filter
        </Button>
        <Button variant="outline" onClick={onClear} className="w-full rounded-[var(--radius-button)]">
          Clear Filter
        </Button>
      </div>
    </div>
  );
};
