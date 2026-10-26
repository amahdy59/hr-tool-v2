import React, { useState, useMemo } from 'react';
import { RequestStatusChart, requestStatus } from './RequestVisuals';
import { CalendarGrid } from './CalendarGrid';
import { StatusBadge } from './StatusBadge';
import { RequestLeaveModal, type LeaveFormData } from './RequestLeaveModal';
import { RequestMissionModal } from './RequestMissionModal';
import { LeaveDetailModal, type LeaveDetail } from './LeaveDetailModal';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from './ui/button';
import { Pagination } from './Pagination';
import { DatePicker } from './ui/date-picker';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  MoreVertical,
  Download,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Info,
  HelpCircle,
  Eye,
  XCircle,
  Pencil,
  Filter,
  Briefcase,
  Calendar,
  Umbrella,
  Printer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format, parseISO, isValid } from 'date-fns';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from './ui/select';
import { useTranslation } from 'react-i18next';
import { localizeFirstName } from '@/lib/localizedNames';
import { calculateAnnualEntitlement } from '@/lib/leaveCalculations';
import { LeaveService, type LeaveRequest } from '@/lib/services/dbServices';
import { exportToCSV, exportToExcel } from '@/lib/export';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from './ui/drawer';

// --- Types ---
interface HistoryItem {
  id: string;
  type: string;
  reqDate: string;
  range: string;
  duration: string;
  notes: string;
  status: 'approved' | 'pending' | 'noshow' | 'cancelled' | 'rejected';
  labelOverride?: string;
  customColor?: string;
  canEdit?: boolean;
  canCancel?: boolean;
}

// --- Mock Data ---
// Helper to convert a date range string like "Sep 10 - Sep 14" (with current year) to YYYY-MM-DD
const rangeToIso = (rangeStr: string): { start: string; end: string } | null => {
  const iso = rangeStr.match(/^(\d{4}-\d{2}-\d{2}) - (\d{4}-\d{2}-\d{2})$/);
  if (iso) return { start: iso[1], end: iso[2] };
  const parts = rangeStr.split(' - '); if (parts.length !== 2) return null;
  const year = new Date().getFullYear();
  const start = new Date(`${parts[0]} ${year}`); const end = new Date(`${parts[1]} ${year}`);
  if (!isValid(start) || !isValid(end)) return null;
  if (end < start) end.setFullYear(year + 1);
  return { start: format(start, 'yyyy-MM-dd'), end: format(end, 'yyyy-MM-dd') };
};
const historyData: HistoryItem[] = [
  {
    id: '1',
    type: 'Sick',
    reqDate: '28 August 2011',
    range: 'Sep 10 - Sep 14',
    duration: '5 days',
    notes: 'Fever and flu',
    status: 'approved',
    canEdit: false,
    canCancel: false,
  },
  {
    id: '2',
    type: 'Vacation',
    reqDate: '27 April 2015',
    range: 'Oct 5 - Oct 12',
    duration: '8 days',
    notes: 'Annual leave',
    status: 'approved',
    canEdit: false,
    canCancel: false,
  },
  {
    id: '3',
    type: 'Sick',
    reqDate: '13 April 2006',
    range: 'Nov 3 - Nov 6',
    duration: '4 days',
    notes: 'Stomachache',
    status: 'pending',
    canEdit: true,
    canCancel: true,
  },
  {
    id: '4',
    type: 'Vacation',
    reqDate: '26 April 2015',
    range: 'Dec 20 - Jan 2',
    duration: '14 days',
    notes: 'Holiday travel',
    status: 'noshow',
    labelOverride: 'Rejected',
    canEdit: false,
    canCancel: false,
  },
  {
    id: '5',
    type: 'Vacation',
    reqDate: '27 April 2023',
    range: 'Jan 15 - Jan 17',
    duration: '3 days',
    notes: 'Cold symptoms',
    status: 'cancelled',
    labelOverride: 'Cancelled',
    canEdit: false,
    canCancel: false,
  },
];

const mockLeaveDetail: LeaveDetail = {
  id: '3',
  type: 'Sick',
  dateRange: '13 January 2023 - 19 January 2023',
  duration: '5 days',
  status: 'hr',
  attachments: [
    { name: 'sickleave8-12-2-23.jpeg', size: '141 KB', date: '16 Aug 2022' },
    { name: 'medcert8-12-2-23.jpg', size: '141 KB', date: '16 Aug 2022' },
  ],
  notes: [
    {
      author: 'Mahmoud Thursday',
      role: 'HR Manager',
      text: 'Mohamed Thursday',
    },
    {
      author: 'Aly Othman',
      role: 'HR Officer',
      text: 'Wish you a speedy recovery. 🙏',
    },
  ],
};

const weekendOptions = [
  'Friday and Saturday',
  'Saturday and Sunday',
  'Thursday and Friday',
];

interface DashboardProps {
  onRequestLeave: (data?: any) => void;
  onRequestMission: (data?: any) => void;
  currentUser?: { name: string; email: string; image?: string };
}

export const Dashboard: React.FC<DashboardProps> = ({ onRequestLeave, onRequestMission, currentUser }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar' || i18n.language.startsWith('ar');
  // Modal states
  const [leaveDetailOpen, setLeaveDetailOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveDetail | null>(null);

  // Confirm dialog states
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmCancelId, setConfirmCancelId] = useState<string>('');
  const [changeWeekendOpen, setChangeWeekendOpen] = useState(false);

  // Edit leave states
  const [editLeaveOpen, setEditLeaveOpen] = useState(false);
  const [editLeaveData, setEditLeaveData] = useState<Partial<LeaveFormData>>({});

  // Plus button choose type modal states
  const [chooseRequestOpen, setChooseRequestOpen] = useState(false);
  const [chooseRequestDate, setChooseRequestDate] = useState('');

  // History pagination and filter state
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPerPage, setHistoryPerPage] = useState(10);
  const [historyLeaveType, setHistoryLeaveType] = useState('all');
  const [historyStartDate, setHistoryStartDate] = useState('');
  const [historyEndDate, setHistoryEndDate] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Live leaves from Cloudflare R2 / storage
  const [liveLeaves, setLiveLeaves] = useState<LeaveRequest[]>([]);
  React.useEffect(() => {
    const load = () => LeaveService.getAll().then(setLiveLeaves).catch(console.warn);
    void load(); window.addEventListener('hr-data-changed', load);
    return () => window.removeEventListener('hr-data-changed', load);
  }, []);

  const activeHistoryData = useMemo(() => {
    if (!liveLeaves || liveLeaves.length === 0) return historyData;
    const convertedLive: HistoryItem[] = liveLeaves.map((l, idx) => ({
      id: l.id || `live-${idx}`,
      type: l.type || 'Leave',
      reqDate: l.startDate || 'Recent',
      range: l.range || 'N/A',
      duration: l.duration || '1 day',
      notes: l.notes || '',
      status: (l.status === 'Approved' || l.status === 'approved') ? 'approved' : (l.status === 'Rejected' || l.status === 'rejected') ? 'noshow' : 'pending',
      canEdit: l.status === 'pending',
      canCancel: l.status === 'pending'
    }));
    return convertedLive;
  }, [liveLeaves]);

  // Filtered history items
  const filteredHistory = useMemo(() => {
    return activeHistoryData.filter((item) => {
      if (historyLeaveType && historyLeaveType !== 'all') {
        const itemType = item.type.toLowerCase();
        if (historyLeaveType === 'vacation' && !itemType.includes('vacation') && !itemType.includes('annual')) {
          return false;
        } else if (historyLeaveType === 'sick' && !itemType.includes('sick')) {
          return false;
        } else if (historyLeaveType === 'annual' && !itemType.includes('annual')) {
          return false;
        } else if (historyLeaveType === 'maternity' && !itemType.includes('maternity')) {
          return false;
        } else if (historyLeaveType === 'paternity' && !itemType.includes('paternity')) {
          return false;
        }
      }
      const dates = rangeToIso(item.range);
      if (historyStartDate && (!dates || dates.end < historyStartDate)) return false;
      if (historyEndDate && (!dates || dates.start > historyEndDate)) return false;
      return true;
    });
  }, [historyLeaveType, historyStartDate, historyEndDate, activeHistoryData]);

  React.useEffect(() => { setHistoryPage(1); }, [historyLeaveType, historyStartDate, historyEndDate]);

  const historyTotalPages = Math.max(1, Math.ceil(filteredHistory.length / historyPerPage));
  const paginatedHistory = useMemo(() => {
    const start = (historyPage - 1) * historyPerPage;
    return filteredHistory.slice(start, start + historyPerPage);
  }, [historyPage, historyPerPage, filteredHistory]);

  const handleDownloadHistory = async () => {
    try {
      const exportRows = filteredHistory.map((item) => ({
        Type: item.type,
        'Request Date': item.reqDate,
        'Date Range': item.range,
        Duration: item.duration,
        Notes: item.notes,
        Status: item.status,
      }));
      await exportToExcel(exportRows, `HR-History-${format(new Date(), 'yyyy-MM-dd')}`);
      toast.success(isArabic ? 'تم تنزيل البيانات بنجاح' : 'History data downloaded successfully');
    } catch {
      exportToCSV(filteredHistory, `HR-History-${format(new Date(), 'yyyy-MM-dd')}`);
    }
  };

  // Weekend state
  const [currentWeekend, setCurrentWeekend] = useState('Friday and Saturday');
  const [pendingWeekend, setPendingWeekend] = useState('');

  // --- Handlers ---

  const handleViewRequest = (item: { id: string; type: string; status: 'approved' | 'pending' | 'noshow' | 'cancelled' | 'rejected'; range: string; duration: string }) => {
    // For pending items (from calendar click), open edit modal directly
    if (item.status === 'pending') {
      const dates = rangeToIso(item.range);
      setEditLeaveData({
        leaveType: item.type,
        fromDate: dates?.start ?? '',
        toDate: dates?.end ?? '',
        notes: '',
      });
      setEditLeaveOpen(true);
      return;
    }

    let leaveStatus: 'requested' | 'hr' | 'complete' | 'cancelled' = 'hr';
    if (item.status === 'approved') leaveStatus = 'complete';
    else if (item.status === 'noshow' || item.status === 'cancelled' || item.status === 'rejected') leaveStatus = 'cancelled';

    // Find matching history item to get full detail
    const histItem = activeHistoryData.find(h => h.id === item.id);
    setSelectedLeave({
      ...mockLeaveDetail,
      id: item.id,
      type: item.type,
      dateRange: histItem?.range ?? item.range,
      duration: histItem?.duration ?? item.duration,
      status: leaveStatus,
    });
    setLeaveDetailOpen(true);
  };

  const handleCancelRequest = (id: string) => {
    setConfirmCancelId(id);
    setLeaveDetailOpen(false);
    setConfirmCancelOpen(true);
  };

  const handleConfirmCancel = () => {
    toast.success(
      'Sick leave from 13 January 2023 to 19 January 2023 cancelled successfully.',
      { duration: 5000 }
    );
    setConfirmCancelId('');
  };

  const handleEditRequest = (id: string) => {
    setLeaveDetailOpen(false);
    
    // Parse the date range to pre-fill the edit form.
    // Assuming format "13 January 2023 to 19 January 2023" from selectedLeave.
    let fromDate = '';
    let toDate = '';
    if (selectedLeave?.dateRange) {
      const parts = selectedLeave.dateRange.split(' to ');
      if (parts.length === 2) {
        // Convert to YYYY-MM-DD
        const from = new Date(parts[0]);
        const to = new Date(parts[1]);
        if (!isNaN(from.getTime())) fromDate = from.toISOString().split('T')[0];
        if (!isNaN(to.getTime())) toDate = to.toISOString().split('T')[0];
      }
    }

    setEditLeaveData({
      leaveType: selectedLeave?.type || 'Annual Leave',
      fromDate,
      toDate,
      notes: '',
    });
    setEditLeaveOpen(true);
  };

  const handleEditSubmit = (data: LeaveFormData) => {
    setEditLeaveOpen(false);
    toast.success(
      `${data.leaveType} resubmitted successfully.`,
      { duration: 5000 }
    );
  };

  const handleWeekendChange = (value: string) => {
    if (value !== currentWeekend) {
      setPendingWeekend(value);
      setChangeWeekendOpen(true);
    }
  };

  const handleConfirmWeekendChange = () => {
    const oldWeekend = currentWeekend;
    setCurrentWeekend(pendingWeekend);
    toast.success(
      `You successfully switched your weekends from ${oldWeekend} to ${pendingWeekend}.`,
      { duration: 5000 }
    );
    setPendingWeekend('');
  };

  const handleWeekendDiscard = () => {
    setPendingWeekend('');
  };

  const handleAddRequest = (dateStr: string) => {
    setChooseRequestDate(dateStr);
    setChooseRequestOpen(true);
  };

  return (
    <div className="mobile-page space-y-5 sm:space-y-8 max-w-7xl mx-auto">

      <div className="dashboard-welcome sm:rounded-2xl sm:border sm:border-border sm:bg-card sm:p-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1
              style={{
                fontFamily: "'Inter', sans-serif",
              }}
              className="text-xl sm:text-2xl font-semibold text-foreground"
            >
              {t('dashboard.welcome', 'Welcome')}, {localizeFirstName(currentUser?.name || 'Ahmed', i18n.resolvedLanguage || i18n.language)}!
            </h1>
            <p className="hidden lg:block text-sm text-muted-foreground max-w-xl">
              {t('dashboard.overviewDescription')}
            </p>
          </div>

          <div className="hidden lg:flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center shrink-0">
            <Button
              className="w-full sm:w-auto cursor-pointer shadow-2xs hover:shadow-xs rounded-xl"
              onClick={onRequestLeave}
            >
              {t('dashboard.requestLeave', 'Request Leave')}
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onRequestMission}
            >
              {t('dashboard.requestMission', 'Request Mission')}
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:hidden space-y-3">
        <section aria-label={t('mobile.balanceLabel')} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-semibold">{t('mobile.balanceLabel')}</h2><span className="text-xs text-muted-foreground">{t('mobile.balanceSample')}</span></div>
          <p className="mt-2 text-xl font-semibold">{t('mobile.availableDays', { count: calculateAnnualEntitlement(2013) - 5 + 4 - 6 })}</p>
          <div role="meter" aria-label={t('mobile.balanceLabel')} aria-valuemin={0} aria-valuemax={calculateAnnualEntitlement(2013) - 5 + 4} aria-valuenow={calculateAnnualEntitlement(2013) - 5 + 4 - 6} className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(calculateAnnualEntitlement(2013) - 5 + 4 - 6) / (calculateAnnualEntitlement(2013) - 5 + 4) * 100}%` }} /></div>
        </section>
        <RequestStatusChart items={activeHistoryData} compact />
      </div>

      {/* Timesheet Section (Desktop / Tablet >= 990px) */}
      <section className="hidden space-y-2 min-[990px]:block" aria-labelledby="timesheet-heading">
        <h3
          id="timesheet-heading"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--section-heading-size)',
            fontWeight: 'var(--section-heading-weight)',
          }}
          className="text-foreground"
        >
          {t('dashboard.timesheet', 'Timesheet')}
        </h3>
        <CalendarGrid
          onViewRequest={handleViewRequest}
          events={activeHistoryData
            .filter(h => h.range)
            .map(h => {
              const dates = rangeToIso(h.range);
              const color = h.customColor
                ? h.customColor
                : h.status === 'pending'
                  ? 'bg-chart-4'
                  : h.status === 'noshow'
                    ? 'bg-chart-5'
                    : 'bg-chart-3';
              return {
                id: h.id,
                type: h.type,
                label: h.labelOverride ?? h.type,
                color,
                status: h.status,
                range: h.range,
              };
            })}
          onAddRequest={handleAddRequest}
        />
      </section>

      {/* Mobile Agenda Schedule (Mobile / Small Tablet < 990px) */}
      <section className="min-[990px]:hidden space-y-3" aria-labelledby="mobile-agenda-heading">
        <div className="flex items-center justify-between">
          <h3
            id="mobile-agenda-heading"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--section-heading-size)',
              fontWeight: 'var(--section-heading-weight)',
            }}
            className="text-foreground"
          >
            {t('mobile.recentRequests')}
          </h3>
          <span className="text-[var(--text-xs)] font-medium text-muted-foreground">
            {t('dashboard.timesheet', 'Timesheet')}
          </span>
        </div>
        <div className="space-y-2">
          {activeHistoryData.filter(item => item.status === 'pending' || item.status === 'approved').slice(0, 2).map((item) => (
            <div
              key={`agenda-${item.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs hover:shadow-xs transition-all"
            >
              <div className="min-w-0 flex-1 space-y-1 text-start">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[var(--text-sm)] font-semibold text-foreground break-words">
                    {item.labelOverride ?? item.type}
                  </span>
                  <StatusBadge
                    variant={
                      item.status === 'approved'
                        ? 'approved'
                        : item.status === 'pending'
                        ? 'pending'
                        : 'noshow'
                    }
                    className="shrink-0 text-[11px] py-0 px-2 min-w-0"
                  >
                    {t(`status.${item.status}`, item.status)}
                  </StatusBadge>
                </div>
                <p className="text-[var(--text-xs)] text-muted-foreground break-words">
                  {item.range} • {item.duration}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-11 w-11 p-0 text-muted-foreground hover:text-foreground shrink-0 rounded-full"
                onClick={() => handleViewRequest(item)}
                aria-label={`View ${item.type} details`}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* History Table */}
      <section className="space-y-4" aria-labelledby="history-heading">
        <h3
          id="history-heading"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--section-heading-size)',
            fontWeight: 'var(--section-heading-weight)',
          }}
          className="text-foreground"
        >
          {t('dashboard.historyTitle', 'Leaves and Mission History')}
        </h3>

        {/* Print-Only Official Document Header */}
        <div className="print-header print-only">
          <div>
            <h1 className="text-xl font-bold">{isArabic ? 'نظام الموارد البشرية - سجل الإجازات والمأموريات' : 'HR Portal - Leave & Mission History Report'}</h1>
            <p className="text-xs text-muted-foreground mt-1">
              {isArabic ? `إجمالي السجلات: ${filteredHistory.length}` : `Total Filtered Records: ${filteredHistory.length}`}
            </p>
          </div>
          <div className="text-end text-xs text-muted-foreground">
            <div>{isArabic ? 'تاريخ الاستخراج:' : 'Generated On:'} {new Date().toLocaleDateString()}</div>
            <div>{isArabic ? 'المرجع الرسمي لإدارة الموارد البشرية' : 'Official HR Verification Record'}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4.5 bg-card/70 backdrop-blur-md rounded-2xl border border-border/80 shadow-2xs xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col sm:flex-row gap-2.5 w-full xl:w-auto">
            <Button
              variant="outline"
              onClick={handleDownloadHistory}
              className="w-full sm:w-auto gap-2 cursor-pointer justify-center shrink-0 no-print rounded-xl active:scale-[0.98]"
            >
              <Download className="w-4 h-4" /> {t('dashboard.downloadData', 'Download Data')}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="w-full sm:w-auto gap-2 cursor-pointer justify-center shrink-0 no-print rounded-xl active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" /> {isArabic ? 'طباعة التقرير' : 'Print Report'}
            </Button>
          </div>

          {/* Filters for mobile/tablet (Drawer on mobile, Popover on tablet) and desktop (inline) */}
          <div className="flex flex-wrap items-center justify-center xl:justify-end gap-3 pt-2 xl:pt-0 w-full xl:w-auto">
            {/* Mobile Bottom-Sheet Drawer (< md) */}
            <div className="md:hidden w-full">
              <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 cursor-pointer justify-center rounded-xl">
                    <Filter className="w-4 h-4" /> {t('dashboard.filterHistory', 'Filter History')}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="p-4 space-y-4 max-h-[85vh]">
                  <DrawerHeader className="p-0 text-start">
                    <DrawerTitle>{t('dashboard.filterHistory', 'Filter History')}</DrawerTitle>
                    <DrawerDescription className="text-xs text-muted-foreground">
                      {isArabic ? 'تصفية سجل الإجازات والمأموريات حسب النوع والتاريخ' : 'Filter your leave and mission records by type and date.'}
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-[var(--font-weight-medium)]" htmlFor="drawer-history-leave-type">{t('dashboard.leaveType', 'Leave Type')}</label>
                      <Select
                        value={historyLeaveType}
                        onValueChange={setHistoryLeaveType}
                      >
                        <SelectTrigger id="drawer-history-leave-type" aria-label={t('dashboard.leaveType', 'Filter by Leave Type')} className="min-h-[44px] w-full rounded-xl">
                          <SelectValue placeholder={t('dashboard.selectType', 'Select type')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{isArabic ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                          <SelectItem value="vacation">{t('dashboard.vacation', 'Vacation')}</SelectItem>
                          <SelectItem value="sick">{t('dashboard.sick', 'Sick')}</SelectItem>
                          <SelectItem value="annual">{t('dashboard.annual', 'Annual Leave')}</SelectItem>
                          <SelectItem value="maternity">{t('dashboard.maternity', 'Maternity')}</SelectItem>
                          <SelectItem value="paternity">{t('dashboard.paternity', 'Paternity')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-[var(--font-weight-medium)]" htmlFor="drawer-history-start-date">{t('dashboard.startDate', 'Start Date')}</label>
                      <DatePicker id="drawer-history-start-date" value={historyStartDate} onChange={setHistoryStartDate} placeholder="Start date" aria-label="History start date" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-[var(--font-weight-medium)]" htmlFor="drawer-history-end-date">{t('dashboard.endDate', 'End Date')}</label>
                      <DatePicker id="drawer-history-end-date" value={historyEndDate} onChange={setHistoryEndDate} placeholder="End date" aria-label="History end date" />
                    </div>
                  </div>
                  <DrawerFooter className="p-0 pt-2">
                    <Button onClick={() => setIsFilterDrawerOpen(false)} className="w-full rounded-xl">
                      {isArabic ? 'تطبيق الفلتر' : 'Apply Filters'}
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>

            {/* Tablet Popover Filter (md to xl) */}
            <div className="hidden md:block xl:hidden w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 cursor-pointer justify-center rounded-xl">
                    <Filter className="w-4 h-4" /> {t('dashboard.filterHistory', 'Filter History')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-4 space-y-4 w-72">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-[var(--font-weight-medium)]" htmlFor="mobile-history-leave-type">{t('dashboard.leaveType', 'Leave Type')}</label>
                    <Select
                      value={historyLeaveType}
                      onValueChange={setHistoryLeaveType}
                    >
                      <SelectTrigger id="mobile-history-leave-type" aria-label={t('dashboard.leaveType', 'Filter by Leave Type')} className="min-h-[44px] w-full rounded-xl">
                        <SelectValue placeholder={t('dashboard.selectType', 'Select type')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{isArabic ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                        <SelectItem value="vacation">{t('dashboard.vacation', 'Vacation')}</SelectItem>
                        <SelectItem value="sick">{t('dashboard.sick', 'Sick')}</SelectItem>
                        <SelectItem value="annual">{t('dashboard.annual', 'Annual Leave')}</SelectItem>
                        <SelectItem value="maternity">{t('dashboard.maternity', 'Maternity')}</SelectItem>
                        <SelectItem value="paternity">{t('dashboard.paternity', 'Paternity')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-[var(--font-weight-medium)]" htmlFor="mobile-history-start-date">{t('dashboard.startDate', 'Start Date')}</label>
                    <DatePicker id="mobile-history-start-date" value={historyStartDate} onChange={setHistoryStartDate} placeholder="Start date" aria-label="History start date" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-[var(--font-weight-medium)]" htmlFor="mobile-history-end-date">{t('dashboard.endDate', 'End Date')}</label>
                    <DatePicker id="mobile-history-end-date" value={historyEndDate} onChange={setHistoryEndDate} placeholder="End date" aria-label="History end date" />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Desktop Inline Filters */}
            <div className="hidden xl:flex items-center gap-3 flex-wrap">
              <div className="space-y-1">
                <label className="block text-[10px] text-muted-foreground font-[var(--font-weight-medium)]" htmlFor="desktop-history-leave-type">{t('dashboard.leaveType', 'Leave Type')}</label>
                  <Select
                    value={historyLeaveType}
                    onValueChange={setHistoryLeaveType}
                  >
                    <SelectTrigger id="desktop-history-leave-type" aria-label={t('dashboard.leaveType', 'Filter by Leave Type')} className="min-h-[44px] w-44 rounded-xl">
                      <SelectValue placeholder={t('dashboard.selectType', 'Select type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{isArabic ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                      <SelectItem value="vacation">{t('dashboard.vacation', 'Vacation')}</SelectItem>
                      <SelectItem value="sick">{t('dashboard.sick', 'Sick')}</SelectItem>
                      <SelectItem value="annual">{t('dashboard.annual', 'Annual Leave')}</SelectItem>
                      <SelectItem value="maternity">{t('dashboard.maternity', 'Maternity')}</SelectItem>
                      <SelectItem value="paternity">{t('dashboard.paternity', 'Paternity')}</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-muted-foreground font-[var(--font-weight-medium)]" htmlFor="desktop-history-start-date">{t('dashboard.startDate', 'Start Date')}</label>
                <DatePicker id="desktop-history-start-date" value={historyStartDate} onChange={setHistoryStartDate} placeholder="Start date" aria-label="History start date" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-muted-foreground font-[var(--font-weight-medium)]" htmlFor="desktop-history-end-date">{t('dashboard.endDate', 'End Date')}</label>
                <DatePicker id="desktop-history-end-date" value={historyEndDate} onChange={setHistoryEndDate} placeholder="End date" aria-label="History end date" />
              </div>
            </div>
          </div>
        </div>

        {/* Screen Reader Dynamic Filter Result Live Region */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {isArabic
            ? `عرض ${filteredHistory.length} نتيجة في سجل الإجازات والمأموريات`
            : `Showing ${filteredHistory.length} records in history`}
        </div>

        <div className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
          <ul data-slot="history-cards" className="divide-y divide-border md:hidden">
            {paginatedHistory.map(item => <li key={item.id} className="p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-semibold">{item.type}</h4><StatusBadge variant={requestStatus(item.status)}>{t('status.' + requestStatus(item.status), item.status)}</StatusBadge></div>
              <p className="text-sm break-words">{item.range} · {item.duration}</p>
              <div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" className="gap-2" onClick={() => handleViewRequest(item)}><Eye className="h-4 w-4" aria-hidden="true" />{t('mobile.viewDetails')}</Button>
                {item.canEdit && <Button variant="ghost" size="sm" onClick={() => handleEditRequest(item.id)}>{t('mobile.edit')}</Button>}
              </div>
            </li>)}
            {paginatedHistory.length === 0 && <li className="p-6 text-sm text-muted-foreground">{t('mobile.noMatchingRequests')}</li>}
          </ul>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[760px] text-[var(--text-sm)] text-start">
              <caption className="sr-only">{t('dashboard.historyTitle', 'Leaves and mission history requests')}</caption>
              <thead className="bg-muted/50 border-b border-border/80">
                <tr>
                  {[
                    t('dashboard.leaveType', 'Leave Type'),
                    t('dashboard.requestDate', 'Request Date'),
                    t('dashboard.dateRange', 'Date Range'),
                    t('dashboard.duration', 'Duration'),
                    t('dashboard.notes', 'Notes'),
                    t('dashboard.status', 'Status'),
                    t('dashboard.actions', 'Actions'),
                  ].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className={cn(
                        'whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-start',
                        header === t('dashboard.actions', 'Actions') && 'text-end'
                      )}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedHistory.map((item) => (
                  <HistoryRow
                    key={item.id}
                    item={item}
                    onView={() => handleViewRequest(item)}
                    onCancel={() => handleCancelRequest(item.id)}
                    onEdit={() => handleEditRequest(item.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="no-print">
            <Pagination
              currentPage={historyPage}
              totalPages={historyTotalPages}
              itemsPerPage={historyPerPage}
              onPageChange={setHistoryPage}
              onItemsPerPageChange={(n) => { setHistoryPerPage(n); setHistoryPage(1); }}
              totalItems={filteredHistory.length}
            />
          </div>
        </div>

        {/* Print-Only Signature & Approval Block */}
        <div className="print-footer print-only">
          <div className="print-signature-box">
            <div className="print-signature-line"></div>
            <span className="text-xs font-medium">{isArabic ? 'توقيع الموظف' : 'Employee Signature'}</span>
          </div>
          <div className="print-signature-box">
            <div className="print-signature-line"></div>
            <span className="text-xs font-medium">{isArabic ? 'اعتماد المدير المباشر' : 'Direct Supervisor Approval'}</span>
          </div>
          <div className="print-signature-box">
            <div className="print-signature-line"></div>
            <span className="text-xs font-medium">{isArabic ? 'اعتماد الموارد البشرية' : 'HR Director Clearance'}</span>
          </div>
        </div>
      </section>

      {/* Balance Tables */}
      <div className="grid grid-cols-1 gap-8">
        <section className="space-y-4" aria-labelledby="annual-sick-leaves-heading">
          <h3
            id="annual-sick-leaves-heading"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--section-heading-size)',
              fontWeight: 'var(--section-heading-weight)',
            }}
            className="text-foreground"
          >
            {t('dashboard.balancesTitle')}
          </h3>
          <div role="region" aria-labelledby="annual-sick-leaves-heading" tabIndex={0} className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
              <caption className="sr-only">{t('dashboard.balancesTitle')}</caption>
              <thead className="bg-muted/50 border-b border-border/80">
                <tr>
                  {[
                    t('dashboard.leaveType'),
                    t('dashboard.totalBalance'),
                    t('dashboard.bridge'),
                    t('dashboard.fromLastYear'),
                    t('dashboard.usedBalance'),
                    t('dashboard.remainingBalance'),
                  ].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-start"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr className="even:bg-muted/[0.15] hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08] transition-colors duration-150">
                  <th scope="row" className="px-4 py-3.5 text-foreground font-semibold text-start">{t('leave.annualLeave')}</th>
                  <td className="px-4 py-3.5 text-foreground tabular-nums font-medium">{calculateAnnualEntitlement(2013)} {t('dashboard.days')}</td>
                  <td className="px-4 py-3.5 text-foreground tabular-nums">5</td>
                  <td className="px-4 py-3.5 text-foreground tabular-nums">4</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25 tabular-nums">6</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 tabular-nums">
                      {calculateAnnualEntitlement(2013) - 5 + 4 - 6} {t('dashboard.days')}
                    </span>
                  </td>
                </tr>
                <tr className="even:bg-muted/[0.15] hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08] transition-colors duration-150">
                  <th scope="row" className="px-4 py-3.5 text-foreground font-semibold text-start">{t('leave.sickLeave')}</th>
                  <td className="px-4 py-3.5 text-foreground tabular-nums font-medium">45 {t('dashboard.days')}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">--</td>
                  <td className="px-4 py-3.5 text-muted-foreground">--</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25 tabular-nums">5</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 tabular-nums">40 days</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/20 backdrop-blur-xs">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p className="text-[var(--text-sm)] font-[var(--font-weight-normal)] text-foreground">
              {isArabic ? 'يرجى التأكد من استخدام جميع أيام الاجازة المرحلة من العام الماضي قبل' : 'Please ensure all carried-over vacation days from last year are used before'}
              <strong style={{ fontWeight: 'var(--font-weight-semibold)' }} className="mx-1">
                {isArabic ? '31 مارس من هذا العام' : 'March 31st this year'}
              </strong>
              {"."}
              <br />
              {isArabic ? 'تُخصم الأيام المرحلة تلقائيًا قبل رصيد اجازات هذا العام.' : "Carried over days are deducted automatically before this year's vacation."}
            </p>
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="other-leaves-heading">
          <h3
            id="other-leaves-heading"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--section-heading-size)',
              fontWeight: 'var(--section-heading-weight)',
            }}
            className="text-foreground"
          >
            {isArabic ? 'اجازات أخرى' : 'Other Leaves'}
          </h3>
          <div role="region" aria-labelledby="other-leaves-heading" tabIndex={0} className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
              <caption className="sr-only">{isArabic ? 'أرصدة الاجازات الأخرى' : 'Other leave balances'}</caption>
              <thead className="bg-muted/50 border-b border-border/80">
                <tr>
                  {(isArabic ? ['نوع الاجازة', 'الرصيد'] : ['Leave Type', 'Balance']).map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-start"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  // Show Paternity for male user, Maternity for female user
                  {
                    type: isArabic ? 'اجازة أبوة' : 'Paternity Leave',
                    balance: isArabic ? '4 أسابيع (20 يوم عمل)' : '4 weeks (20 working days)',
                  },
                  {
                    type: isArabic ? 'رعاية الأسرة' : 'Family Care',
                    balance: isArabic ? 'أسبوعان (10 أيام عمل)' : '2 weeks (10 working days)',
                  },
                  {
                    type: isArabic ? 'الحج' : 'Hajj',
                    balance: isArabic ? '4 أسابيع (20 يوم عمل)' : '4 weeks (20 working days)',
                  },
                  {
                    type: isArabic ? 'زواج' : 'Marriage',
                    balance: isArabic ? 'أسبوع واحد (5 أيام عمل)' : '1 week (5 working days)',
                  },
                  {
                    type: isArabic ? 'وفاة قريب' : 'Bereavement',
                    balance: isArabic ? 'أسبوع واحد (5 أيام عمل)' : '1 week (5 working days)',
                  },
                  {
                    type: isArabic ? 'غير مدفوعة' : 'Unpaid',
                    balance: isArabic ? 'حسب الحالة / بدون حد أقصى' : 'Case-by-case / No limit',
                  },
                ].map((row) => (
                  <tr key={row.type} className="even:bg-muted/[0.15] hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08] transition-colors duration-150">
                    <th scope="row" className="px-4 py-3.5 font-semibold text-foreground text-start" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--text-sm)' }}>
                      {row.type}
                    </th>
                    <td className="px-4 py-3.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--text-sm)' }}>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted/60 text-foreground border border-border/70">
                        {row.balance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* === MODALS === */}

      {/* Leave Detail Modal */}
      <LeaveDetailModal
        open={leaveDetailOpen}
        onOpenChange={setLeaveDetailOpen}
        leaveData={selectedLeave}
        onEditRequest={handleEditRequest}
        onCancelRequest={handleCancelRequest}
      />

      {/* Edit Leave Modal */}
      <RequestLeaveModal
        open={editLeaveOpen}
        onOpenChange={setEditLeaveOpen}
        onSubmit={handleEditSubmit}
        initialData={editLeaveData}
        mode="edit"
      />

      {/* Confirm Cancellation Dialog */}
      <ConfirmDialog
        open={confirmCancelOpen}
        onOpenChange={setConfirmCancelOpen}
        title="Confirm Cancellation"
        message={
          <>
            Cancel sick leave request from{' '}
            <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              10 January 2023
            </strong>{' '}
            to{' '}
            <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              13 January 2023
            </strong>
            ?
          </>
        }
        confirmLabel="Cancel Request"
        cancelLabel="Discard"
        confirmVariant="destructive"
        onConfirm={handleConfirmCancel}
      />

      {/* Change Weekends Dialog */}
      <ConfirmDialog
        open={changeWeekendOpen}
        onOpenChange={(open) => {
          setChangeWeekendOpen(open);
          if (!open) handleWeekendDiscard();
        }}
        title="Change Weekends"
        message={
          <>
            You are switching your weekends from{' '}
            <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              {currentWeekend}
            </strong>{' '}
            to{' '}
            <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              {pendingWeekend}
            </strong>
            .
          </>
        }
        confirmLabel="Switch Weekends"
        cancelLabel="Discard"
        confirmVariant="default"
        onConfirm={handleConfirmWeekendChange}
        onCancel={handleWeekendDiscard}
      />

      {/* Choice Dialog for vacation vs mission */}
      <ConfirmDialog
        open={chooseRequestOpen}
        onOpenChange={setChooseRequestOpen}
        title={isArabic ? 'نوع الطلب جديد' : 'New Request Type'}
        noCard={true}
        showInfoIcon={true}
        infoTooltip={isArabic ? 'اختر نوع الطلب المناسب للمتابعة' : 'Select the type of request to proceed'}
        message={
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                className="w-full justify-between items-center text-foreground border border-border/80 bg-card/60 hover:bg-muted font-medium py-6 px-4 rounded-2xl hover:border-primary/50 transition-all group cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
                onClick={() => {
                  setChooseRequestOpen(false);
                  onRequestLeave({
                    leaveType: 'Annual Leave',
                    fromDate: chooseRequestDate,
                    toDate: chooseRequestDate,
                    notes: '',
                  });
                }}
              >
                <div className="flex items-center gap-3">
                  <Umbrella className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)]">
                    {isArabic ? 'طلب اجازة / عطلة' : 'Request Leave (Vacation)'}
                  </span>
                </div>
                {isArabic ? (
                  <ChevronLeft className="calendar-nav-icon w-4 h-4 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                ) : (
                  <ChevronRight className="calendar-nav-icon w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                )}
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-between items-center text-foreground border border-border/80 bg-card/60 hover:bg-muted font-medium py-6 px-4 rounded-2xl hover:border-primary/50 transition-all group cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
                onClick={() => {
                  setChooseRequestOpen(false);
                  onRequestMission({
                    missionType: 'Work From Home',
                    fromDate: chooseRequestDate,
                    toDate: chooseRequestDate,
                    notes: '',
                  });
                }}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)]">
                    {isArabic ? 'طلب مأمورية' : 'Request Mission (e.g. WFH)'}
                  </span>
                </div>
                {isArabic ? (
                  <ChevronLeft className="calendar-nav-icon w-4 h-4 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                ) : (
                  <ChevronRight className="calendar-nav-icon w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                )}
              </Button>
            </div>
          </div>
        }
        confirmLabel=""
        cancelLabel={isArabic ? 'إلغاء' : 'Cancel'}
        onConfirm={() => {}}
        onCancel={() => setChooseRequestOpen(false)}
      />
    </div>
  );
};

// --- History Row with Actions Dropdown ---
const HistoryRow: React.FC<{
  item: HistoryItem;
  onView: () => void;
  onCancel: () => void;
  onEdit: () => void;
}> = ({ item, onView, onCancel, onEdit }) => {
  const isMission = item.type.toLowerCase().includes('mission') || item.type.includes('مأمورية');

  return (
    <tr className="even:bg-muted/[0.15] hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08] transition-colors duration-150">
      <th
        scope="row"
        className="px-4 py-3.5 align-middle font-semibold text-foreground text-sm text-start"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              'flex size-7 items-center justify-center rounded-lg shrink-0 border shadow-2xs',
              isMission
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            )}
            aria-hidden="true"
          >
            {isMission ? <Briefcase className="size-3.5" /> : <Calendar className="size-3.5" />}
          </span>
          <span>{item.type}</span>
        </div>
      </th>
      <td className="px-4 py-3.5 align-middle whitespace-nowrap text-sm text-foreground tabular-nums font-mono" style={{ fontFamily: "'Inter', sans-serif" }}>
        {item.reqDate}
      </td>
      <td className="px-4 py-3.5 align-middle whitespace-nowrap text-sm text-foreground tabular-nums" style={{ fontFamily: "'Inter', sans-serif" }}>
        {item.range}
      </td>
      <td className="px-4 py-3.5 align-middle text-sm text-foreground tabular-nums font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
        {item.duration}
      </td>
      <td className="px-4 py-3.5 align-middle text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
        {item.notes}
      </td>
      <td className="px-4 py-3.5 align-middle text-sm">
        <div className="flex items-center gap-2">
          <StatusBadge
            variant={item.status as any}
            className={item.customColor}
          >
            {item.labelOverride ||
              item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </StatusBadge>
          {item.status === 'approved' && (
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle text-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex items-center justify-center size-9 rounded-xl border border-transparent hover:border-border/80 hover:bg-muted/80 active:scale-95 text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              aria-label={`Open actions for ${item.type} request from ${item.reqDate}`}
            >
              <MoreVertical className="w-4 h-4" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[13rem]">
            <DropdownMenuItem onClick={onView} className="cursor-pointer">
              <Eye className="w-4 h-4" />
              <span>View Request</span>
            </DropdownMenuItem>
            {item.canCancel && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onCancel}
                  className="cursor-pointer"
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Request</span>
                </DropdownMenuItem>
              </>
            )}
            {item.canEdit && (
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                <Pencil className="w-4 h-4" />
                <span>Edit Request</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};
