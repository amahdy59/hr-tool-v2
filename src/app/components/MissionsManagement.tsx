import React, { useState } from 'react';
import {
  MoreVertical, Download, Plus, Search, Filter,
  Info, Eye, ChevronLeft, ChevronRight, X, Check, Trash2,
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
import { ImageWithFallback } from './figma/ImageWithFallback';
import { StatusBadge } from './StatusBadge';
import { toast } from 'sonner';

// ── Shared styles ──
const inputClass = 'w-full h-10 px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const labelClass = 'text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground';
const thClass = 'px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-[var(--text-sm)]';

// ── Types ──
interface MissionRequest {
  id: string;
  name: string;
  img: string;
  type: string;
  range: string;
  duration: string;
  notes: string;
  status?: string;
  employeeNumber?: string;
  reason?: string;
}

// ── Mock Data ──
const MISSION_TYPES = ['Work From Home', 'Visa Issuing', 'Client Visit', 'Training', 'Conference'];

const PENDING_MISSIONS: MissionRequest[] = [
  { id: '1', name: 'Sara Abdallah', employeeNumber: '49201', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', type: 'Work From Home', range: 'Sep 10 - Sep 14', duration: '5 days', notes: 'Remote work for project', reason: 'Project deadline requires focus time' },
  { id: '2', name: 'Vinay Ansari', employeeNumber: '31245', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', type: 'Work From Home', range: 'Oct 5 - Oct 12', duration: '8 days', notes: 'Personal reasons', reason: 'Working remotely for personal convenience' },
  { id: '3', name: 'Sara Kasongo', employeeNumber: '20124', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop', type: 'Client Visit', range: 'Nov 3 - Nov 6', duration: '4 days', notes: 'Client site visit', reason: 'On-site client requirements review' },
  { id: '4', name: 'María Fernanda', employeeNumber: '55102', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', type: 'Training', range: 'Dec 20 - Jan 2', duration: '14 days', notes: 'Professional training', reason: 'Advanced cybersecurity certification' },
  { id: '5', name: 'Luka Silva', employeeNumber: '12098', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', type: 'Visa Issuing', range: 'Jan 15 - Jan 17', duration: '3 days', notes: 'Visa appointment', reason: 'Travel visa processing' },
];

const HISTORY_MISSIONS: MissionRequest[] = [
  { id: '1', name: 'Sara Abdallah', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', type: 'Work From Home', range: 'Sep 10 - Sep 14', duration: '5 days', notes: 'Remote sprint work', status: 'approved' },
  { id: '2', name: 'Priyanka Ram', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', type: 'Work From Home', range: 'Oct 5 - Oct 12', duration: '8 days', notes: 'Personal convenience', status: 'approved' },
  { id: '3', name: 'Natalia Díaz', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop', type: 'Client Visit', range: 'Nov 3 - Nov 6', duration: '4 days', notes: 'Client requirements', status: 'approved' },
  { id: '4', name: 'Jay Gupta', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', type: 'Visa Issuing', range: 'Dec 20 - Jan 2', duration: '14 days', notes: 'Visa processing', status: 'rejected' },
  { id: '5', name: 'Charles Brown', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', type: 'Work From Home', range: 'Jan 15 - Jan 17', duration: '3 days', notes: 'Remote work', status: 'rejected' },
];

const DEPARTMENTS = ['All', 'Marketing', 'Software', 'Oil & Gas', 'Sales', 'SCADA', 'IT', 'Finance', 'HR'];
const ACTIVITY_TYPES = ['My team', 'Lead Engineer', 'Application Consultant', 'Project Manager'];
const EMPLOYMENT_TYPES = ['Direct (SE)', 'InDirect (non SE)'];

export const MissionsManagement: React.FC = () => {
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
  const toggleAll = () => setSelectedPending(p => p.length === PENDING_MISSIONS.length ? [] : PENDING_MISSIONS.map(m => m.id));

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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-10">
      {/* ══ Pending Approval ══ */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--page-title-size)', fontWeight: 'var(--page-title-weight)' }} className="text-foreground">Missions Pending Approval</h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1 max-w-md space-y-1.5">
            <div className="flex items-center gap-2">
              <label className={labelClass}>Search Employee</label>
              <Tooltip><TooltipTrigger asChild><button className="cursor-pointer"><Info className="w-4 h-4 text-primary" /></button></TooltipTrigger><TooltipContent side="top" className="text-[var(--text-xs)]"><p>Search by name or Employee number</p></TooltipContent></Tooltip>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={pendingSearch} onChange={e => setPendingSearch(e.target.value)} placeholder="Search by name or Employee#..." className={cn(inputClass, 'pl-10')} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 rounded-[var(--radius-button)] border-border" onClick={() => { if (!selectedPending.length) { toast.error('Select at least one request'); return; } setReviewOpen(true); }}>
              Approve
            </Button>
            <Button size="sm" className="gap-2 rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => setCreateMissionOpen(true)}>
              <Plus className="w-4 h-4" /> Create Mission
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
          <div className="overflow-x-auto">
            <table className="w-full text-[var(--text-sm)] text-left">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className={cn(thClass, 'w-10')}><Checkbox checked={selectedPending.length === PENDING_MISSIONS.length && PENDING_MISSIONS.length > 0} onCheckedChange={toggleAll} /></th>
                  <th className={thClass}>Employee Name</th>
                  <th className={thClass}>Mission Type</th>
                  <th className={thClass}>Date Range</th>
                  <th className={thClass}>Duration</th>
                  <th className={thClass}>Notes</th>
                  <th className={cn(thClass, 'text-right')}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PENDING_MISSIONS.map(m => (
                  <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><Checkbox checked={selectedPending.includes(m.id)} onCheckedChange={() => togglePending(m.id)} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0"><ImageWithFallback src={m.img} alt={m.name} className="w-full h-full object-cover" /></div>
                        <span className="text-primary font-[var(--font-weight-medium)] hover:underline cursor-pointer">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{m.type}</td>
                    <td className="px-4 py-3 text-foreground">{m.range}</td>
                    <td className="px-4 py-3 text-foreground">{m.duration}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.notes}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><button className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setViewDetailData(m); setViewDetailOpen(true); }}><Eye className="w-4 h-4" /> View Details</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setSelectedPending([m.id]); setReviewOpen(true); }}><Check className="w-4 h-4" /> Approve</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" className="cursor-pointer gap-2" onClick={() => { setDeclineData(m); setDeclineOpen(true); }}><X className="w-4 h-4" /> Decline</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination page={pendingPage} setPage={setPendingPage} totalPages={2} />
        </div>
      </section>

      {/* ══ Missions History ══ */}
      <section className="space-y-4">
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Missions History</h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1 max-w-md space-y-1.5">
            <label className={labelClass}>Search Employee</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={historySearch} onChange={e => setHistorySearch(e.target.value)} placeholder="Search by name or Employee#..." className={cn(inputClass, 'pl-10')} />
              </div>
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <button className={cn('relative h-10 px-3 border rounded-[var(--radius-input)] bg-card hover:bg-muted transition-colors cursor-pointer flex items-center', activeFilters > 0 ? 'border-primary text-primary' : 'border-border text-muted-foreground')}>
                    <Filter className="w-4 h-4" />
                    {activeFilters > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">{activeFilters}</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <FilterPanel
                    dept={filterDept} setDept={setFilterDept}
                    missionType={filterMissionType} setMissionType={setFilterMissionType}
                    from={filterFrom} setFrom={setFilterFrom} to={filterTo} setTo={setFilterTo}
                    activityTypes={filterActivityTypes} toggleActivity={t => setFilterActivityTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                    employmentTypes={filterEmploymentTypes} toggleEmployment={t => setFilterEmploymentTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                    onApply={applyFilters} onClear={clearFilters} onClose={() => setFilterOpen(false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 rounded-[var(--radius-button)] border-border" onClick={() => toast.success('Download started', { description: 'Missions data exported to CSV.' })}>
            <Download className="w-4 h-4" /> Download Data
          </Button>
        </div>

        <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
          <div className="overflow-x-auto">
            <table className="w-full text-[var(--text-sm)] text-left">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className={thClass}>Employee Name</th>
                  <th className={thClass}>Mission Type</th>
                  <th className={thClass}>Date Range</th>
                  <th className={thClass}>Duration</th>
                  <th className={thClass}>Notes</th>
                  <th className={thClass}>Status</th>
                  <th className={cn(thClass, 'text-right')}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {HISTORY_MISSIONS.map(m => (
                  <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0"><ImageWithFallback src={m.img} alt={m.name} className="w-full h-full object-cover" /></div>
                        <span className="text-foreground font-[var(--font-weight-medium)]">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{m.type}</td>
                    <td className="px-4 py-3 text-foreground">{m.range}</td>
                    <td className="px-4 py-3 text-foreground">{m.duration}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.notes}</td>
                    <td className="px-4 py-3"><StatusBadge variant={m.status as any}>{m.status === 'approved' ? 'Approved' : 'Rejected'}</StatusBadge></td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><button className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setViewDetailData(m); setViewDetailOpen(true); }}><Eye className="w-4 h-4" /> View Details</DropdownMenuItem>
                          {m.status === 'approved' && <><DropdownMenuSeparator /><DropdownMenuItem variant="destructive" className="cursor-pointer gap-2" onClick={() => { setDeleteData(m); setDeleteOpen(true); }}><Trash2 className="w-4 h-4" /> Delete Mission</DropdownMenuItem></>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination page={historyPage} setPage={setHistoryPage} totalPages={3} />
        </div>
      </section>

      {/* ═══ MODALS ═══ */}

      {/* Create Mission */}
      <CreateMissionModal open={createMissionOpen} onOpenChange={setCreateMissionOpen} />

      {/* Review Selected */}
      <ReviewSelectedModal
        open={reviewOpen} onOpenChange={setReviewOpen}
        items={PENDING_MISSIONS.filter(m => selectedPending.includes(m.id))}
        onApprove={() => { setReviewOpen(false); setConfirmApprovalOpen(true); }}
      />

      {/* Confirm Approval */}
      <ConfirmDialog open={confirmApprovalOpen} onOpenChange={setConfirmApprovalOpen}
        title="Confirm Approval" message={`You are approving ${selectedPending.length} mission request(s). This action cannot be undone.`}
        confirmLabel="Confirm" cancelLabel="Cancel"
        onConfirm={() => { setConfirmApprovalOpen(false); setSelectedPending([]); toast.success(`${selectedPending.length} mission(s) approved successfully`); }}
      />

      {/* View Detail */}
      <ViewMissionDetailModal open={viewDetailOpen} onOpenChange={setViewDetailOpen} mission={viewDetailData} />

      {/* Decline */}
      <ConfirmDialog open={declineOpen} onOpenChange={setDeclineOpen}
        title="Decline Mission" message={<>You are declining <strong>{declineData?.name}</strong>'s {declineData?.type?.toLowerCase()} mission from <strong>{declineData?.range}</strong>. This action is permanent.</>}
        confirmLabel="Decline" cancelLabel="Cancel" variant="destructive"
        onConfirm={() => { setDeclineOpen(false); toast.success(`${declineData?.name}'s mission declined`); }}
      />

      {/* Delete */}
      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen}
        title="Delete Mission" message={<>You are deleting <strong>{deleteData?.name}</strong>'s mission from <strong>{deleteData?.range}</strong>. This action cannot be undone.</>}
        confirmLabel="Confirm" cancelLabel="Cancel" variant="destructive"
        onConfirm={() => { setDeleteOpen(false); toast.success(`Mission deleted successfully`); }}
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
    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
      <div className="flex items-center gap-2 text-[var(--text-sm)] text-muted-foreground">
        Items Per Page
        <select className="h-8 px-2 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] outline-none cursor-pointer" defaultValue="15"><option>10</option><option>15</option><option>30</option></select>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => go(page - 1)} disabled={page <= 1} className="p-1.5 border border-border rounded-[var(--radius-sm)] hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4 text-foreground" /></button>
        <span className="text-[var(--text-sm)] text-foreground flex items-center gap-1">Page <input type="text" value={pi} onChange={e => setPi(e.target.value)} onBlur={() => go(Number(pi) || 1)} onKeyDown={e => e.key === 'Enter' && go(Number(pi) || 1)} className="w-10 h-8 text-center border border-border rounded-[var(--radius-input)] bg-input-background text-foreground focus:ring-2 focus:ring-ring/50 outline-none text-[var(--text-sm)]" /> of {totalPages}</span>
        <button onClick={() => go(page + 1)} disabled={page >= totalPages} className="p-1.5 border border-border rounded-[var(--radius-sm)] hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"><ChevronRight className="w-4 h-4 text-foreground" /></button>
      </div>
    </div>
  );
};

const FilterPanel: React.FC<{
  dept: string; setDept: (v: string) => void;
  missionType: string; setMissionType: (v: string) => void;
  from: string; setFrom: (v: string) => void; to: string; setTo: (v: string) => void;
  activityTypes: string[]; toggleActivity: (v: string) => void;
  employmentTypes: string[]; toggleEmployment: (v: string) => void;
  onApply: () => void; onClear: () => void; onClose: () => void;
}> = ({ dept, setDept, missionType, setMissionType, from, setFrom, to, setTo, activityTypes, toggleActivity, employmentTypes, toggleEmployment, onApply, onClear, onClose }) => (
  <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
    <div className="flex items-center justify-between">
      <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Search Options</span>
      <button onClick={onClose} className="p-1 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer"><X className="w-4 h-4 text-muted-foreground" /></button>
    </div>
    <SelectField label="Department" value={dept} onChange={setDept} options={DEPARTMENTS} />
    <SelectField label="Mission Type" value={missionType} onChange={setMissionType} options={['All', ...MISSION_TYPES]} />
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

const CreateMissionModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const [name, setName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [missionType, setMissionType] = useState(MISSION_TYPES[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Create Mission</DialogTitle><DialogDescription className="sr-only">Create a new mission request</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <FormField label="Employee Name" value={name} onChange={setName} placeholder="Full name" />
          <FormField label="Employee Number" value={employeeNumber} onChange={setEmployeeNumber} placeholder="123456" />
          <SelectField label="Mission Type" value={missionType} onChange={setMissionType} options={MISSION_TYPES} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Start Date" value={startDate} onChange={setStartDate} type="date" />
            <FormField label="End Date" value={endDate} onChange={setEndDate} type="date" />
          </div>
          <div className="space-y-1.5"><label className={labelClass}>Reason</label><textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className={cn(inputClass, 'h-auto py-2')} placeholder="Describe the reason..." /></div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => { onOpenChange(false); toast.success('Mission created successfully'); }}>Create Mission</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ReviewSelectedModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; items: MissionRequest[]; onApprove: () => void }> = ({ open, onOpenChange, items, onApprove }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Review Selected Requests</DialogTitle><DialogDescription className="sr-only">Review and approve selected mission requests</DialogDescription></DialogHeader>
      <div className="border border-border rounded-[var(--radius-card)] overflow-hidden">
        <table className="w-full text-[var(--text-sm)]">
          <thead><tr className="bg-muted border-b border-border">
            <th className={thClass}>Employee Name</th><th className={thClass}>Mission Type</th><th className={thClass}>Date Range</th><th className={thClass}>Duration</th><th className={thClass}>Notes</th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {items.map(m => (
              <tr key={m.id} className="hover:bg-muted/30">
                <td className="px-4 py-2.5"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full overflow-hidden border border-border shrink-0"><ImageWithFallback src={m.img} alt={m.name} className="w-full h-full object-cover" /></div><span className="text-foreground font-[var(--font-weight-medium)]">{m.name}</span></div></td>
                <td className="px-4 py-2.5 text-foreground">{m.type}</td>
                <td className="px-4 py-2.5 text-foreground">{m.range}</td>
                <td className="px-4 py-2.5 text-foreground">{m.duration}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{m.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DialogFooter className="pt-4 gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">Cancel</Button>
        <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={onApprove}>Approve All ({items.length})</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const ViewMissionDetailModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; mission: MissionRequest | null }> = ({ open, onOpenChange, mission }) => {
  const [detailTab, setDetailTab] = useState<'details' | 'history'>('details');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Mission Details</DialogTitle><DialogDescription className="sr-only">Mission request details</DialogDescription></DialogHeader>
        {mission && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-[var(--radius)]">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-border shrink-0"><ImageWithFallback src={mission.img} alt={mission.name} className="w-full h-full object-cover" /></div>
              <div><p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">{mission.name}</p><p className="text-[var(--text-xs)] text-muted-foreground">{mission.employeeNumber || '00000'}</p></div>
            </div>
            <div className="flex border-b border-border gap-4">
              <button onClick={() => setDetailTab('details')} className={cn('pb-2 text-[var(--text-sm)] cursor-pointer transition-colors', detailTab === 'details' ? 'border-b-2 border-primary text-primary font-[var(--font-weight-medium)]' : 'text-muted-foreground hover:text-foreground')}>Details</button>
              <button onClick={() => setDetailTab('history')} className={cn('pb-2 text-[var(--text-sm)] cursor-pointer transition-colors', detailTab === 'history' ? 'border-b-2 border-primary text-primary font-[var(--font-weight-medium)]' : 'text-muted-foreground hover:text-foreground')}>History</button>
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
        <DialogFooter className="pt-2"><Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">Close</Button></DialogFooter>
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
        <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border">{cancelLabel}</Button>
        <Button variant={variant === 'destructive' ? 'destructive' : 'default'} className={cn('rounded-[var(--radius-button)]', variant !== 'destructive' && 'bg-chart-3 hover:bg-chart-3/90 text-white')} onClick={onConfirm}>{confirmLabel}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const FormField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="space-y-1.5"><label className={labelClass}>{label}</label>{type === 'date' ? <DatePicker value={value} onChange={onChange} placeholder={placeholder} /> : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />}</div>
);
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex gap-3"><span className="text-muted-foreground w-28 shrink-0 font-[var(--font-weight-medium)]">{label}:</span><span className="text-foreground">{value}</span></div>
);