import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { Pagination } from './Pagination';
import { useTranslation } from 'react-i18next';
import { localizePersonName } from '@/lib/localizedNames';

// ── Shared styles ──
const inputClass = 'w-full h-[44px] px-3 border border-border rounded-[var(--radius-input)] bg-input-background dark:bg-input/30 dark:hover:bg-input/50 text-foreground text-[var(--text-sm)] text-start focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const labelClass = 'block text-start w-full text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground';
const thClass = 'px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-[var(--text-sm)] whitespace-nowrap';
const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String((error as any)?.message || 'Please check the request details and try again.');

import { LeaveRequest, LeaveService, EmployeeService, Employee } from '../../lib/services/dbServices';

interface Holiday {
  id: string;
  type: 'Bridge' | 'Holiday';
  name: string;
  nameEn?: string;
  nameAr?: string;
  range: string;
  duration: string;
  notes: string;
}

// Note: PENDING_LEAVES and HISTORY_LEAVES mock arrays replaced by dynamic database service.

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
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const displayEmployeeName = (name?: string) => localizePersonName(name, language);

  const [allLeaves, setAllLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const data = await LeaveService.getAll();
      setAllLeaves(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const pendingLeaves = useMemo(() => allLeaves.filter(l => l.status === 'pending' || l.status === 'Pending'), [allLeaves]);
  const historyLeaves = useMemo(() => allLeaves.filter(l => l.status === 'approved' || l.status === 'Approved' || l.status === 'rejected' || l.status === 'Rejected'), [allLeaves]);

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

  // Filtered and Paginated lists
  const filteredPending = useMemo(() => {
    return pendingLeaves.filter(l => 
      !pendingSearch || l.name.toLowerCase().includes(pendingSearch.toLowerCase()) || l.employeeNumber?.includes(pendingSearch)
    );
  }, [pendingLeaves, pendingSearch]);

  const paginatedPending = useMemo(() => {
    const start = (pendingPage - 1) * 15;
    return filteredPending.slice(start, start + 15);
  }, [filteredPending, pendingPage]);

  const filteredHolidays = useMemo(() => {
    return HOLIDAYS.filter(h => {
      const matchesMonth = holidayMonth === 'All' || h.range.includes(holidayMonth);
      const matchesYear = holidayYear === 'All' || h.range.includes(holidayYear);
      return matchesMonth && matchesYear;
    });
  }, [holidayMonth, holidayYear]);

  const paginatedHolidays = useMemo(() => {
    const start = (holidayPage - 1) * 15;
    return filteredHolidays.slice(start, start + 15);
  }, [filteredHolidays, holidayPage]);

  const filteredHistory = useMemo(() => {
    return historyLeaves.filter(l => {
      const matchesSearch = !historySearch || l.name.toLowerCase().includes(historySearch.toLowerCase());
      const matchesDept = filterDept === 'All';
      return matchesSearch && matchesDept;
    });
  }, [historyLeaves, historySearch, filterDept]);

  const paginatedHistory = useMemo(() => {
    const start = (historyPage - 1) * 15;
    return filteredHistory.slice(start, start + 15);
  }, [filteredHistory, historyPage]);

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
  const toggleAllPending = () => setSelectedPending(p => p.length === pendingLeaves.length ? [] : pendingLeaves.map(l => l.id));

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
            <Button size="sm" className="w-full sm:w-auto h-[44px] gap-2 rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white cursor-pointer justify-center" onClick={() => setCreateLeaveOpen(true)}>
              <Plus className="w-4 h-4" /> Create Leave
            </Button>
            <Button 
              ref={approveButtonRef}
              variant={selectedPending.length > 0 ? "default" : "outline"} 
              size="sm" 
              className="w-full sm:w-auto h-[44px] gap-2 rounded-[var(--radius-button)] cursor-pointer justify-center transition-all" 
              onClick={() => { if (!selectedPending.length) { toast.error('Select at least one request'); return; } setReviewOpen(true); }}
            >
              {selectedPending.length > 1 ? 'Approve Leaves' : 'Approve Leave'}
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
          <div className="overflow-x-auto">
            {pendingLeaves.length === 0 ? (
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
                    <th className={cn(thClass, 'w-10')}><Checkbox checked={selectedPending.length === pendingLeaves.length && pendingLeaves.length > 0} onCheckedChange={toggleAllPending} /></th>
                    <th className={thClass}>Employee Name</th>
                    <th className={thClass}>Leave Type</th>
                    <th className={thClass}>Date Range</th>
                    <th className={thClass}>Duration</th>
                    <th className={thClass}>Notes</th>
                    <th className={cn(thClass, 'text-end')}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedPending.map(leave => (
                    <tr key={leave.id} className="hover:bg-muted/30 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-b-0">
                      <td className="whitespace-nowrap px-4 py-3 hidden md:table-cell"><Checkbox checked={selectedPending.includes(leave.id)} onCheckedChange={() => togglePending(leave.id)} /></td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 font-semibold md:font-normal">
                        <div className="flex items-center gap-2">
                          <Checkbox className="md:hidden" checked={selectedPending.includes(leave.id)} onCheckedChange={() => togglePending(leave.id)} />
                          <span className="text-primary font-[var(--font-weight-medium)] hover:underline cursor-pointer">{displayEmployeeName(leave.name)}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Type:</span>{leave.type}</td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Dates:</span>{leave.range}</td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Duration:</span>{leave.duration}</td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 text-muted-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Notes:</span>{leave.notes}</td>
                      <td className="whitespace-nowrap px-4 py-3 md:text-end mt-2 md:mt-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="md:w-auto w-full justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer md:bg-transparent md:border-0 md:p-1.5 md:hover:bg-muted"><span className="md:hidden">Actions</span><MoreVertical className="hidden md:block w-4 h-4 text-muted-foreground" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
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
          <TablePagination page={pendingPage} setPage={setPendingPage} totalPages={Math.max(1, Math.ceil(filteredPending.length / 15))} totalItems={filteredPending.length} />
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
                {paginatedHolidays.map(h => (
                  <tr key={h.id} className="hover:bg-muted/30 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 text-foreground font-[var(--font-weight-medium)]">{h.type}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">{h.range}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">{h.duration}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{h.notes}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-end">
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
          <TablePagination page={holidayPage} setPage={setHolidayPage} totalPages={Math.max(1, Math.ceil(filteredHolidays.length / 15))} totalItems={filteredHolidays.length} />
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
                <PopoverContent align="end" collisionPadding={16} className="w-80 p-0">
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
            exportToCSV(historyLeaves, 'Leaves_History');
            toast.success('Download started', { description: 'Leaves data exported to CSV.' });
          }}>
            <Download className="w-4 h-4" /> Download Data
          </Button>
        </div>

        <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
          <div className="overflow-x-auto">
            {historyLeaves.length === 0 ? (
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
                  {paginatedHistory.map(leave => (
                    <tr key={leave.id} className="hover:bg-muted/30 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-b-0">
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 font-semibold md:font-normal">
                        <span className="text-primary font-[var(--font-weight-medium)] hover:underline cursor-pointer">{displayEmployeeName(leave.name)}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Type:</span>{leave.type}</td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Dates:</span>{leave.range}</td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Duration:</span>{leave.duration}</td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3"><span className="md:hidden text-muted-foreground me-2 font-medium">Status:</span><StatusBadge variant={leave.status as any}>{leave.status === 'approved' ? 'Approved' : 'Rejected'}</StatusBadge></td>
                      <td className="whitespace-nowrap px-4 py-3 md:text-end mt-2 md:mt-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="md:w-auto w-full justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer md:bg-transparent md:border-0 md:p-1.5 md:hover:bg-muted"><span className="md:hidden">Actions</span><MoreVertical className="hidden md:block w-4 h-4 text-muted-foreground" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
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
          <TablePagination page={historyPage} setPage={setHistoryPage} totalPages={Math.max(1, Math.ceil(filteredHistory.length / 15))} totalItems={filteredHistory.length} />
        </div>
      </section>

      {/* ═══ MODALS ═══ */}

      {/* Create Leave */}
      <CreateLeaveModal 
        open={createLeaveOpen} 
        onOpenChange={setCreateLeaveOpen} 
        onSave={async (data) => {
          try {
            if (!data.employeeNumber.trim() || !data.startDate || !data.endDate) {
              toast.error('Employee number, start date, and end date are required');
              return;
            }
            const allEmployees = await EmployeeService.getAll();
            const matchingEmployee = allEmployees.find(emp => emp.employeeNumber === data.employeeNumber);
            if (!matchingEmployee) {
              toast.error(`Employee with number ${data.employeeNumber} not found`);
              return;
            }
            await LeaveService.create({
              ...data,
              employeeId: matchingEmployee.id
            });
            await loadLeaves();
            setCreateLeaveOpen(false);
            toast.success('Leave created successfully');
          } catch (e) {
            console.error(e);
            toast.error('Failed to create leave request', { description: getErrorMessage(e) });
          }
        }}
      />

      {/* Review Selected */}
      <ReviewSelectedModal
        open={reviewOpen} onOpenChange={setReviewOpen}
        items={pendingLeaves.filter(l => selectedPending.includes(l.id))}
        onApprove={() => { setReviewOpen(false); setConfirmApprovalOpen(true); }}
      />

      {/* Confirm Approval */}
      <ConfirmDialog
        open={confirmApprovalOpen} onOpenChange={setConfirmApprovalOpen}
        title="Confirm Approval"
        message={`You are approving ${selectedPending.length} leave request(s). This action cannot be undone.`}
        confirmLabel="Confirm" cancelLabel="Cancel"
        onConfirm={async () => {
          try {
            for (const id of selectedPending) {
              await LeaveService.updateStatus(id, 'approved');
            }
            await loadLeaves();
            setConfirmApprovalOpen(false);
            setSelectedPending([]);
            toast.success(`${selectedPending.length} request(s) approved successfully`);
          } catch (e) {
            toast.error('Failed to approve selected leaves');
          }
        }}
      />

      {/* View Profile / Leave Details */}
      <ViewLeaveDetailModal open={viewProfileOpen} onOpenChange={setViewProfileOpen} leave={viewProfileData} />

      {/* Decline Leave */}
      <ConfirmDialog
        open={declineOpen} onOpenChange={setDeclineOpen}
        title="Decline Leave"
        message={<>You are declining <strong>{displayEmployeeName(declineData?.name)}</strong>'s {declineData?.type?.toLowerCase()} leave from <strong>{declineData?.range}</strong>. This action is permanent.</>}
        confirmLabel="Decline" cancelLabel="Cancel" variant="destructive"
        onConfirm={async () => {
          try {
            if (declineData) {
              await LeaveService.updateStatus(declineData.id, 'rejected');
              await loadLeaves();
            }
            setDeclineOpen(false);
            toast.success(`${displayEmployeeName(declineData?.name)}'s leave request declined`);
          } catch (e) {
            toast.error('Failed to decline leave request');
          }
        }}
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

const TablePagination: React.FC<{ page: number; setPage: (p: number) => void; totalPages: number; totalItems?: number }> = ({ page, setPage, totalPages, totalItems }) => {
  return (
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      itemsPerPage={15}
      onPageChange={setPage}
      onItemsPerPageChange={() => setPage(1)}
      totalItems={totalItems}
    />
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
  <div className="p-4 space-y-4 max-h-[var(--radix-popover-content-available-height,480px)] overflow-y-auto">
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
const CreateLeaveModal: React.FC<{ 
  open: boolean; 
  onOpenChange: (v: boolean) => void;
  onSave: (data: { name: string; employeeNumber: string; type: string; range: string; duration: string; notes: string; startDate: string; endDate: string }) => void;
}> = ({ open, onOpenChange, onSave }) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;

  const [name, setName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [leaveType, setLeaveType] = useState('Sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [showNumberSuggestions, setShowNumberSuggestions] = useState(false);

  useEffect(() => {
    if (open) {
      EmployeeService.getAll().then(setEmployees).catch(console.error);
    }
  }, [open]);

  // Suggestions matching the name (max 4)
  const nameSuggestions = useMemo(() => {
    if (!name.trim()) return [];
    const query = name.toLowerCase();
    return employees.filter(emp => {
      const enName = typeof emp.name === 'string' ? emp.name : emp.name.nameEn;
      const arName = typeof emp.name === 'string' ? '' : emp.name.nameAr;
      return enName.toLowerCase().includes(query) || arName.toLowerCase().includes(query) || emp.employeeNumber.includes(query);
    }).slice(0, 4);
  }, [name, employees]);

  // Suggestions matching the employee number (max 4)
  const numberSuggestions = useMemo(() => {
    if (!employeeNumber.trim()) return [];
    const query = employeeNumber.toLowerCase();
    return employees.filter(emp => {
      const enName = typeof emp.name === 'string' ? emp.name : emp.name.nameEn;
      const arName = typeof emp.name === 'string' ? '' : emp.name.nameAr;
      return emp.employeeNumber.toLowerCase().includes(query) || enName.toLowerCase().includes(query) || arName.toLowerCase().includes(query);
    }).slice(0, 4);
  }, [employeeNumber, employees]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Create Leave</DialogTitle><DialogDescription className="sr-only">Create a new leave request</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <label className={labelClass}>Employee Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setShowNameSuggestions(true);
              }}
              onFocus={() => setShowNameSuggestions(true)}
              onBlur={() => setTimeout(() => setShowNameSuggestions(false), 200)}
              placeholder="Full name"
              className={inputClass}
            />
            {showNameSuggestions && nameSuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-popover border border-border rounded-[var(--radius-input)] shadow-md overflow-hidden max-h-60">
                {nameSuggestions.map((emp) => {
                  const displayName = typeof emp.name === 'string' ? emp.name : (language === 'ar' ? emp.name.nameAr : emp.name.nameEn);
                  return (
                    <button
                      key={emp.id}
                      type="button"
                      className="w-full px-3 py-2 text-start hover:bg-muted/80 text-[var(--text-sm)] text-foreground flex justify-between items-center transition-colors border-b border-border/40 last:border-0 cursor-pointer"
                      onMouseDown={() => {
                        setName(displayName);
                        setEmployeeNumber(emp.employeeNumber);
                        setShowNameSuggestions(false);
                      }}
                    >
                      <span className="font-medium truncate">{displayName}</span>
                      <span className="text-xs text-muted-foreground font-mono">#{emp.employeeNumber}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative">
            <label className={labelClass}>Employee Number</label>
            <input
              type="text"
              value={employeeNumber}
              onChange={(e) => {
                setEmployeeNumber(e.target.value);
                setShowNumberSuggestions(true);
              }}
              onFocus={() => setShowNumberSuggestions(true)}
              onBlur={() => setTimeout(() => setShowNumberSuggestions(false), 200)}
              placeholder="XXXXX"
              className={inputClass}
            />
            {showNumberSuggestions && numberSuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-popover border border-border rounded-[var(--radius-input)] shadow-md overflow-hidden max-h-60">
                {numberSuggestions.map((emp) => {
                  const displayName = typeof emp.name === 'string' ? emp.name : (language === 'ar' ? emp.name.nameAr : emp.name.nameEn);
                  return (
                    <button
                      key={emp.id}
                      type="button"
                      className="w-full px-3 py-2 text-start hover:bg-muted/80 text-[var(--text-sm)] text-foreground flex justify-between items-center transition-colors border-b border-border/40 last:border-0 cursor-pointer"
                      onMouseDown={() => {
                        setName(displayName);
                        setEmployeeNumber(emp.employeeNumber);
                        setShowNumberSuggestions(false);
                      }}
                    >
                      <span className="font-medium truncate">{displayName}</span>
                      <span className="text-xs text-muted-foreground font-mono">#{emp.employeeNumber}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <SelectField label="Leave Type" value={leaveType} onChange={setLeaveType} options={LEAVE_TYPES.filter(l => l !== 'All')} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Start Date" value={startDate} onChange={setStartDate} type="date" />
            <FormField label="End Date" value={endDate} onChange={setEndDate} type="date" />
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="w-full sm:w-auto rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => {
            if (!employeeNumber.trim() || !startDate || !endDate) {
              toast.error('Employee number, start date, and end date are required');
              return;
            }
            if (new Date(endDate) < new Date(startDate)) {
              toast.error('End date must be after start date');
              return;
            }
            const diffDays = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
            onSave({
              name,
              employeeNumber,
              type: leaveType,
              range: `${startDate} - ${endDate}`,
              duration: `${diffDays} days`,
              notes: 'Created via admin panel',
              startDate,
              endDate
            });
          }}>Create Leave</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Review Selected Modal ──
const ReviewSelectedModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; items: LeaveRequest[]; onApprove: () => void }> = ({ open, onOpenChange, items, onApprove }) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;

  return (
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
                  <td className="whitespace-nowrap px-4 py-3"><span className="text-foreground font-[var(--font-weight-medium)]">{localizePersonName(l.name, language)}</span></td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{l.type}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{l.range}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{l.duration}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{l.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={1} totalPages={1} itemsPerPage={15} onPageChange={() => {}} onItemsPerPageChange={() => {}} />
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="w-full sm:w-auto rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={onApprove}>Approve All ({items.length})</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── View Leave Detail Modal ──
const ViewLeaveDetailModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; leave: LeaveRequest | null }> = ({ open, onOpenChange, leave }) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Leave Details</DialogTitle><DialogDescription className="sr-only">Leave request details</DialogDescription></DialogHeader>
        {leave && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-[var(--radius)]">
              <div><p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">{localizePersonName(leave.name, language)}</p><p className="text-[var(--text-xs)] text-muted-foreground uppercase">{leave.employeeNumber || '00000'}</p></div>
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
};

const EGYPTIAN_HOLIDAYS = [
  { nameEn: 'Eid Al-Fitr', nameAr: 'عيد الفطر' },
  { nameEn: 'Eid Al-Adha', nameAr: 'عيد الأضحى' },
  { nameEn: 'Revolution Day', nameAr: 'ثورة 23 يوليو' },
  { nameEn: 'Armed Forces Day', nameAr: 'عيد القوات المسلحة (6 أكتوبر)' },
  { nameEn: 'Labor Day', nameAr: 'عيد العمال' },
  { nameEn: 'Sham El-Nessim', nameAr: 'شم النسيم' },
  { nameEn: 'Coptic Christmas', nameAr: 'عيد الميلاد المجيد' },
  { nameEn: 'Prophet Muhammad Birthday', nameAr: 'المولد النبوي الشريف' }
];

// ── Holiday Form Modal ──
const HolidayFormModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; title: string; holiday?: Holiday | null; onSave: () => void }> = ({ open, onOpenChange, title, holiday, onSave }) => {
  const [hNameEn, setHNameEn] = useState('');
  const [hNameAr, setHNameAr] = useState('');
  const [hType, setHType] = useState<string>('Holiday');
  const [startD, setStartD] = useState('');
  const [endD, setEndD] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (holiday) { setHNameEn(holiday.nameEn || holiday.name); setHNameAr(holiday.nameAr || ''); setHType(holiday.type); setNotes(holiday.notes); } else { setHNameEn(''); setHNameAr(''); setHType('Holiday'); setStartD(''); setEndD(''); setNotes(''); }
  }, [holiday, open]);

  const handleSuggestionSelect = (val: string) => {
    if (!val) return;
    const selected = EGYPTIAN_HOLIDAYS.find(h => h.nameEn === val);
    if (selected) {
      setHNameEn(selected.nameEn);
      setHNameAr(selected.nameAr);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">{title}</DialogTitle><DialogDescription className="sr-only">{title}</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Common Egyptian Holidays</label>
            <Select onValueChange={handleSuggestionSelect}>
              <SelectTrigger className="w-full bg-muted/50 border-border">
                <SelectValue placeholder="Select a common holiday..." />
              </SelectTrigger>
              <SelectContent>
                {EGYPTIAN_HOLIDAYS.map(h => (
                  <SelectItem key={h.nameEn} value={h.nameEn}>
                    {h.nameEn} - {h.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FormField label="Holiday Name (English)" value={hNameEn} onChange={setHNameEn} placeholder="e.g. Eid Al-Fitr" />
          <FormField label="Holiday Name (Arabic)" value={hNameAr} onChange={setHNameAr} placeholder="e.g. عيد الفطر" />
          <SelectField label="Type" value={hType} onChange={setHType} options={['Holiday', 'Bridge']} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Start Date" value={startD} onChange={setStartD} type="date" />
            <FormField label="End Date" value={endD} onChange={setEndD} type="date" />
          </div>
          <div className="space-y-1.5"><label className={labelClass}>Notes</label><textarea dir="auto" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={cn(inputClass, 'h-auto py-2')} placeholder="Optional notes..." /></div>
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
