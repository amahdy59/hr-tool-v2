import React, { useState, useMemo, useEffect } from 'react';
import {
  MoreVertical, Download, Plus, Search, Filter,
  Info, Eye, ChevronLeft, ChevronRight, X, Check, Trash2, Rocket,
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

import { MissionRequest, MissionService, EmployeeService, Employee } from '../../lib/services/dbServices';

// ── Mock Data ──
const MISSION_TYPES = ['Work From Home', 'Visa Issuing', 'Client Visit', 'Training', 'Conference'];

const ACTIVITY_TYPES = ['My team', 'Lead Engineer', 'Application Consultant', 'Project Manager'];
const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contractor', 'Intern'];
const uniqueOptions = (values: Array<string | undefined>) =>
  Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))).sort((a, b) => a.localeCompare(b));

const getRequestDate = (request: Pick<MissionRequest, 'startDate' | 'endDate' | 'range'>, boundary: 'start' | 'end') => {
  if (boundary === 'start' && request.startDate) return request.startDate;
  if (boundary === 'end' && request.endDate) return request.endDate;
  const [start, end] = request.range.split(' - ');
  return boundary === 'start' ? start : end || start;
};

export const MissionsManagement: React.FC = () => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const displayEmployeeName = (name?: string) => localizePersonName(name, language);

  const [allMissions, setAllMissions] = useState<MissionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMissions = async () => {
    try {
      setLoading(true);
      const data = await MissionService.getAll();
      setAllMissions(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load mission requests');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadMissions();
  }, []);

  const pendingMissions = useMemo(() => allMissions.filter(m => m.status === 'pending' || m.status === 'Pending'), [allMissions]);
  const historyMissions = useMemo(() => allMissions.filter(m => m.status === 'approved' || m.status === 'Approved' || m.status === 'rejected' || m.status === 'Rejected'), [allMissions]);

  // Pending
  const [pendingSearch, setPendingSearch] = useState('');
  const [selectedPending, setSelectedPending] = useState<string[]>([]);
  const [pendingPage, setPendingPage] = useState(1);

  // History
  const [historySearch, setHistorySearch] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [filterMissionType, setFilterMissionType] = useState('All');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [filterActivityTypes, setFilterActivityTypes] = useState<string[]>([]);
  const [filterEmploymentTypes, setFilterEmploymentTypes] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState(0);

  const departmentOptions = useMemo(() => ['All', ...uniqueOptions(allMissions.map(m => m.department))], [allMissions]);
  const missionTypeOptions = useMemo(() => ['All', ...uniqueOptions(allMissions.map(m => m.type))], [allMissions]);
  const activityTypeOptions = useMemo(() => uniqueOptions(allMissions.map(m => m.activityType)), [allMissions]);
  const employmentTypeOptions = useMemo(() => uniqueOptions(allMissions.map(m => m.contractType)), [allMissions]);

  // Filtered and Paginated lists
  const filteredPending = useMemo(() => {
    return pendingMissions.filter(m => 
      !pendingSearch || m.name.toLowerCase().includes(pendingSearch.toLowerCase()) || m.employeeNumber?.includes(pendingSearch)
    );
  }, [pendingMissions, pendingSearch]);

  const paginatedPending = useMemo(() => {
    const start = (pendingPage - 1) * 15;
    return filteredPending.slice(start, start + 15);
  }, [filteredPending, pendingPage]);

  const filteredHistory = useMemo(() => {
    return historyMissions.filter(m => {
      const requestStart = getRequestDate(m, 'start');
      const requestEnd = getRequestDate(m, 'end');
      const matchesSearch = !historySearch || m.name.toLowerCase().includes(historySearch.toLowerCase()) || m.employeeNumber?.includes(historySearch);
      const matchesDept = filterDept === 'All' || m.department === filterDept;
      const matchesMissionType = filterMissionType === 'All' || m.type === filterMissionType;
      const matchesFrom = !filterFrom || requestEnd >= filterFrom;
      const matchesTo = !filterTo || requestStart <= filterTo;
      const matchesActivity = filterActivityTypes.length === 0 || (m.activityType ? filterActivityTypes.includes(m.activityType) : false);
      const matchesEmployment = filterEmploymentTypes.length === 0 || (m.contractType ? filterEmploymentTypes.includes(m.contractType) : false);
      return matchesSearch && matchesDept && matchesMissionType && matchesFrom && matchesTo && matchesActivity && matchesEmployment;
    });
  }, [historyMissions, historySearch, filterDept, filterMissionType, filterFrom, filterTo, filterActivityTypes, filterEmploymentTypes]);

  const paginatedHistory = useMemo(() => {
    const start = (historyPage - 1) * 15;
    return filteredHistory.slice(start, start + 15);
  }, [filteredHistory, historyPage]);

  // Modals
  const [createMissionOpen, setCreateMissionOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [confirmApprovalOpen, setConfirmApprovalOpen] = useState(false);
  const [viewDetailOpen, setViewDetailOpen] = useState(false);
  const [viewDetailData, setViewDetailData] = useState<MissionRequest | null>(null);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineData, setDeclineData] = useState<MissionRequest | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<MissionRequest | null>(null);

  const togglePending = (id: string) => setSelectedPending(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelectedPending(p => p.length === pendingMissions.length ? [] : pendingMissions.map(m => m.id));

  const applyFilters = () => {
    let c = 0;
    if (filterDept !== 'All') c++;
    if (filterMissionType !== 'All') c++;
    if (filterFrom) c++;
    if (filterTo) c++;
    if (filterActivityTypes.length) c++;
    if (filterEmploymentTypes.length) c++;
    setActiveFilters(c);
    setFilterOpen(false);
    toast.success('Filters applied', { description: `${c} filter${c !== 1 ? 's' : ''} active` });
  };
  const clearFilters = () => {
    setFilterDept('All'); setFilterMissionType('All'); setFilterFrom(''); setFilterTo('');
    setFilterActivityTypes([]); setFilterEmploymentTypes([]); setActiveFilters(0);
    toast.info('Filters cleared');
  };

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* ══ Pending Approval ══ */}
      <section className="space-y-6">
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--page-title-size)', fontWeight: 'var(--page-title-weight)' }} className="text-foreground">Missions Pending Approval</h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1 max-w-md space-y-1">
            <div className="flex items-center gap-2">
              <label htmlFor="pending-missions-search" className={labelClass}>Search Employee</label>
              <Tooltip><TooltipTrigger asChild><button type="button" aria-label="Search help" className="cursor-pointer"><Info className="w-4 h-4 text-primary" /></button></TooltipTrigger><TooltipContent side="top" className="text-[var(--text-xs)]"><p>Search by name or Employee number</p></TooltipContent></Tooltip>
            </div>
            <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <input id="pending-missions-search" type="search" value={pendingSearch} onChange={e => setPendingSearch(e.target.value)} placeholder="Search by name or Employee#..." className={cn(inputClass, 'ps-10')} autoComplete="search" />
            </form>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant={selectedPending.length > 0 ? "default" : "outline"} size="sm" className="w-full sm:w-auto h-[44px] gap-2 rounded-[var(--radius-button)] cursor-pointer justify-center transition-all" onClick={() => { if (!selectedPending.length) { toast.error('Select at least one request'); return; } setReviewOpen(true); }}>
              {selectedPending.length > 1 ? 'Approve Missions' : 'Approve Mission'}
            </Button>
            <Button size="sm" className="w-full sm:w-auto h-[44px] gap-2 rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white cursor-pointer justify-center" onClick={() => setCreateMissionOpen(true)}>
              <Plus className="w-4 h-4" /> Create Mission
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
          <div className="overflow-x-auto">
            {pendingMissions.length === 0 ? (
              <EmptyState 
                icon={Rocket} 
                title="No Pending Missions" 
                description="There are currently no pending missions to review." 
                className="py-16"
              />
              ) : (
                <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
                  <thead className="hidden md:table-header-group">
                    <tr className="bg-muted border-b border-border">
                      <th className={cn(thClass, 'w-10')}><Checkbox checked={selectedPending.length === pendingMissions.length && pendingMissions.length > 0} onCheckedChange={toggleAll} /></th>
                      <th className={thClass}>Employee Name</th>
                      <th className={thClass}>Mission Type</th>
                      <th className={thClass}>Date Range</th>
                      <th className={thClass}>Duration</th>
                      <th className={thClass}>Notes</th>
                      <th className={cn(thClass, 'text-end')}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedPending.map(m => (
                      <tr key={m.id} className="hover:bg-muted/30 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-b-0">
                        <td className="whitespace-nowrap px-4 py-3 hidden md:table-cell"><Checkbox checked={selectedPending.includes(m.id)} onCheckedChange={() => togglePending(m.id)} /></td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 font-semibold md:font-normal">
                          <div className="flex items-center gap-2">
                            <Checkbox className="md:hidden" checked={selectedPending.includes(m.id)} onCheckedChange={() => togglePending(m.id)} />
                            <span className="text-primary font-[var(--font-weight-medium)] hover:underline cursor-pointer">{displayEmployeeName(m.name)}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Type:</span>{m.type}</td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Dates:</span>{m.range}</td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Duration:</span>{m.duration}</td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-muted-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Notes:</span>{m.notes}</td>
                        <td className="whitespace-nowrap px-4 py-3 md:text-end mt-2 md:mt-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="md:w-auto w-full justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer md:bg-transparent md:border-0 md:p-1.5 md:hover:bg-muted"><span className="md:hidden">Actions</span><MoreVertical className="hidden md:block w-4 h-4 text-muted-foreground" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setViewDetailData(m); setViewDetailOpen(true); }}><Eye className="w-4 h-4" /> View Details</DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setSelectedPending([m.id]); setReviewOpen(true); }}><Check className="w-4 h-4" /> Approve Mission</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive" className="cursor-pointer gap-2" onClick={() => { setDeclineData(m); setDeclineOpen(true); }}><X className="w-4 h-4" /> Decline</DropdownMenuItem>
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

      {/* ══ Missions History ══ */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Missions History</h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1 max-w-md space-y-1">
            <label htmlFor="mission-history-search" className={labelClass}>Search Employee</label>
            <div className="flex items-center gap-2">
              <form role="search" onSubmit={(e) => e.preventDefault()} className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <input id="mission-history-search" type="search" value={historySearch} onChange={e => setHistorySearch(e.target.value)} placeholder="Search by name or Employee#..." className={cn(inputClass, 'ps-10')} autoComplete="search" />
              </form>
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <button type="button" aria-label="Open history filters" className={cn('relative h-10 px-3 border rounded-[var(--radius-input)] bg-card hover:bg-muted transition-colors cursor-pointer flex items-center', activeFilters > 0 ? 'border-primary text-primary' : 'border-border text-muted-foreground')}>
                    <Filter className="w-4 h-4" />
                    {activeFilters > 0 && <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">{activeFilters}</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" collisionPadding={16} className="w-80 p-0">
                  <FilterPanel
                    dept={filterDept} setDept={setFilterDept}
                    missionType={filterMissionType} setMissionType={setFilterMissionType}
                    from={filterFrom} setFrom={setFilterFrom} to={filterTo} setTo={setFilterTo}
                    activityTypes={filterActivityTypes} toggleActivity={t => setFilterActivityTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                    employmentTypes={filterEmploymentTypes} toggleEmployment={t => setFilterEmploymentTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                    departmentOptions={departmentOptions}
                    missionTypeOptions={missionTypeOptions}
                    activityTypeOptions={activityTypeOptions}
                    employmentTypeOptions={employmentTypeOptions}
                    onApply={applyFilters} onClear={clearFilters} onClose={() => setFilterOpen(false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 rounded-[var(--radius-button)] border-border" onClick={() => {
            exportToCSV(filteredHistory, 'Missions_History');
            toast.success('Download started', { description: 'Missions data exported to CSV.' });
          }}>
            <Download className="w-4 h-4" /> Download Data
          </Button>
        </div>

        <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
          <div className="overflow-x-auto">
            {historyMissions.length === 0 ? (
              <EmptyState 
                icon={Rocket} 
                title="No Mission History" 
                description="There are no past missions matching your criteria." 
                className="py-16"
              />
            ) : (
              <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-muted border-b border-border">
                    <th className={thClass}>Employee Name</th>
                    <th className={thClass}>Mission Type</th>
                    <th className={thClass}>Date Range</th>
                    <th className={thClass}>Duration</th>
                    <th className={thClass}>Notes</th>
                    <th className={thClass}>Status</th>
                    <th className={cn(thClass, 'text-end')}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedHistory.map(m => (
                    <tr key={m.id} className="hover:bg-muted/30 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-b-0">
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 font-semibold md:font-normal">
                        <span className="text-primary font-[var(--font-weight-medium)] hover:underline cursor-pointer">{displayEmployeeName(m.name)}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Type:</span>{m.type}</td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Dates:</span>{m.range}</td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Duration:</span>{m.duration}</td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3 text-muted-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Notes:</span>{m.notes}</td>
                      <td className="whitespace-nowrap px-4 py-1 md:py-3"><span className="md:hidden text-muted-foreground me-2 font-medium">Status:</span><StatusBadge variant={m.status as any}>{m.status === 'approved' ? 'Approved' : 'Rejected'}</StatusBadge></td>
                      <td className="whitespace-nowrap px-4 py-3 md:text-end mt-2 md:mt-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="md:w-auto w-full justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer md:bg-transparent md:border-0 md:p-1.5 md:hover:bg-muted"><span className="md:hidden">Actions</span><MoreVertical className="hidden md:block w-4 h-4 text-muted-foreground" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setViewDetailData(m); setViewDetailOpen(true); }}><Eye className="w-4 h-4" /> View Details</DropdownMenuItem>
                            {m.status === 'approved' && <><DropdownMenuSeparator /><DropdownMenuItem variant="destructive" className="cursor-pointer gap-2" onClick={() => { setDeleteData(m); setDeleteOpen(true); }}><Trash2 className="w-4 h-4" /> Delete Mission</DropdownMenuItem></>}
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

      {/* Create Mission */}
      <CreateMissionModal 
        open={createMissionOpen} 
        onOpenChange={setCreateMissionOpen} 
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
            await MissionService.create({
              ...data,
              employeeId: matchingEmployee.id
            });
            await loadMissions();
            setCreateMissionOpen(false);
            toast.success('Mission request created successfully');
          } catch (e) {
            console.error(e);
            toast.error('Failed to create mission request', { description: getErrorMessage(e) });
          }
        }}
      />

      {/* Review Selected */}
      <ReviewSelectedModal
        open={reviewOpen} onOpenChange={setReviewOpen}
        items={pendingMissions.filter(m => selectedPending.includes(m.id))}
        onApprove={() => { setReviewOpen(false); setConfirmApprovalOpen(true); }}
      />

      {/* Confirm Approval */}
      <ConfirmDialog open={confirmApprovalOpen} onOpenChange={setConfirmApprovalOpen}
        title="Confirm Approval" message={`You are approving ${selectedPending.length} mission request(s). This action cannot be undone.`}
        confirmLabel="Confirm" cancelLabel="Cancel"
        onConfirm={async () => {
          try {
            for (const id of selectedPending) {
              await MissionService.updateStatus(id, 'approved');
            }
            await loadMissions();
            setConfirmApprovalOpen(false);
            setSelectedPending([]);
            toast.success(`${selectedPending.length} mission(s) approved successfully`);
          } catch (e) {
            toast.error('Failed to approve selected mission requests');
          }
        }}
      />

      {/* View Detail */}
      <ViewMissionDetailModal open={viewDetailOpen} onOpenChange={setViewDetailOpen} mission={viewDetailData} />

      {/* Decline */}
      <ConfirmDialog open={declineOpen} onOpenChange={setDeclineOpen}
        title="Decline Mission" message={<>You are declining <strong>{displayEmployeeName(declineData?.name)}</strong>'s {declineData?.type?.toLowerCase()} mission from <strong>{declineData?.range}</strong>. This action is permanent.</>}
        confirmLabel="Decline" cancelLabel="Cancel" variant="destructive"
        onConfirm={async () => {
          try {
            if (declineData) {
              await MissionService.updateStatus(declineData.id, 'rejected');
              await loadMissions();
            }
            setDeclineOpen(false);
            toast.success(`${displayEmployeeName(declineData?.name)}'s mission declined`);
          } catch (e) {
            toast.error('Failed to decline mission');
          }
        }}
      />

      {/* Delete */}
      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen}
        title="Delete Mission" message={<>You are deleting <strong>{displayEmployeeName(deleteData?.name)}</strong>'s mission from <strong>{deleteData?.range}</strong>. This action cannot be undone.</>}
        confirmLabel="Confirm" cancelLabel="Cancel" variant="destructive"
        onConfirm={() => { setDeleteOpen(false); toast.success(`Mission deleted successfully`); }}
      />
    </div>
  );
};

// ════════════════════════════════════
// ── Sub-components ──
// ════════════════════════════════════

const TablePagination: React.FC<{ page: number; setPage: (p: number) => void; totalPages: number; totalItems: number }> = ({ page, setPage, totalPages, totalItems }) => {
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


const FilterPanel: React.FC<{
  dept: string; setDept: (v: string) => void;
  missionType: string; setMissionType: (v: string) => void;
  from: string; setFrom: (v: string) => void; to: string; setTo: (v: string) => void;
  activityTypes: string[]; toggleActivity: (v: string) => void;
  employmentTypes: string[]; toggleEmployment: (v: string) => void;
  departmentOptions: string[];
  missionTypeOptions: string[];
  activityTypeOptions: string[];
  employmentTypeOptions: string[];
  onApply: () => void; onClear: () => void; onClose: () => void;
}> = ({ dept, setDept, missionType, setMissionType, from, setFrom, to, setTo, activityTypes, toggleActivity, employmentTypes, toggleEmployment, departmentOptions, missionTypeOptions, activityTypeOptions, employmentTypeOptions, onApply, onClear, onClose }) => {
  const fromId = React.useId();
  const toId = React.useId();

  return (
    <div className="p-4 space-y-4 max-h-[var(--radix-popover-content-available-height,480px)] overflow-y-auto">
      <div className="flex items-center justify-between">
        <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Search Options</span>
        <button type="button" aria-label="Close filters" onClick={onClose} className="p-1 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer"><X className="w-4 h-4 text-muted-foreground" /></button>
      </div>
      <SelectField label="Department" value={dept} onChange={setDept} options={departmentOptions} />
      <SelectField label="Mission Type" value={missionType} onChange={setMissionType} options={missionTypeOptions.length > 1 ? missionTypeOptions : ['All', ...MISSION_TYPES]} />
      <div className="space-y-1"><label htmlFor={fromId} className={labelClass}>From</label><DatePicker id={fromId} value={from} onChange={setFrom} placeholder="Select from date" /></div>
      <div className="space-y-1"><label htmlFor={toId} className={labelClass}>To</label><DatePicker id={toId} value={to} onChange={setTo} placeholder="Select to date" /></div>
      <CheckboxGroup label="Activity Type" items={activityTypeOptions.length ? activityTypeOptions : ACTIVITY_TYPES} selected={activityTypes} toggle={toggleActivity} />
      <CheckboxGroup label="Employment Type" items={employmentTypeOptions.length ? employmentTypeOptions : EMPLOYMENT_TYPES} selected={employmentTypes} toggle={toggleEmployment} />
      <div className="space-y-2 pt-2">
        <Button onClick={onApply} className="w-full rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white">Apply Filter</Button>
        <Button variant="outline" onClick={onClear} className="w-full rounded-[var(--radius-button)] border-border">Clear Filter</Button>
      </div>
    </div>
  );
};

const SelectField: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: string[] }> = ({ label, value, onChange, options }) => {
  const id = React.useId();
  return (
  <div className="space-y-1">
    <label htmlFor={id} className={labelClass}>{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="h-10 rounded-[var(--radius-input)] border-border" aria-label={label}><SelectValue /></SelectTrigger>
      <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  </div>
  );
};

const CheckboxGroup: React.FC<{ label: string; items: string[]; selected: string[]; toggle: (v: string) => void }> = ({ label, items, selected, toggle }) => (
  <fieldset className="space-y-2 border-0 p-0 m-0">
    <legend className={labelClass}>{label}</legend>
    <div className="space-y-2">{items.map(item => (
      <label key={item} className="flex items-center gap-2.5 cursor-pointer group">
        <Checkbox aria-label={`${selected.includes(item) ? 'Remove' : 'Add'} ${item} filter`} checked={selected.includes(item)} onCheckedChange={() => toggle(item)} />
        <span className="text-[var(--text-sm)] text-foreground group-hover:text-primary transition-colors font-[var(--font-weight-normal)]">{item}</span>
      </label>
    ))}</div>
  </fieldset>
);

const CreateMissionModal: React.FC<{ 
  open: boolean; 
  onOpenChange: (v: boolean) => void;
  onSave: (data: { name: string; employeeNumber: string; type: string; range: string; duration: string; notes: string; reason: string; startDate: string; endDate: string }) => void;
}> = ({ open, onOpenChange, onSave }) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;

  const [name, setName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [missionType, setMissionType] = useState(MISSION_TYPES[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

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
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Create Mission</DialogTitle><DialogDescription className="sr-only">Create a new mission request</DialogDescription></DialogHeader>
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
              placeholder="123456"
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

          <SelectField label="Mission Type" value={missionType} onChange={setMissionType} options={MISSION_TYPES} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Start Date" value={startDate} onChange={setStartDate} type="date" />
            <FormField label="End Date" value={endDate} onChange={setEndDate} type="date" />
          </div>
          <div className="space-y-1"><label className={labelClass}>Reason</label><textarea dir="auto" value={reason} onChange={e => setReason(e.target.value)} rows={3} className={cn(inputClass, 'h-auto py-2')} placeholder="Describe the reason..." /></div>
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
              type: missionType,
              range: `${startDate} - ${endDate}`,
              duration: `${diffDays} days`,
              notes: reason,
              reason: reason,
              startDate,
              endDate
            });
          }}>Create Mission</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ReviewSelectedModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; items: MissionRequest[]; onApprove: () => void }> = ({ open, onOpenChange, items, onApprove }) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Review Selected Requests</DialogTitle><DialogDescription className="sr-only">Review and approve selected mission requests</DialogDescription></DialogHeader>
          <div className="border border-border rounded-[var(--radius)] overflow-x-auto bg-card mt-2 shadow-[var(--elevation-sm)]">
            <table className="w-full md:min-w-max text-[var(--text-sm)]">
            <thead><tr className="bg-muted border-b border-border">
              <th className={thClass}>Employee Name</th><th className={thClass}>Mission Type</th><th className={thClass}>Date Range</th><th className={thClass}>Duration</th><th className={thClass}>Notes</th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {items.map(m => (
                <tr key={m.id} className="hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-3"><span className="text-foreground font-[var(--font-weight-medium)]">{localizePersonName(m.name, language)}</span></td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{m.type}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{m.range}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{m.duration}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{m.notes}</td>
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

const ViewMissionDetailModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; mission: MissionRequest | null }> = ({ open, onOpenChange, mission }) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const [detailTab, setDetailTab] = useState<'details' | 'history'>('details');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Mission Details</DialogTitle><DialogDescription className="sr-only">Mission request details</DialogDescription></DialogHeader>
        {mission && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-[var(--radius)]">
              <div><p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">{localizePersonName(mission.name, language)}</p><p className="text-[var(--text-xs)] text-muted-foreground">{mission.employeeNumber || '00000'}</p></div>
            </div>
            <div className="flex border-b border-border gap-4">
              <button onClick={() => setDetailTab('details')} className={cn('border-b-2 border-transparent pb-2 text-[var(--text-sm)] cursor-pointer transition-colors', detailTab === 'details' ? 'border-accent text-accent font-[var(--font-weight-semibold)]' : 'text-muted-foreground hover:text-foreground')}>Details</button>
              <button onClick={() => setDetailTab('history')} className={cn('border-b-2 border-transparent pb-2 text-[var(--text-sm)] cursor-pointer transition-colors', detailTab === 'history' ? 'border-accent text-accent font-[var(--font-weight-semibold)]' : 'text-muted-foreground hover:text-foreground')}>History</button>
            </div>
            {detailTab === 'details' && (
              <div className="space-y-3 text-[var(--text-sm)]">
                <InfoRow label="Mission Type" value={mission.type} />
                <InfoRow label="Date Range" value={mission.range} />
                <InfoRow label="Duration" value={mission.duration} />
                <InfoRow label="Reason" value={mission.reason || mission.notes} />
                {mission.status && <InfoRow label="Status" value={mission.status.charAt(0).toUpperCase() + mission.status.slice(1)} />}
              </div>
            )}
            {detailTab === 'history' && (
              <div className="space-y-3 text-[var(--text-sm)]">
                <InfoRow label="Submitted" value="January 4, 2026" />
                <InfoRow label="Reviewed by" value="Muhammed Habib" />
                <InfoRow label="Decision" value={mission.status === 'approved' ? 'Approved' : 'Pending'} />
                <InfoRow label="Decision Date" value="January 5, 2026" />
              </div>
            )}
          </div>
        )}
        <DialogFooter className="pt-2"><Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)] border-border">Close</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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

const FormField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }> = ({ label, value, onChange, placeholder, type = 'text' }) => {
  const id = React.useId();
  return (
    <div className="space-y-1"><label htmlFor={id} className={labelClass}>{label}</label>{type === 'date' ? <DatePicker id={id} value={value} onChange={onChange} placeholder={placeholder} aria-label={label} /> : <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputClass} autoComplete="off" />}</div>
  );
};
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex gap-3"><span className="text-muted-foreground w-28 shrink-0 font-[var(--font-weight-medium)]">{label}:</span><span className="text-foreground">{value}</span></div>
);
