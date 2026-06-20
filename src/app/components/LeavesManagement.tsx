import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical, Download, Plus, Search, Filter,
  Info, Edit, Trash2, Eye, ChevronLeft, ChevronRight, X, Check, FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { DatePicker } from './ui/date-picker';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from './ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from './ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Checkbox } from './ui/checkbox';
import { StatusBadge } from './StatusBadge';
import { toast } from 'sonner';
import { EmptyState } from './EmptyState';
import { exportToCSV } from '../../lib/export';

// ── Shared styles ──
const inputClass = 'w-full h-10 px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const labelClass = 'text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground';
const thClass = 'px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-[var(--text-sm)]';

// ── Types ──
interface LeaveRequest {
  id: string;
  name: string;
  img: string;
  type: string;
  range: string;
  duration: string;
  notes: string;
  status?: string;
  employeeNumber?: string;
}

interface Holiday {
  id: string;
  type: 'Bridge' | 'Holiday';
  name: string;
  range: string;
  duration: string;
  notes: string;
}

// ── Mock Data ──
const PENDING_LEAVES: LeaveRequest[] = [
  { id: '1', name: 'Sara Abdallah', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', type: 'Sick', range: 'Sep 10 - Sep 14', duration: '5 days', notes: 'Fever and flu', employeeNumber: '49201' },
  { id: '2', name: 'Vinay Ansari', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', type: 'Vacation', range: 'Oct 5 - Oct 12', duration: '8 days', notes: 'Annual leave', employeeNumber: '31245' },
  { id: '3', name: 'Sara Kasongo', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop', type: 'Sick', range: 'Nov 3 - Nov 6', duration: '4 days', notes: 'Stomachache', employeeNumber: '20124' },
  { id: '4', name: 'María Fernanda', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', type: 'Vacation', range: 'Dec 20 - Jan 2', duration: '14 days', notes: 'Holiday travel', employeeNumber: '55102' },
  { id: '5', name: 'Luka Silva', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', type: 'Vacation', range: 'Jan 15 - Jan 17', duration: '3 days', notes: 'Cold symptoms', employeeNumber: '12098' },
];

const HISTORY_LEAVES: LeaveRequest[] = [
  { id: '1', name: 'Sara Abdallah', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', type: 'Sick', range: 'Sep 10 - Sep 14', duration: '5 days', notes: 'Fever and flu', status: 'approved' },
  { id: '2', name: 'Priyanka Ram', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', type: 'Vacation', range: 'Oct 5 - Oct 12', duration: '8 days', notes: 'Annual leave', status: 'approved' },
  { id: '3', name: 'Natalia Díaz', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop', type: 'Sick', range: 'Nov 3 - Nov 6', duration: '4 days', notes: 'Stomachache', status: 'approved' },
  { id: '4', name: 'Jay Gupta', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', type: 'Vacation', range: 'Dec 20 - Jan 2', duration: '14 days', notes: 'Holiday travel', status: 'rejected' },
  { id: '5', name: 'Charles Brown', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', type: 'Vacation', range: 'Jan 15 - Jan 17', duration: '3 days', notes: 'Cold symptoms', status: 'rejected' },
];

const HOLIDAYS: Holiday[] = [
  { id: '1', type: 'Bridge', name: 'National Day Bridge', range: 'Sep 10 - Sep 14', duration: '5 days', notes: 'Extended weekend following National Day' },
  { id: '2', type: 'Holiday', name: 'Eid Al-Fitr', range: 'Oct 5 - Oct 12', duration: '8 days', notes: 'End of Ramadan celebration' },
  { id: '3', type: 'Bridge', name: 'New Year Bridge', range: 'Nov 3 - Nov 6', duration: '4 days', notes: 'Bridge between holidays' },
  { id: '4', type: 'Holiday', name: 'Christmas', range: 'Dec 20 - Jan 2', duration: '14 days', notes: 'End of year holidays' },
  { id: '5', type: 'Holiday', name: 'Spring Day', range: 'Jan 15 - Jan 17', duration: '3 days', notes: 'Spring celebration' },
];

const DEPARTMENTS = ['All', 'Marketing', 'Software', 'Oil & Gas', 'Sales', 'SCADA', 'IT', 'Finance', 'HR'];
const LEAVE_TYPES = ['All', 'Sick', 'Vacation', 'Maternity', 'Paternity', 'Family Care', 'Hajj', 'Marriage', 'Bereavement', 'Unpaid'];
const ACTIVITY_TYPES = ['My team', 'Lead Engineer', 'Application Consultant', 'Project Manager'];
const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contractor', 'Intern'];

export const LeavesManagement: React.FC = () => {
  // Pending
  const [pendingSearch, setPendingSearch] = useState('');
  const [selectedPending, setSelectedPending] = useState<string[]>([]);
  const [pendingPage, setPendingPage] = useState(1);

  // Holiday
  const [holidayMonth, setHolidayMonth] = useState('All');
  const [holidayYear, setHolidayYear] = useState('2026');
  const [holidayPage, setHolidayPage] = useState(1);

  // History
  const [historySearch, setHistorySearch] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [filterLeaveType, setFilterLeaveType] = useState('All');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [filterActivityTypes, setFilterActivityTypes] = useState<string[]>([]);
  const [filterEmploymentTypes, setFilterEmploymentTypes] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState(0);

  // Modals
  const [createLeaveOpen, setCreateLeaveOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [confirmApprovalOpen, setConfirmApprovalOpen] = useState(false);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [viewProfileData, setViewProfileData] = useState<LeaveRequest | null>(null);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineData, setDeclineData] = useState<LeaveRequest | null>(null);
  const [addHolidayOpen, setAddHolidayOpen] = useState(false);
  const [editHolidayOpen, setEditHolidayOpen] = useState(false);
  const [editHolidayData, setEditHolidayData] = useState<Holiday | null>(null);
  const [deleteHolidayOpen, setDeleteHolidayOpen] = useState(false);
  const [deleteHolidayData, setDeleteHolidayData] = useState<Holiday | null>(null);

  const approveButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedPending.length > 1 && approveButtonRef.current) {
      approveButtonRef.current.focus();
    }
  }, [selectedPending.length]);

  const togglePending = (id: string) => setSelectedPending(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAllPending = () => setSelectedPending(p => p.length === PENDING_LEAVES.length ? [] : PENDING_LEAVES.map(l => l.id));

  const applyFilters = () => {
    let c = 0;
    if (filterDept !== 'All') c++;
    if (filterLeaveType !== 'All') c++;
    if (filterFrom) c++;
    if (filterTo) c++;
    if (filterActivityTypes.length) c++;
    if (filterEmploymentTypes.length) c++;
    setActiveFilters(c);
    setFilterOpen(false);
    toast.success('Filters applied', { description: `${c} filter${c !== 1 ? 's' : ''} active` });
  };

  const clearFilters = () => {
    setFilterDept('All'); setFilterLeaveType('All'); setFilterFrom(''); setFilterTo('');
    setFilterActivityTypes([]); setFilterEmploymentTypes([]);
    setActiveFilters(0);
    toast.info('Filters cleared');
  };

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* ══ Pending Approval ══ */}
      <section className="space-y-6">
        <div>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--page-title-size)', fontWeight: 'var(--page-title-weight)' }} className="text-foreground">Leaves Pending Approval</h2>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1 max-w-md space-y-1.5">
            <div className="flex items-center gap-2">
              <label className={labelClass}>Search Employee</label>
              <Tooltip><TooltipTrigger asChild><button className="cursor-pointer"><Info className="w-4 h-4 text-primary" /></button></TooltipTrigger><TooltipContent side="top" className="text-[var(--text-xs)]"><p>Search by name or Employee number</p></TooltipContent></Tooltip>
            </div>
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={pendingSearch} onChange={e => setPendingSearch(e.target.value)} placeholder="Search by name or Employee#..." className={cn(inputClass, 'ps-10')} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              ref={approveButtonRef}
              variant={selectedPending.length > 0 ? "default" : "outline"} 
              size="sm" 
              className="w-full sm:w-auto gap-2 rounded-[var(--radius-button)] cursor-pointer justify-center transition-all" 
              onClick={() => { if (!selectedPending.length) { toast.error('Select at least one request'); return; } setReviewOpen(true); }}
            >
              {selectedPending.length > 1 ? 'Approve Leaves' : 'Approve Leave'}
            </Button>
            <Button size="sm" className="w-full sm:w-auto gap-2 rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white cursor-pointer justify-center" onClick={() => setCreateLeaveOpen(true)}>
              <Plus className="w-4 h-4" /> Create Leave
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
          <div className="overflow-x-auto">
            {PENDING_LEAVES.length === 0 ? (
              <EmptyState 
                icon={FileText} 
                title="No Pending Requests" 
                description="There are currently no pending leave requests to review." 
                className="py-16"
              />
            ) : (
              <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-muted border-b border-border">
                    <th className={cn(thClass, 'w-10')}><Checkbox checked={selectedPending.length === PENDING_LEAVES.length && PENDING_LEAVES.length > 0} onCheckedChange={toggleAllPending} /></th>
                    <th className={thClass}>Employee Name</th>
                    <th className={thClass}>Leave Type</th>
                    <th className={thClass}>Date Range</th>
                    <th className={thClass}>Duration</th>
                    <th className={thClass}>Notes</th>
                    <th className={cn(thClass, 'text-end')}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PENDING_LEAVES.map(leave => (
                    <tr key={leave.id} className="hover:bg-muted/30 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-b-0">
                      <td className="px-4 py-3 hidden md:table-cell"><Checkbox checked={selectedPending.includes(leave.id)} onCheckedChange={() => togglePending(leave.id)} /></td>
                      <td className="px-4 py-1 md:py-3 font-semibold md:font-normal">
                        <div className="flex items-center gap-2">
                          <Checkbox className="md:hidden" checked={selectedPending.includes(leave.id)} onCheckedChange={() => togglePending(leave.id)} />
                          <span className="text-primary font-[var(--font-weight-medium)] hover:underline cursor-pointer">{leave.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Type:</span>{leave.type}</td>
                      <td className="px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Dates:</span>{leave.range}</td>
                      <td className="px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Duration:</span>{leave.duration}</td>
                      <td className="px-4 py-1 md:py-3 text-muted-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Notes:</span>{leave.notes}</td>
                      <td className="px-4 py-3 md:text-end mt-2 md:mt-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="md:w-auto w-full justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer md:bg-transparent md:border-0 md:p-1.5 md:hover:bg-muted"><span className="md:hidden">Actions</span><MoreVertical className="hidden md:block w-4 h-4 text-muted-foreground" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setViewProfileData(leave); setViewProfileOpen(true); }}><Eye className="w-4 h-4" /> View Leave</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setSelectedPending([leave.id]); setReviewOpen(true); }}><Check className="w-4 h-4" /> Approve Leave</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" className="cursor-pointer gap-2" onClick={() => { setDeclineData(leave); setDeclineOpen(true); }}><X className="w-4 h-4" /> Decline Leave</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <TablePagination page={pendingPage} setPage={setPendingPage} totalPages={3} />
        </div>
      </section>

      {/* ══ Holidays & Bridges ══ */}
      <section className="space-y-6">
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Holidays and Bridges</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-[var(--radius-button)] border-border cursor-pointer flex items-center justify-center" aria-label="Filter Dates" title="Filter Dates">
                  <Filter className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-4 space-y-4 w-56">
                <div className="space-y-1.5">
                  <label className={labelClass}>Month</label>
                  <Select value={holidayMonth} onValueChange={setHolidayMonth}>
                    <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border bg-card"><SelectValue /></SelectTrigger>
                    <SelectContent>{['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Year</label>
                  <Select value={holidayYear} onValueChange={setHolidayYear}>
                    <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border bg-card"><SelectValue /></SelectTrigger>
                    <SelectContent>{['2024', '2025', '2026'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
            <span className="text-[var(--text-xs)] text-muted-foreground font-[var(--font-weight-medium)]">
              Filter: {holidayMonth} {holidayYear}
            </span>
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2 rounded-[var(--radius-button)] border-border cursor-pointer justify-center" onClick={() => setAddHolidayOpen(true)}>
            Assign Holiday / Bridge
          </Button>
        </div>

        <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-[var(--text-sm)] text-start">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className={thClass}>Leave Type</th>
                  <th className={thClass}>Date Range</th>
                  <th className={thClass}>Duration</th>
                  <th className={thClass}>Notes</th>
                  <th className={cn(thClass, 'text-end')}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {HOLIDAYS.map(h => (
                  <tr key={h.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground font-[var(--font-weight-medium)]">{h.type}</td>
                    <td className="px-4 py-3 text-foreground">{h.range}</td>
                    <td className="px-4 py-3 text-foreground">{h.duration}</td>
                    <td className="px-4 py-3 text-muted-foreground">{h.notes}</td>
                    <td className="px-4 py-3 text-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><button className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setEditHolidayData(h); setEditHolidayOpen(true); }}><Edit className="w-4 h-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" className="cursor-pointer gap-2" onClick={() => { setDeleteHolidayData(h); setDeleteHolidayOpen(true); }}><Trash2 className="w-4 h-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination page={holidayPage} setPage={setHolidayPage} totalPages={1} />
        </div>
      </section>

      {/* ══ Leaves History ══ */}
      <section className="space-y-6">
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Leaves History</h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1 max-w-md space-y-1.5">
            <label className={labelClass}>Search Employee</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={historySearch} onChange={e => setHistorySearch(e.target.value)} placeholder="Search by name or Employee#..." className={cn(inputClass, 'ps-10')} />
              </div>
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <button className={cn('relative h-10 px-3 border rounded-[var(--radius-input)] bg-card hover:bg-muted transition-colors cursor-pointer flex items-center', activeFilters > 0 ? 'border-primary text-primary' : 'border-border text-muted-foreground')}>
                    <Filter className="w-4 h-4" />
                    {activeFilters > 0 && <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">{activeFilters}</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <FilterPanel
                    dept={filterDept} setDept={setFilterDept}
                    leaveType={filterLeaveType} setLeaveType={setFilterLeaveType}
                    from={filterFrom} setFrom={setFilterFrom}
                    to={filterTo} setTo={setFilterTo}
                    activityTypes={filterActivityTypes} toggleActivity={t => setFilterActivityTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                    employmentTypes={filterEmploymentTypes} toggleEmployment={t => setFilterEmploymentTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                    onApply={applyFilters} onClear={clearFilters} onClose={() => setFilterOpen(false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 rounded-[var(--radius-button)] border-border" onClick={() => {
            exportToCSV(HISTORY_LEAVES, 'Leaves_History');
            toast.success('Download started', { description: 'Leaves data exported to CSV.' });
          }}>
            <Download className="w-4 h-4" /> Download Data
          </Button>
        </div>

        <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
          <div className="overflow-x-auto">
            {HISTORY_LEAVES.length === 0 ? (
              <EmptyState 
                icon={FileText} 
                title="No History Found" 
                description="There are no past leave requests matching your criteria." 
                className="py-16"
              />
            ) : (
              <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-muted border-b border-border">
                    <th className={thClass}>Employee Name</th>
                    <th className={thClass}>Leave Type</th>
                    <th className={thClass}>Date Range</th>
                    <th className={thClass}>Duration</th>
                    <th className={thClass}>Status</th>
                    <th className={cn(thClass, 'text-end')}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {HISTORY_LEAVES.map(leave => (
                    <tr key={leave.id} className="hover:bg-muted/30 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-b-0">
                      <td className="px-4 py-1 md:py-3 font-semibold md:font-normal">
                        <span className="text-primary font-[var(--font-weight-medium)] hover:underline cursor-pointer">{leave.name}</span>
                      </td>
                      <td className="px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Type:</span>{leave.type}</td>
                      <td className="px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Dates:</span>{leave.range}</td>
                      <td className="px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Duration:</span>{leave.duration}</td>
                      <td className="px-4 py-1 md:py-3"><span className="md:hidden text-muted-foreground me-2 font-medium">Status:</span><StatusBadge variant={leave.status as any}>{leave.status === 'approved' ? 'Approved' : 'Rejected'}</StatusBadge></td>
                      <td className="px-4 py-3 md:text-end mt-2 md:mt-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="md:w-auto w-full justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer md:bg-transparent md:border-0 md:p-1.5 md:hover:bg-muted"><span className="md:hidden">Actions</span><MoreVertical className="hidden md:block w-4 h-4 text-muted-foreground" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setViewProfileData(leave); setViewProfileOpen(true); }}><Eye className="w-4 h-4" /> View Leave</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2 whitespace-nowrap" onClick={() => toast.success('Details sent to employee')}><Download className="w-4 h-4" /> Download Letter</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <TablePagination page={historyPage} setPage={setHistoryPage} totalPages={4} />
        </div>
      </section>

      {/* ═══ MODALS ═══ */}

      {/* Create Leave */}
      <CreateLeaveModal open={createLeaveOpen} onOpenChange={setCreateLeaveOpen} />

      {/* Review Selected */}
      <ReviewSelectedModal
        open={reviewOpen} onOpenChange={setReviewOpen}
        items={PENDING_LEAVES.filter(l => selectedPending.includes(l.id))}
        onApprove={() => { setReviewOpen(false); setConfirmApprovalOpen(true); }}
      />

      {/* Confirm Approval */}
      <ConfirmDialog
        open={confirmApprovalOpen} onOpenChange={setConfirmApprovalOpen}
        title="Confirm Approval"
        message={`You are approving ${selectedPending.length} leave request(s). This action cannot be undone.`}
        confirmLabel="Confirm" cancelLabel="Cancel"
        onConfirm={() => { setConfirmApprovalOpen(false); setSelectedPending([]); toast.success(`${selectedPending.length} request(s) approved successfully`); }}
      />

      {/* View Profile / Leave Details */}
      <ViewLeaveDetailModal open={viewProfileOpen} onOpenChange={setViewProfileOpen} leave={viewProfileData} />

      {/* Decline Leave */}
      <ConfirmDialog
        open={declineOpen} onOpenChange={setDeclineOpen}
        title="Decline Leave"
        message={<>You are declining <strong>{declineData?.name}</strong>'s {declineData?.type?.toLowerCase()} leave from <strong>{declineData?.range}</strong>. This action is permanent.</>}
        confirmLabel="Decline" cancelLabel="Cancel" variant="destructive"
        onConfirm={() => { setDeclineOpen(false); toast.success(`${declineData?.name}'s leave request declined`); }}
      />

      {/* Add Holiday */}
      <HolidayFormModal open={addHolidayOpen} onOpenChange={setAddHolidayOpen} title="Add Holiday / Bridge" onSave={() => { setAddHolidayOpen(false); toast.success('Holiday added successfully'); }} />

      {/* Edit Holiday */}
      <HolidayFormModal open={editHolidayOpen} onOpenChange={setEditHolidayOpen} title="Edit Holiday / Bridge" holiday={editHolidayData} onSave={() => { setEditHolidayOpen(false); toast.success('Holiday updated successfully'); }} />

      {/* Delete Holiday */}
      <ConfirmDialog
        open={deleteHolidayOpen} onOpenChange={setDeleteHolidayOpen}
        title={`Delete ${deleteHolidayData?.type}`}
        message={<>You are deleting <strong>{deleteHolidayData?.name}</strong> ({deleteHolidayData?.range}). This action is permanent.</>}
        confirmLabel="Confirm" cancelLabel="Cancel" variant="destructive"
        onConfirm={() => { setDeleteHolidayOpen(false); toast.success(`${deleteHolidayData?.name} deleted`); }}
      />
    </div>
  );
};

// ════════════════════════════════════
// ── Sub-components ──
// ════════════════════════════════════

const TablePagination: React.FC<{ page: number; setPage: (p: number) => void; totalPages: number }> = ({ page, setPage, totalPages }) => {
  const [pi, setPi] = useState(String(page));
  const go = (p: number) => { const v = Math.max(1, Math.min(p, totalPages)); setPage(v); setPi(String(v)); };
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border bg-muted/20">
      <div className="flex items-center gap-3 text-[var(--text-sm)] text-muted-foreground w-full sm:w-auto justify-center sm:justify-start">
        <span>Items Per Page</span>
        <select className="h-11 px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] outline-none cursor-pointer hover:bg-muted/50 transition-colors" defaultValue="15">
          <option>10</option><option>15</option><option>30</option>
        </select>
      </div>
      <div className="flex flex-row items-center justify-center sm:justify-end gap-2 pt-2 w-full">
        <button onClick={() => go(page - 1)} disabled={page <= 1} className="w-11 h-11 flex items-center justify-center border border-border rounded-[var(--radius-sm)] bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm" aria-label="Previous page">
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <span className="text-[var(--text-sm)] text-foreground flex items-center gap-2 whitespace-nowrap">
          Page
          <input type="text" value={pi} onChange={(e) => setPi(e.target.value)} onBlur={() => go(Number(pi) || 1)} onKeyDown={(e) => e.key === 'Enter' && go(Number(pi) || 1)} className="w-12 h-11 text-center border border-border rounded-[var(--radius-input)] bg-input-background text-foreground focus:ring-2 focus:ring-ring/50 outline-none text-[var(--text-sm)] shadow-sm" aria-label="Page number input" />
          <span className="text-muted-foreground">of {totalPages}</span>
        </span>
        <button onClick={() => go(page + 1)} disabled={page >= totalPages} className="w-11 h-11 flex items-center justify-center border border-border rounded-[var(--radius-sm)] bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm" aria-label="Next page">
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
      </div>
    </div>
  );
};

// ── Filter Panel ──
const FilterPanel: React.FC<{
  dept: string; setDept: (v: string) => void;
  leaveType: string; setLeaveType: (v: string) => void;
  from: string; setFrom: (v: string) => void;
  to: string; setTo: (v: string) => void;
  activityTypes: string[]; toggleActivity: (v: string) => void;
  employmentTypes: string[]; toggleEmployment: (v: string) => void;
  onApply: () => void; onClear: () => void; onClose: () => void;
}> = ({ dept, setDept, leaveType, setLeaveType, from, setFrom, to, setTo, activityTypes, toggleActivity, employmentTypes, toggleEmployment, onApply, onClear, onClose }) => (
  <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
    <div className="flex items-center justify-between">
      <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Search Options</span>
      <button onClick={onClose} className="p-1 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer"><X className="w-4 h-4 text-muted-foreground" /></button>
    </div>
    <SelectField label="Department" value={dept} onChange={setDept} options={DEPARTMENTS} />
    <SelectField label="Leave Type" value={leaveType} onChange={setLeaveType} options={LEAVE_TYPES} />
    <div className="space-y-1.5"><label className={labelClass}>From</label><DatePicker value={from} onChange={setFrom} placeholder="Select from date" /></div>
    <div className="space-y-1.5"><label className={labelClass}>To</label><DatePicker value={to} onChange={setTo} placeholder="Select to date" /></div>
    <CheckboxGroup label="Activity Type" items={ACTIVITY_TYPES} selected={activityTypes} toggle={toggleActivity} />
    <CheckboxGroup label="Employment Type" items={EMPLOYMENT_TYPES} selected={employmentTypes} toggle={toggleEmployment} />
    <div className="space-y-2 pt-2">
      <Button onClick={onApply} className="w-full rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white">Apply Filter</Button>
      <Button variant="outline" onClick={onClear} className="w-full rounded-[var(--radius-button)] border-border">Clear Filter</Button>
    </div>
  </div>
);

const SelectField: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label className={labelClass}>{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  </div>
);

const CheckboxGroup: React.FC<{ label: string; items: string[]; selected: string[]; toggle: (v: string) => void }> = ({ label, items, selected, toggle }) => (
  <div className="space-y-2">
    <label className={labelClass}>{label}</label>
    <div className="space-y-2">{items.map(item => (
      <label key={item} className="flex items-center gap-2.5 cursor-pointer group">
        <Checkbox checked={selected.includes(item)} onCheckedChange={() => toggle(item)} />
        <span className="text-[var(--text-sm)] text-foreground group-hover:text-primary transition-colors font-[var(--font-weight-normal)]">{item}</span>
      </label>
    ))}</div>
  </div>
);

// ── Create Leave Modal ──
const CreateLeaveModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const [name, setName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [leaveType, setLeaveType] = useState('Sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Create Leave</DialogTitle><DialogDescription className="sr-only">Create a new leave request</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <FormField label="Employee Name" value={name} onChange={setName} placeholder="Full name" />
          <FormField label="Employee Number" value={employeeNumber} onChange={setEmployeeNumber} placeholder="XXXXX" />
          <SelectField label="Leave Type" value={leaveType} onChange={setLeaveType} options={LEAVE_TYPES.filter(l => l !== 'All')} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Start Date" value={startDate} onChange={setStartDate} type="date" />
            <FormField label="End Date" value={endDate} onChange={setEndDate} type="date" />
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="w-full sm:w-auto rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => { onOpenChange(false); toast.success('Leave created successfully'); }}>Create Leave</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Review Selected Modal ──
const ReviewSelectedModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; items: LeaveRequest[]; onApprove: () => void }> = ({ open, onOpenChange, items, onApprove }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Review Selected Requests</DialogTitle><DialogDescription className="sr-only">Review and approve selected leave requests</DialogDescription></DialogHeader>
        <div className="border border-border rounded-[var(--radius)] overflow-x-auto bg-card mt-2 shadow-[var(--elevation-sm)]">
          <table className="w-full md:min-w-max text-[var(--text-sm)]">
          <thead><tr className="bg-muted border-b border-border">
            <th className={thClass}>Employee Name</th><th className={thClass}>Leave Type</th><th className={thClass}>Date Range</th><th className={thClass}>Duration</th><th className={thClass}>Notes</th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {items.map(l => (
              <tr key={l.id} className="hover:bg-muted/30">
                <td className="px-4 py-2.5"><span className="text-foreground font-[var(--font-weight-medium)]">{l.name}</span></td>
                <td className="px-4 py-2.5 text-foreground">{l.type}</td>
                <td className="px-4 py-2.5 text-foreground">{l.range}</td>
                <td className="px-4 py-2.5 text-foreground">{l.duration}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{l.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DialogFooter className="pt-4 gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)] border-border">Cancel</Button>
        <Button className="w-full sm:w-auto rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={onApprove}>Approve All ({items.length})</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ── View Leave Detail Modal ──
const ViewLeaveDetailModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; leave: LeaveRequest | null }> = ({ open, onOpenChange, leave }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Leave Details</DialogTitle><DialogDescription className="sr-only">Leave request details</DialogDescription></DialogHeader>
      {leave && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-[var(--radius)]">
            <div><p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">{leave.name}</p><p className="text-[var(--text-xs)] text-muted-foreground uppercase">{leave.employeeNumber || '00000'}</p></div>
          </div>
          <div className="space-y-2 text-[var(--text-sm)]">
            <InfoRow label="Leave" value={`${leave.type} - ${leave.range} (${leave.duration})`} />
            <InfoRow label="Notes" value={leave.notes} />
            {leave.status && <InfoRow label="Status" value={leave.status.charAt(0).toUpperCase() + leave.status.slice(1)} />}
          </div>
        </div>
      )}
      <DialogFooter className="pt-2"><Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)] border-border">Close</Button></DialogFooter>
    </DialogContent>
  </Dialog>
);

// ── Holiday Form Modal ──
const HolidayFormModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; title: string; holiday?: Holiday | null; onSave: () => void }> = ({ open, onOpenChange, title, holiday, onSave }) => {
  const [hName, setHName] = useState('');
  const [hType, setHType] = useState<string>('Holiday');
  const [startD, setStartD] = useState('');
  const [endD, setEndD] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (holiday) { setHName(holiday.name); setHType(holiday.type); setNotes(holiday.notes); } else { setHName(''); setHType('Holiday'); setStartD(''); setEndD(''); setNotes(''); }
  }, [holiday, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">{title}</DialogTitle><DialogDescription className="sr-only">{title}</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <FormField label="Name" value={hName} onChange={setHName} placeholder="e.g. Eid Al-Fitr" />
          <SelectField label="Type" value={hType} onChange={setHType} options={['Holiday', 'Bridge']} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Start Date" value={startD} onChange={setStartD} type="date" />
            <FormField label="End Date" value={endD} onChange={setEndD} type="date" />
          </div>
          <div className="space-y-1.5"><label className={labelClass}>Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={cn(inputClass, 'h-auto py-2')} placeholder="Optional notes..." /></div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="w-full sm:w-auto rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={onSave}>{holiday ? 'Save' : 'Add'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Confirm Dialog ──
const ConfirmDialog: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; title: string; message: React.ReactNode; confirmLabel: string; cancelLabel: string; variant?: 'default' | 'destructive'; onConfirm: () => void }> = ({ open, onOpenChange, title, message, confirmLabel, cancelLabel, variant = 'default', onConfirm }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">{title}</DialogTitle><DialogDescription className="sr-only">{title}</DialogDescription></DialogHeader>
      <div className={cn('p-3 rounded-[var(--radius)] border flex gap-3', variant === 'destructive' ? 'bg-destructive/5 border-destructive/20' : 'bg-primary/5 border-primary/20')}>
        <Info className={cn('w-5 h-5 shrink-0 mt-0.5', variant === 'destructive' ? 'text-destructive' : 'text-primary')} />
        <p className="text-[var(--text-sm)] text-foreground">{message}</p>
      </div>
      <DialogFooter className="pt-2 gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)] border-border">{cancelLabel}</Button>
        <Button variant={variant === 'destructive' ? 'destructive' : 'default'} className={cn('w-full sm:w-auto rounded-[var(--radius-button)]', variant !== 'destructive' && 'bg-chart-3 hover:bg-chart-3/90 text-white')} onClick={onConfirm}>{confirmLabel}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ── Shared helpers ──
const FormField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="space-y-1.5"><label className={labelClass}>{label}</label>{type === 'date' ? <DatePicker value={value} onChange={onChange} placeholder={placeholder} /> : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />}</div>
);
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex gap-3"><span className="text-muted-foreground w-24 shrink-0 font-[var(--font-weight-medium)]">{label}:</span><span className="text-foreground">{value}</span></div>
);
