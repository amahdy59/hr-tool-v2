import React, { useState } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { StatusBadge } from './StatusBadge';
import { RequestLeaveModal, type LeaveFormData } from './RequestLeaveModal';
import { RequestMissionModal } from './RequestMissionModal';
import { LeaveDetailModal, type LeaveDetail } from './LeaveDetailModal';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from './ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format, parseISO, isValid } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { localizeFirstName } from '@/lib/localizedNames';

// --- Types ---
interface HistoryItem {
  id: string;
  type: string;
  reqDate: string;
  range: string;
  duration: string;
  notes: string;
  status: 'approved' | 'pending' | 'noshow';
  labelOverride?: string;
  customColor?: string;
  canEdit?: boolean;
  canCancel?: boolean;
}

// --- Mock Data ---
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
    status: 'noshow',
    labelOverride: 'Cancelled',
    customColor: 'bg-destructive',
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
  onRequestLeave: () => void;
  onRequestMission: () => void;
  currentUser?: { name: string; email: string; image?: string };
}

export const Dashboard: React.FC<DashboardProps> = ({ onRequestLeave, onRequestMission, currentUser }) => {
  const { i18n } = useTranslation();
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

  // Weekend state
  const [currentWeekend, setCurrentWeekend] = useState('Friday and Saturday');
  const [pendingWeekend, setPendingWeekend] = useState('');

  // History filter states
  const [historyLeaveType, setHistoryLeaveType] = useState('vacation');
  const [historyStartDate, setHistoryStartDate] = useState('2023-11-03');
  const [historyEndDate, setHistoryEndDate] = useState('2023-11-03');

  // --- Handlers ---

  const handleViewRequest = (item: { id: string; type: string; status: 'approved' | 'pending' | 'noshow'; range: string; duration: string }) => {
    let leaveStatus: 'requested' | 'hr' | 'complete' | 'cancelled' = 'hr';
    if (item.status === 'approved') leaveStatus = 'complete';
    else if (item.status === 'noshow') leaveStatus = 'cancelled';
    else if (item.status === 'pending') leaveStatus = 'requested';

    setSelectedLeave({
      ...mockLeaveDetail,
      id: item.id,
      type: item.type,
      dateRange: item.range,
      duration: item.duration,
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

  return (
    <div className="space-y-6 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6 sm:space-y-8 max-w-7xl mx-auto">

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--page-title-size)',
              fontWeight: 'var(--page-title-weight)',
            }}
            className="text-foreground"
          >
            Welcome {localizeFirstName(currentUser?.name || 'Ahmed', i18n.resolvedLanguage || i18n.language)}
          </h2>
        </div>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Button
            variant="outline"
            className="w-full sm:w-auto cursor-pointer"
            onClick={onRequestLeave}
          >
            Request Leave
          </Button>
          <Button
            className="w-full bg-chart-3 hover:bg-chart-3/90 text-white sm:w-auto cursor-pointer"
            onClick={onRequestMission}
          >
            Request Mission
          </Button>
        </div>
      </div>

      {/* Timesheet Section */}
      <section className="hidden space-y-4 min-[990px]:block">
        <h3
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--section-heading-size)',
            fontWeight: 'var(--section-heading-weight)',
          }}
          className="text-foreground"
        >
          Timesheet
        </h3>
        <CalendarGrid onViewRequest={handleViewRequest} />

        {/* Color Indicators Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            Color Indicators
          </span>
          <div className="flex items-center gap-4">
            {[
              { color: 'bg-chart-4', label: 'Pending' },
              { color: 'bg-chart-5', label: 'No Show' },
              { color: 'bg-chart-3', label: 'Approved' },
              { color: 'bg-chart-1', label: 'In-office' },
              { color: 'bg-muted', label: 'Weekend' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={cn('w-8 h-4 rounded-sm', item.color)} />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Table */}
      <section className="space-y-4">
        <h3
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--section-heading-size)',
            fontWeight: 'var(--section-heading-weight)',
          }}
          className="text-foreground"
        >
          Leaves and Mission History
        </h3>

        <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-[var(--radius)] xl:flex-row xl:items-end xl:justify-between">
          <Button variant="outline" className="w-full xl:w-auto gap-2 cursor-pointer justify-center shrink-0">
            <Download className="w-4 h-4" /> Download Data
          </Button>

          {/* Filters for mobile/tablet (Popover) and desktop (inline) */}
          <div className="flex flex-wrap items-center justify-center xl:justify-end gap-3 pt-2 w-full">
            {/* Mobile/Tablet Popover Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="xl:hidden w-full gap-2 cursor-pointer justify-center">
                  <Filter className="w-4 h-4" /> Filter History
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-4 space-y-4 w-72">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-[var(--font-weight-medium)]">Leave Type</label>
                  <Select value={historyLeaveType} onValueChange={setHistoryLeaveType}>
                    <SelectTrigger className="h-10 w-full rounded-[var(--radius-input)] bg-card border-border">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="sick">Sick</SelectItem>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="maternity">Maternity</SelectItem>
                      <SelectItem value="paternity">Paternity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-[var(--font-weight-medium)]">Start Date</label>
                  <DatePicker value={historyStartDate} onChange={setHistoryStartDate} placeholder="Start date" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-[var(--font-weight-medium)]">End Date</label>
                  <DatePicker value={historyEndDate} onChange={setHistoryEndDate} placeholder="End date" />
                </div>
              </PopoverContent>
            </Popover>

            {/* Desktop Inline Filters */}
            <div className="hidden xl:flex items-center gap-3 flex-wrap">
              <div className="space-y-1">
                <label className="block text-[10px] text-muted-foreground font-[var(--font-weight-medium)]">Leave Type</label>
                <Select value={historyLeaveType} onValueChange={setHistoryLeaveType}>
                  <SelectTrigger className="h-10 w-44 rounded-[var(--radius-input)] bg-card border-border">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="sick">Sick</SelectItem>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="maternity">Maternity</SelectItem>
                    <SelectItem value="paternity">Paternity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-muted-foreground font-[var(--font-weight-medium)]">Start Date</label>
                <DatePicker value={historyStartDate} onChange={setHistoryStartDate} placeholder="Start date" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-muted-foreground font-[var(--font-weight-medium)]">End Date</label>
                <DatePicker value={historyEndDate} onChange={setHistoryEndDate} placeholder="End date" />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-[var(--radius)] overflow-x-auto bg-card shadow-[var(--elevation-sm)]">
          <table className="w-full min-w-[760px] text-[var(--text-sm)] text-start">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {[
                  'Leave Type',
                  'Request Date',
                  'Date Range',
                  'Duration',
                  'Notes',
                  'Status',
                  'Actions',
                ].map((header) => (
                  <th
                    key={header}
                    className={cn(
                      'px-4 py-3',
                      header === 'Actions' && 'text-end'
                    )}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {historyData.map((item) => (
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

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-4 py-4 border-t border-border bg-muted/20">
          <div className="flex items-center gap-3 text-[var(--text-sm)] text-muted-foreground w-full sm:w-auto justify-center sm:justify-start whitespace-nowrap shrink-0">
            <span>Items Per Page</span>
            <select className="h-11 px-3 border border-border rounded-[var(--radius-input)] bg-card text-foreground outline-none cursor-pointer">
              <option>15</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex flex-row items-center justify-center sm:justify-end gap-2 pt-2 w-full">
            <button className="w-11 h-11 flex items-center justify-center border border-border rounded-[var(--radius-sm)] bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm" disabled>
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <span className="text-[var(--text-sm)] text-foreground flex items-center gap-2 whitespace-nowrap">
              Page <input type="text" value="1" readOnly className="w-12 h-11 text-center border border-border rounded-[var(--radius-input)] bg-input-background text-foreground shadow-sm" /> of 150
            </span>
            <button className="w-11 h-11 flex items-center justify-center border border-border rounded-[var(--radius-sm)] bg-card hover:bg-muted transition-colors shadow-sm">
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Balance Tables */}
      <div className="grid grid-cols-1 gap-8">
        <section className="space-y-4">
          <h3
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--section-heading-size)',
              fontWeight: 'var(--section-heading-weight)',
            }}
            className="text-foreground"
          >
            Annual and Sick Leaves
          </h3>
          <div className="border border-border rounded-[var(--radius)] overflow-x-auto">
            <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {[
                    'Leave Type',
                    'Total Balance',
                    'Bridge',
                    'From Last Year',
                    'Used Balance',
                    'Remaining Balance',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-[var(--text-sm)]">Annual Leave</td>
                  <td className="px-4 py-3 text-[var(--text-sm)]">21 days</td>
                  <td className="px-4 py-3 text-[var(--text-sm)]">5</td>
                  <td className="px-4 py-3 text-[var(--text-sm)]">4</td>
                  <td className="px-4 py-3 text-[var(--text-sm)]">6</td>
                  <td className="px-4 py-3 text-[var(--text-sm)]">14</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-[var(--text-sm)]">Sick Leave</td>
                  <td className="px-4 py-3 text-[var(--text-sm)]">45 days</td>
                  <td className="px-4 py-3 text-[var(--text-sm)]">--</td>
                  <td className="px-4 py-3 text-[var(--text-sm)]">--</td>
                  <td className="px-4 py-3 text-[var(--text-sm)]">5</td>
                  <td className="px-4 py-3 text-[var(--text-sm)]">40</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 p-4 bg-primary/5 rounded-[var(--radius)] border border-primary/15">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p className="text-[var(--text-sm)] font-[var(--font-weight-normal)] text-foreground">
              {"Please ensure all carried-over vacation days from last year are used before "}
              <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                {"March 31st this year"}
              </strong>
              {". "}
              <br />
              {"Carried over days are deducted automatically before this year's vacation."}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--section-heading-size)',
              fontWeight: 'var(--section-heading-weight)',
            }}
            className="text-foreground"
          >
            Other Leaves
          </h3>
          <div className="border border-border rounded-[var(--radius)] overflow-x-auto">
            <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {['Leave Type', 'Balance'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { type: 'Maternity (appears only to females)', balance: '5 months' },
                  { type: 'Paternity (appears only to males)', balance: '2 weeks' },
                  { type: 'Family Care', balance: '2 weeks' },
                  { type: 'Hajj', balance: '4 weeks' },
                  { type: 'Marriage', balance: '1 week' },
                  { type: 'Bereavement', balance: '1 week' },
                  { type: 'Unpaid', balance: '7 days' },
                ].map((row) => (
                  <tr key={row.type}>
                    <td className="px-4 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--text-sm)' }}>
                      {row.type}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      {row.balance}
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
        confirmClassName="bg-chart-3 hover:bg-chart-3/90 text-white"
        onConfirm={handleConfirmWeekendChange}
        onCancel={handleWeekendDiscard}
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
  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--text-sm)' }}>
        {item.type}
      </td>
      <td className="px-4 py-3 whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--text-sm)' }}>
        {item.reqDate}
      </td>
      <td className="px-4 py-3 whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--text-sm)' }}>
        {item.range}
      </td>
      <td className="px-4 py-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--text-sm)' }}>
        {item.duration}
      </td>
      <td className="px-4 py-3 text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--text-sm)' }}>
        {item.notes}
      </td>
      <td className="px-4 py-3">
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
      <td className="px-4 py-3 text-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-muted rounded-[var(--radius)]">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onView} className="cursor-pointer">
              <Eye className="w-4 h-4 me-2" />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                }}
              >
                View Request
              </span>
            </DropdownMenuItem>
            {item.canCancel && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onCancel}
                  className="cursor-pointer"
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 me-2" />
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-normal)',
                    }}
                  >
                    Cancel Request
                  </span>
                </DropdownMenuItem>
              </>
            )}
            {item.canEdit && (
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                <Pencil className="w-4 h-4 me-2" />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                >
                  Edit Request
                </span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};
