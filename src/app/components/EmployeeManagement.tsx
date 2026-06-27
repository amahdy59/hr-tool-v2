import React, { useMemo, useState } from 'react';
import {
  MoreVertical,
  Download,
  Plus,
  Search,
  Filter,
  Info,
  Edit,
  Trash2,
  CreditCard,
  UserX,
  Eye,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  FileText,
  PenLine,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { DatePicker } from './ui/date-picker';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
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
import { toast } from 'sonner';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';
import { exportToCSV } from '../../lib/export';
import { useTranslation } from 'react-i18next';
import { localizePersonName } from '@/lib/localizedNames';

import { Employee, EmployeeService } from '../../lib/services/dbServices';

// ── Types ──
interface ActivityEntry {
  id: string;
  admin: string;
  action: string;
  date: string;
  affectedCount: number;
  affectedEmployeeNumber: string;
}

interface ActivityEntry {
  id: string;
  admin: string;
  action: string;
  date: string;
  affectedCount: number;
  affectedEmployeeNumber: string;
}

interface Department {
  id: string;
  name: string;
  deptId: string;
  totalNumber: number;
}

interface JobTitle {
  id: string;
  title: string;
  count: number;
}

interface AccessCard {
  id: string;
  cardNumber: string;
  startDate: string;
  endDate: string;
  cardType: string;
  status: 'Active' | 'Expired' | 'Suspended';
}

// Note: EMPLOYEES array replaced by dynamic database service calls.

const ACTIVITY_LOG: ActivityEntry[] = [
  { id: '1', admin: 'Muhammed Habib', action: 'Edited Employee Info', date: 'February 25, 2013', affectedCount: 2, affectedEmployeeNumber: '12345' },
  { id: '2', admin: 'Lena Mohamed', action: 'Terminated Employee', date: 'April 25, 2011', affectedCount: 1, affectedEmployeeNumber: '54321' },
  { id: '3', admin: 'Mohammed Habib', action: 'Added New Employee', date: 'January 4, 2014', affectedCount: 3, affectedEmployeeNumber: '98765' },
  { id: '4', admin: 'Mohammed Habib', action: 'Edited Access Card Details', date: 'January 4, 2014', affectedCount: 1, affectedEmployeeNumber: '98765' },
];

const DEPARTMENTS: Department[] = [
  { id: '1', name: 'Marketing', deptId: 'D1001', totalNumber: 23 },
  { id: '2', name: 'Software', deptId: 'D1002', totalNumber: 45 },
  { id: '3', name: 'Oil & Gas', deptId: 'D1003', totalNumber: 31 },
  { id: '4', name: 'Sales', deptId: 'D1004', totalNumber: 18 },
  { id: '5', name: 'SCADA', deptId: 'D1005', totalNumber: 12 },
];

const JOB_TITLES: JobTitle[] = [
  { id: '1', title: 'Cybersecurity Engineer', count: 5 },
  { id: '2', title: 'Software Developer', count: 12 },
  { id: '3', title: 'Senior Product Manager', count: 3 },
  { id: '4', title: 'Solutions Architect', count: 7 },
];

const DEPARTMENTS_LIST = ['Marketing', 'Software', 'Oil & Gas', 'Sales', 'SCADA', 'IT', 'Finance', 'HR', 'Engineering'];
const JOB_TITLES_LIST = ['Senior Solutions Architect', 'Global Operations Manager', 'Senior Project Manager', 'Cybersecurity Specialist', 'Director of Supply Chain Optimization', 'Software Developer', 'Engineer'];
const ACTIVITY_TYPES = ['Direct', 'InDirect'];
const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contractor', 'Intern'];

// ── Shared input style ──
const inputClass = "w-full h-[44px] px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] text-start focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow";
const labelClass = "block text-start text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground";
const includesQuery = (values: Array<string | number>, query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return values.some((value) => String(value).toLowerCase().includes(normalized));
};

// ── Main Component ──
export const EmployeeManagement: React.FC = () => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const [activeSubTab, setActiveSubTab] = useState('directory');

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [filterTitle, setFilterTitle] = useState('All');
  const [filterGradYear, setFilterGradYear] = useState('');
  const [filterHiredAfter, setFilterHiredAfter] = useState('');
  const [filterActivityTypes, setFilterActivityTypes] = useState<string[]>([]);
  const [filterEmploymentTypes, setFilterEmploymentTypes] = useState<string[]>([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Employee CRUD modals
  const [addEmpOpen, setAddEmpOpen] = useState(false);
  const [editEmpOpen, setEditEmpOpen] = useState(false);
  const [editEmpData, setEditEmpData] = useState<Employee | null>(null);
  const [addFormerOpen, setAddFormerOpen] = useState(false);
  const [accessCardsOpen, setAccessCardsOpen] = useState(false);
  const [accessCardEmp, setAccessCardEmp] = useState<Employee | null>(null);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [terminateEmp, setTerminateEmp] = useState<Employee | null>(null);
  const [activityLogDetailOpen, setActivityLogDetailOpen] = useState(false);
  const [activityLogDetail, setActivityLogDetail] = useState<ActivityEntry | null>(null);

  // Department CRUD
  const [deptSearch, setDeptSearch] = useState('');
  const [addDeptOpen, setAddDeptOpen] = useState(false);
  const [editDeptOpen, setEditDeptOpen] = useState(false);
  const [editDeptData, setEditDeptData] = useState<Department | null>(null);
  const [deleteDeptOpen, setDeleteDeptOpen] = useState(false);
  const [deleteDeptData, setDeleteDeptData] = useState<Department | null>(null);

  // Job Title CRUD
  const [jtSearch, setJtSearch] = useState('');
  const [addJtOpen, setAddJtOpen] = useState(false);
  const [editJtOpen, setEditJtOpen] = useState(false);
  const [editJtData, setEditJtData] = useState<JobTitle | null>(null);
  const [deleteJtOpen, setDeleteJtOpen] = useState(false);
  const [deleteJtData, setDeleteJtData] = useState<JobTitle | null>(null);

  // Pagination
  const [empPage, setEmpPage] = useState(1);
  const [actPage, setActPage] = useState(1);
  const [deptPage, setDeptPage] = useState(1);
  const [jtPage, setJtPage] = useState(1);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await EmployeeService.getAll();
      setEmployees(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load employees from database');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const employeeNameStr = typeof employee.name === 'string' ? employee.name : `${employee.name?.nameEn || ''} ${employee.name?.nameAr || ''}`;
      const matchesSearch = includesQuery(
        [employeeNameStr, employee.employeeNumber, employee.email, employee.department, employee.jobTitle],
        searchQuery
      );
      const matchesDepartment = filterDept === 'All' || employee.department === filterDept;
      const matchesTitle = filterTitle === 'All' || employee.jobTitle === filterTitle;
      const matchesHireDate = !filterHiredAfter || employee.hireDate >= filterHiredAfter;
      const matchesActivity = filterActivityTypes.length === 0 || filterActivityTypes.includes(employee.activityType);
      const matchesEmployment = filterEmploymentTypes.length === 0 || filterEmploymentTypes.includes(employee.contractType);

      return matchesSearch && matchesDepartment && matchesTitle && matchesHireDate && matchesActivity && matchesEmployment;
    });
  }, [filterActivityTypes, filterDept, filterEmploymentTypes, filterHiredAfter, filterTitle, searchQuery]);

  const filteredActivityLog = useMemo(
    () => ACTIVITY_LOG.filter((log) => includesQuery([log.admin, log.action, log.date, log.affectedEmployeeNumber, log.affectedCount], searchQuery)),
    [searchQuery]
  );

  const filteredDepartments = useMemo(
    () => DEPARTMENTS.filter((department) => includesQuery([department.name, department.deptId, department.totalNumber], deptSearch)),
    [deptSearch]
  );

  const filteredJobTitles = useMemo(
    () => JOB_TITLES.filter((jobTitle) => includesQuery([jobTitle.title, jobTitle.count], jtSearch)),
    [jtSearch]
  );

  const paginatedEmployees = useMemo(() => {
    const start = (empPage - 1) * 15;
    return filteredEmployees.slice(start, start + 15);
  }, [filteredEmployees, empPage]);

  const paginatedActivityLog = useMemo(() => {
    const start = (actPage - 1) * 15;
    return filteredActivityLog.slice(start, start + 15);
  }, [filteredActivityLog, actPage]);

  const paginatedDepartments = useMemo(() => {
    const start = (deptPage - 1) * 15;
    return filteredDepartments.slice(start, start + 15);
  }, [filteredDepartments, deptPage]);

  const paginatedJobTitles = useMemo(() => {
    const start = (jtPage - 1) * 15;
    return filteredJobTitles.slice(start, start + 15);
  }, [filteredJobTitles, jtPage]);


  // Handlers
  const applyFilters = () => {
    let count = 0;
    if (filterDept !== 'All') count++;
    if (filterTitle !== 'All') count++;
    if (filterGradYear) count++;
    if (filterHiredAfter) count++;
    if (filterActivityTypes.length) count++;
    if (filterEmploymentTypes.length) count++;
    setActiveFiltersCount(count);
    setFilterOpen(false);
    toast.success('Filters applied', { description: `${count} filter${count !== 1 ? 's' : ''} active` });
  };

  const clearFilters = () => {
    setFilterDept('All');
    setFilterTitle('All');
    setFilterGradYear('');
    setFilterHiredAfter('');
    setFilterActivityTypes([]);
    setFilterEmploymentTypes([]);
    setActiveFiltersCount(0);
    toast.info('Filters cleared');
  };

  return (
    <div className="px-1 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--page-title-size)', fontWeight: 'var(--page-title-weight)' }} className="text-foreground">Manage Employees</h2>
      </div>

      {/* Tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="directory" className="text-[var(--text-sm)]">Directory</TabsTrigger>
            <TabsTrigger value="departments" className="text-[var(--text-sm)]">Departments</TabsTrigger>
            <TabsTrigger value="jobtitles" className="text-[var(--text-sm)]">Job Titles</TabsTrigger>
            <TabsTrigger value="activity" className="text-[var(--text-sm)]">Activity Log</TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row w-full md:w-auto items-stretch md:items-center gap-2 min-h-[44px]">
            {activeSubTab === 'directory' && (
              <>
                <Button size="sm" className="w-full md:w-auto gap-2 rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => setAddEmpOpen(true)}>
                  <Plus className="w-4 h-4" /> Add an Employee
                </Button>
                <Button variant="outline" size="sm" className="w-full md:w-auto gap-2 rounded-[var(--radius-button)] border-border" onClick={() => {
                  exportToCSV(filteredEmployees, 'Employees_Data');
                  toast.success('Download started', { description: 'Employee data exported to CSV.' });
                }}>
                  <Download className="w-4 h-4" /> <span>Download Data</span>
                </Button>
              </>
            )}
            {activeSubTab === 'departments' && (
              <Button size="sm" className="w-full md:w-auto gap-2 rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => setAddDeptOpen(true)}>
                <Plus className="w-4 h-4" /> Add Department
              </Button>
            )}
            {activeSubTab === 'jobtitles' && (
              <Button size="sm" className="w-full md:w-auto gap-2 rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={() => setAddJtOpen(true)}>
                <Plus className="w-4 h-4" /> Add Job Title
              </Button>
            )}
          </div>
        </div>

        {/* ── Directory Tab ── */}
        <TabsContent value="directory" className="space-y-4 mt-4">
          {/* Search row */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[280px] space-y-1.5 hidden md:block">
              <div className="flex items-center gap-2">
                <label className={labelClass}>Search Employees</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" aria-label="Search help" className="cursor-pointer"><Info className="w-4 h-4 text-primary" /></button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[240px] text-[var(--text-xs)]">
                    <p>Search by name, Employee number, or email.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Enter Employee# or Name..." className={cn(inputClass, 'ps-10')} aria-label="Search employees" />
                </div>
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                  <PopoverTrigger asChild>
                    <button type="button" aria-label="Open employee filters" className={cn('relative h-[44px] px-3 border rounded-[var(--radius-input)] bg-card hover:bg-muted transition-colors cursor-pointer flex items-center justify-center', activeFiltersCount > 0 ? 'border-primary text-primary' : 'border-border text-muted-foreground')}>
                      <Filter className="w-4 h-4" />
                      {activeFiltersCount > 0 && <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">{activeFiltersCount}</span>}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" side="bottom" collisionPadding={16} className="w-80 max-w-[calc(100vw-2rem)] p-0">
                    <EmployeeFilterPanel
                      dept={filterDept} setDept={setFilterDept}
                      title={filterTitle} setTitle={setFilterTitle}
                      gradYear={filterGradYear} setGradYear={setFilterGradYear}
                      hiredAfter={filterHiredAfter} setHiredAfter={setFilterHiredAfter}
                      activityTypes={filterActivityTypes} toggleActivity={(t) => setFilterActivityTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                      employmentTypes={filterEmploymentTypes} toggleEmployment={(t) => setFilterEmploymentTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                      onApply={applyFilters} onClear={clearFilters} onClose={() => setFilterOpen(false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Employee table */}
          <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
            <div className="overflow-x-auto">
              {filteredEmployees.length === 0 ? (
                <EmptyState 
                  icon={Users} 
                  title="No Employees Found" 
                  description="No employees match your search criteria." 
                  className="py-16"
                />
              ) : (
                <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
                  <thead className="hidden md:table-header-group">
                    <tr className="bg-muted border-b border-border">
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Name</th>
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Employee Number</th>
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Department</th>
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Job Title</th>
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-muted/30 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-b-0 group">
                        <td className="whitespace-nowrap px-4 py-1 md:py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-[var(--font-weight-medium)]">{localizePersonName(emp.name, language)}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-muted-foreground uppercase tabular-nums"><span className="md:hidden text-muted-foreground me-2 font-medium">Emp#:</span>{emp.employeeNumber}</td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Department:</span>{emp.department}</td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Title:</span>{emp.jobTitle}</td>
                        <td className="whitespace-nowrap px-4 py-3 md:text-end mt-2 md:mt-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="md:w-auto w-full justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer md:bg-transparent md:border-0 md:p-1.5 md:hover:bg-muted"><span className="md:hidden">Actions</span><MoreVertical className="hidden md:block w-4 h-4 text-muted-foreground" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem onClick={() => { setEditEmpData(emp); setEditEmpOpen(true); }} className="cursor-pointer gap-2">
                                <Edit className="w-4 h-4" /> Edit Info
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setAccessCardEmp(emp); setAccessCardsOpen(true); }} className="cursor-pointer gap-2">
                                <CreditCard className="w-4 h-4" /> Manage Access Cards
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setActivityLogDetail(ACTIVITY_LOG[0]); setActivityLogDetailOpen(true); }} className="cursor-pointer gap-2">
                                <Eye className="w-4 h-4" /> View Activity Log
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setAddFormerOpen(true)} className="cursor-pointer gap-2">
                                <UserPlus className="w-4 h-4" /> Add Former Employee
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive" onClick={() => { setTerminateEmp(emp); setTerminateOpen(true); }} className="cursor-pointer gap-2">
                                <UserX className="w-4 h-4" /> Terminate Employee
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <TablePagination page={empPage} setPage={setEmpPage} totalPages={Math.max(1, Math.ceil(filteredEmployees.length / 15))} totalItems={filteredEmployees.length} />
          </div>
        </TabsContent>

        {/* ── Activity Log Tab ── */}
        <TabsContent value="activity" className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search activity log..." className={cn(inputClass, 'ps-10')} />
            </div>
          </div>
          <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
            <div className="overflow-x-auto">
              {filteredActivityLog.length === 0 ? (
                <EmptyState 
                  icon={FileText} 
                  title="No Activity Found" 
                  description="No activity matches your search criteria." 
                  className="py-16"
                />
              ) : (
                <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
                  <thead className="hidden md:table-header-group">
                    <tr className="bg-muted border-b border-border">
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Admin</th>
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Action Taken</th>
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Date</th>
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Amount Affected</th>
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedActivityLog.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-b-0">
                        <td className="whitespace-nowrap px-4 py-1 md:py-3">
                          <span className="font-[var(--font-weight-medium)] text-foreground">{log.admin}</span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Action:</span>{log.action}</td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-muted-foreground"><span className="md:hidden text-muted-foreground me-2 font-medium">Date:</span>{log.date}</td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground tabular-nums"><span className="md:hidden text-muted-foreground me-2 font-medium">Affected:</span>{log.affectedCount}</td>
                        <td className="whitespace-nowrap px-4 py-3 md:text-end mt-2 md:mt-0">
                          <Button variant="outline" size="sm" onClick={() => { setActivityLogDetail(log); setActivityLogDetailOpen(true); }} className="md:w-auto w-full justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer md:bg-transparent md:border-0 md:p-1.5 md:hover:bg-muted"><span className="md:hidden">View Details</span><MoreVertical className="hidden md:block w-4 h-4 text-muted-foreground" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <TablePagination page={actPage} setPage={setActPage} totalPages={Math.max(1, Math.ceil(filteredActivityLog.length / 15))} totalItems={filteredActivityLog.length} />
          </div>
        </TabsContent>

        {/* ── Departments Tab ── */}
        <TabsContent value="departments" className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={deptSearch} onChange={(e) => setDeptSearch(e.target.value)} placeholder="Search departments..." className={cn(inputClass, 'ps-10')} />
            </div>
          </div>
          <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
            <div className="overflow-x-auto">
              {filteredDepartments.length === 0 ? (
                <EmptyState 
                  icon={Users} 
                  title="No Departments Found" 
                  description="No departments match your search criteria." 
                  className="py-16"
                />
              ) : (
                <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
                  <thead className="hidden md:table-header-group">
                    <tr className="bg-muted border-b border-border">
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Department</th>
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Department ID</th>
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Total Number</th>
                      <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedDepartments.map((dept) => (
                      <tr key={dept.id} className="hover:bg-muted/30 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-b-0">
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground font-[var(--font-weight-medium)]">{dept.name}</td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-muted-foreground tabular-nums"><span className="md:hidden text-muted-foreground me-2 font-medium">ID:</span>{dept.deptId}</td>
                        <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground tabular-nums"><span className="md:hidden text-muted-foreground me-2 font-medium">Total:</span>{dept.totalNumber}</td>
                        <td className="whitespace-nowrap px-4 py-3 md:text-end mt-2 md:mt-0">
                          <div className="flex flex-row items-center justify-center sm:justify-end gap-2 pt-2 w-full">
                            <Button variant="outline" size="sm" aria-label={`Edit ${dept.name}`} onClick={() => { setEditDeptData(dept); setEditDeptOpen(true); }} className="w-full md:w-auto justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer md:bg-transparent md:border-0 md:p-1.5 md:hover:bg-muted">
                              <span className="md:hidden">Edit</span>
                              <PenLine className="hidden md:block w-4 h-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <TablePagination page={deptPage} setPage={setDeptPage} totalPages={Math.max(1, Math.ceil(filteredDepartments.length / 15))} totalItems={filteredDepartments.length} />
          </div>
        </TabsContent>

        {/* ── Job Titles Tab ── */}
        <TabsContent value="jobtitles" className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={jtSearch} onChange={(e) => setJtSearch(e.target.value)} placeholder="Search job titles..." className={cn(inputClass, 'ps-10')} />
            </div>
          </div>
          <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">Job Title</th>
                    <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground"># Employees</th>
                    <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedJobTitles.map((jt) => (
                    <tr key={jt.id} className="hover:bg-muted/30 transition-colors">
                      <td className="whitespace-nowrap px-4 py-3 text-foreground font-[var(--font-weight-medium)]">{jt.title}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-foreground tabular-nums">{jt.count}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-end">
                        <div className="flex flex-row items-center justify-center sm:justify-end gap-2 pt-2 w-full">
                          <button type="button" aria-label={`Edit ${jt.title}`} onClick={() => { setEditJtData(jt); setEditJtOpen(true); }} className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer">
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button type="button" aria-label={`Delete ${jt.title}`} onClick={() => { setDeleteJtData(jt); setDeleteJtOpen(true); }} className="p-1.5 hover:bg-destructive/10 rounded-[var(--radius-sm)] transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredJobTitles.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No job titles match your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <TablePagination page={jtPage} setPage={setJtPage} totalPages={Math.max(1, Math.ceil(filteredJobTitles.length / 15))} totalItems={filteredJobTitles.length} />
          </div>
        </TabsContent>
      </Tabs>

      {/* ═══════════ MODALS ═══════════ */}

      {/* Add Employee */}
      <EmployeeFormModal
        open={addEmpOpen}
        onOpenChange={setAddEmpOpen}
        title="Add an Employee"
        onSave={async (data) => {
          try {
            await EmployeeService.create(data);
            await loadEmployees();
            setAddEmpOpen(false);
            toast.success('Employee added successfully');
          } catch (e) {
            toast.error('Failed to save employee to database');
          }
        }}
      />

      {/* Edit Employee */}
      <EmployeeFormModal
        open={editEmpOpen}
        onOpenChange={setEditEmpOpen}
        title="Edit Employee"
        employee={editEmpData}
        onSave={async (data) => {
          try {
            if (editEmpData) {
              await EmployeeService.update(editEmpData.id, data);
              await loadEmployees();
              setEditEmpOpen(false);
              toast.success('Employee updated successfully');
            }
          } catch (e) {
            toast.error('Failed to update employee details');
          }
        }}
      />

      {/* Add Former Employee */}
      <FormerEmployeeModal
        open={addFormerOpen}
        onOpenChange={setAddFormerOpen}
      />

      {/* Manage Access Cards */}
      <AccessCardsModal
        open={accessCardsOpen}
        onOpenChange={setAccessCardsOpen}
        employee={accessCardEmp}
      />

      {/* Confirm Termination */}
      <TerminateModal
        open={terminateOpen}
        onOpenChange={setTerminateOpen}
        employee={terminateEmp}
        onConfirm={async () => {
          try {
            if (terminateEmp) {
              await EmployeeService.delete(terminateEmp.id);
              await loadEmployees();
              setTerminateOpen(false);
              toast.success(`${localizePersonName(terminateEmp.name, language)} has been terminated`);
            }
          } catch (e) {
            toast.error('Failed to terminate employee');
          }
        }}
      />

      {/* Activity Log Detail */}
      <ActivityLogDetailModal
        open={activityLogDetailOpen}
        onOpenChange={setActivityLogDetailOpen}
        entry={activityLogDetail}
      />

      {/* Department CRUD */}
      <DepartmentFormModal
        open={addDeptOpen}
        onOpenChange={setAddDeptOpen}
        title="Add Department"
        onSave={() => { setAddDeptOpen(false); toast.success('Department added successfully'); }}
      />
      <DepartmentFormModal
        open={editDeptOpen}
        onOpenChange={setEditDeptOpen}
        title="Edit Department"
        department={editDeptData}
        onSave={() => { setEditDeptOpen(false); toast.success('Department updated successfully'); }}
      />
      <DeleteConfirmModal
        open={deleteDeptOpen}
        onOpenChange={setDeleteDeptOpen}
        itemType="Department"
        itemName={deleteDeptData?.name ?? ''}
        onConfirm={() => { setDeleteDeptOpen(false); toast.success(`${deleteDeptData?.name} department deleted successfully`); }}
      />

      {/* Job Title CRUD */}
      <JobTitleFormModal
        open={addJtOpen}
        onOpenChange={setAddJtOpen}
        title="Add Job Title"
        onSave={() => { setAddJtOpen(false); toast.success('Job title added successfully'); }}
      />
      <JobTitleFormModal
        open={editJtOpen}
        onOpenChange={setEditJtOpen}
        title="Edit Job Title"
        jobTitle={editJtData}
        onSave={() => { setEditJtOpen(false); toast.success('Job title updated successfully'); }}
      />
      <DeleteConfirmModal
        open={deleteJtOpen}
        onOpenChange={setDeleteJtOpen}
        itemType="Job Title"
        itemName={deleteJtData?.title ?? ''}
        onConfirm={() => { setDeleteJtOpen(false); toast.success(`${deleteJtData?.title} deleted successfully`); }}
      />
    </div>
  );
};

// ═══════════════════════════════════════
// ── Sub-components ──
// ═══════════════════════════════════════

// ── Table Pagination ──
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

// ── Employee Filter Panel ──
const EmployeeFilterPanel: React.FC<{
  dept: string; setDept: (v: string) => void;
  title: string; setTitle: (v: string) => void;
  gradYear: string; setGradYear: (v: string) => void;
  hiredAfter: string; setHiredAfter: (v: string) => void;
  activityTypes: string[]; toggleActivity: (v: string) => void;
  employmentTypes: string[]; toggleEmployment: (v: string) => void;
  onApply: () => void; onClear: () => void; onClose: () => void;
}> = ({ dept, setDept, title, setTitle, gradYear, setGradYear, hiredAfter, setHiredAfter, activityTypes, toggleActivity, employmentTypes, toggleEmployment, onApply, onClear, onClose }) => (
  <div className="p-4 space-y-4 max-h-[var(--radix-popover-content-available-height,480px)] overflow-y-auto">
    <div className="flex items-center justify-between">
      <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Search Options</span>
      <button type="button" aria-label="Close filters" onClick={onClose} className="p-1 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer"><X className="w-4 h-4 text-muted-foreground" /></button>
    </div>
    <div className="p-3 bg-primary/5 rounded-[var(--radius)] border border-primary/20">
      <ul className="space-y-1 text-[var(--text-xs)] text-foreground">
        <li>Search results are based on selected filters.</li>
        <li>To search all employees, <strong>clear all filters</strong>.</li>
        <li>Search by <strong>name</strong>, <strong>email</strong>, or <strong>Employee#</strong>.</li>
      </ul>
    </div>
    <FilterSelect label="Department" value={dept} onChange={setDept} options={['All', ...DEPARTMENTS_LIST]} />
    <FilterSelect label="Job Title" value={title} onChange={setTitle} options={['All', ...JOB_TITLES_LIST]} />
    <div className="space-y-1.5">
      <label className={labelClass}>Graduation Year</label>
      <input type="text" inputMode="numeric" value={gradYear} onChange={(e) => setGradYear(e.target.value)} placeholder="e.g. 2013" className={inputClass} />
    </div>
    <div className="space-y-1.5">
      <label className={labelClass}>Hired After</label>
      <DatePicker value={hiredAfter} onChange={setHiredAfter} placeholder="Select date" />
    </div>
    <CheckboxGroup label="Activity Type" items={ACTIVITY_TYPES} selected={activityTypes} toggle={toggleActivity} />
    <CheckboxGroup label="Employment Type" items={EMPLOYMENT_TYPES} selected={employmentTypes} toggle={toggleEmployment} />
    <div className="space-y-2 pt-2">
      <Button onClick={onApply} className="w-full rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white">Apply Filter</Button>
      <Button variant="outline" onClick={onClear} className="w-full rounded-[var(--radius-button)]">Clear Filter</Button>
    </div>
  </div>
);

// ── Filter Select ──
const FilterSelect: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label className={labelClass}>{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 rounded-[var(--radius-input)]"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  </div>
);

// ── Checkbox Group ──
const CheckboxGroup: React.FC<{ label: string; items: string[]; selected: string[]; toggle: (v: string) => void }> = ({ label, items, selected, toggle }) => (
  <div className="space-y-2">
    <label className={labelClass}>{label}</label>
    <div className="space-y-2">
      {items.map(item => (
        <label key={item} className="flex items-center gap-2.5 cursor-pointer group">
          <Checkbox aria-label={`${selected.includes(item) ? 'Remove' : 'Add'} ${item} filter`} checked={selected.includes(item)} onCheckedChange={() => toggle(item)} />
          <span className="text-[var(--text-sm)] text-foreground group-hover:text-primary transition-colors font-[var(--font-weight-normal)]">{item}</span>
        </label>
      ))}
    </div>
  </div>
);

// ── Employee Form Modal ──
const EmployeeFormModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  employee?: Employee | null;
  onSave: (data: Omit<Employee, 'id'>) => void;
}> = ({ open, onOpenChange, title, employee, onSave }) => {
  const [name, setName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [isManager, setIsManager] = useState(false);
  const [dept, setDept] = useState(DEPARTMENTS_LIST[0]);
  const [jobTitle, setJobTitle] = useState(JOB_TITLES_LIST[0]);
  const [contractType, setContractType] = useState('Permanent');
  const [hireDate, setHireDate] = useState('');
  const [activityType, setActivityType] = useState('Direct');

  React.useEffect(() => {
    if (employee) {
      const employeeNameStr = typeof employee.name === 'string' ? employee.name : (employee.name?.nameEn || '');
      setName(employeeNameStr); setEmployeeNumber(employee.employeeNumber); setEmail(employee.email);
      setPhone(employee.phone); setGender(employee.gender); setIsManager(employee.isManager);
      setDept(employee.department); setJobTitle(employee.jobTitle);
      setContractType(employee.contractType); setHireDate(employee.hireDate);
      setActivityType(employee.activityType);
    } else {
      setName(''); setEmployeeNumber(''); setEmail(''); setPhone(''); setGender('Male');
      setIsManager(false); setDept(DEPARTMENTS_LIST[0]); setJobTitle(JOB_TITLES_LIST[0]);
      setContractType('Permanent'); setHireDate(''); setActivityType('Direct');
    }
  }, [employee, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Personal Information</p>
            <FormField label="Name" value={name} onChange={setName} placeholder="First and last name" />
            <FormField label="Employee Number" value={employeeNumber} onChange={setEmployeeNumber} placeholder="XXXXX" />
            <FormField label="Email" value={email} onChange={setEmail} placeholder="email@acme.com" type="email" />
            <FormField label="Phone" value={phone} onChange={setPhone} placeholder="+972(0) XXXX-XXXX" />
            <div className="space-y-1.5">
              <label className={labelClass}>Gender</label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="h-10 rounded-[var(--radius-input)]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox checked={isManager} onCheckedChange={(c) => setIsManager(!!c)} />
              <span className="text-[var(--text-sm)] text-foreground font-[var(--font-weight-normal)]">Is a direct line manager</span>
            </label>
          </div>

          <div className="space-y-4">
            <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Job Related</p>
            <FilterSelect label="Department" value={dept} onChange={setDept} options={DEPARTMENTS_LIST} />
            <FilterSelect label="Job Title" value={jobTitle} onChange={setJobTitle} options={JOB_TITLES_LIST} />
            <div className="space-y-1.5">
              <label className={labelClass}>Contract Type</label>
              <Select value={contractType} onValueChange={setContractType}>
                <SelectTrigger className="h-10 rounded-[var(--radius-input)]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Permanent">Permanent</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FormField label="Hire Date" value={hireDate} onChange={setHireDate} type="date" />
            <div className="space-y-1.5">
              <label className={labelClass}>Activity Type</label>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger className="h-10 rounded-[var(--radius-input)]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Direct">Direct</SelectItem>
                  <SelectItem value="InDirect">InDirect</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)]">Cancel</Button>
          <Button onClick={() => {
            onSave({
              name,
              employeeNumber,
              email,
              phone,
              gender,
              department: dept,
              jobTitle,
              contractType,
              hireDate,
              activityType,
              isManager,
              img: employee?.img || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
            });
          }} className="w-full sm:w-auto rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white">
            {employee ? 'Save' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Former Employee Modal ──
const FormerEmployeeModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const [searchFormer, setSearchFormer] = useState('');

  const formerEmployees = [
    { name: 'Ahmed M.', employeeNumber: '01021', dept: 'Global', title: 'Operations Manager' },
    { name: 'Sara K.', employeeNumber: '01022', dept: 'Software', title: 'Senior Project Manager' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Add Former Employee</DialogTitle>
          <DialogDescription className="sr-only">Add a former employee back to the system</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Search Former Employees</label>
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={searchFormer} onChange={(e) => setSearchFormer(e.target.value)} placeholder="Search by name or Employee#..." className={cn(inputClass, 'ps-10')} />
            </div>
          </div>

          <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Former Employees</p>
          <div className="border border-border rounded-[var(--radius-card)] overflow-hidden">
            <table className="w-full md:min-w-max text-[var(--text-sm)]">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="whitespace-nowrap px-4 py-2.5 text-start font-[var(--font-weight-medium)] text-muted-foreground">Name</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-start font-[var(--font-weight-medium)] text-muted-foreground">Employee#</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-start font-[var(--font-weight-medium)] text-muted-foreground">Dept</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-start font-[var(--font-weight-medium)] text-muted-foreground">Title</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-end font-[var(--font-weight-medium)] text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {formerEmployees.map((fe, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-2.5 text-foreground">{localizePersonName(fe.name, language)}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground uppercase tabular-nums">{fe.employeeNumber}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-foreground">{fe.dept}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-foreground">{fe.title}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-end">
                      <Button size="sm" variant="outline" className="gap-1.5 rounded-[var(--radius-button)]" onClick={() => { onOpenChange(false); toast.success(`${localizePersonName(fe.name, language)} added back as an employee`); }}>
                        <Plus className="w-3 h-3" /> Add
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination currentPage={1} totalPages={1} itemsPerPage={15} onPageChange={() => {}} onItemsPerPageChange={() => {}} />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)]">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Access Cards Modal ──
const AccessCardsModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employee: Employee | null;
}> = ({ open, onOpenChange, employee }) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const [cardNumber, setCardNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cardType, setCardType] = useState('Permanent');

  const mockCards: AccessCard[] = [
    { id: '1', cardNumber: 'CD34410290', startDate: '03 Nov 2018', endDate: '13 Nov 2019', cardType: 'Spring', status: 'Active' },
    { id: '2', cardNumber: 'CD01401190', startDate: '04 Nov 2018', endDate: '24 Nov 2019', cardType: 'Spring', status: 'Expired' },
    { id: '3', cardNumber: 'CD50105340', startDate: '03 Nov 2018', endDate: '03 Nov 2019', cardType: 'Current', status: 'Active' },
  ];

  const handleAddCard = () => {
    if (!cardNumber) { toast.error('Card number is required'); return; }
    toast.success('Access card assigned successfully');
    setCardNumber(''); setStartDate(''); setEndDate('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Manage Employee Access Cards</DialogTitle>
          <DialogDescription className="sr-only">Manage access cards for this employee</DialogDescription>
        </DialogHeader>

        {employee && (
          <div className="space-y-5">
            {/* Employee info */}
            <div className="p-4 bg-muted rounded-[var(--radius-card)] space-y-2">
              <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Employee Info</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[var(--text-sm)]">
                <div><span className="text-muted-foreground">Name:</span> <span className="text-foreground ms-1">{localizePersonName(employee.name, language)}</span></div>
                <div><span className="text-muted-foreground">Employee#:</span> <span className="text-foreground ms-1 uppercase">{employee.employeeNumber}</span></div>
                <div><span className="text-muted-foreground">Department:</span> <span className="text-foreground ms-1">{employee.department}</span></div>
              </div>
            </div>

            {/* Add Card */}
            <div className="space-y-3">
              <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Add Card</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className={labelClass}>Card Number</label>
                  <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="CDXXXXXXXX" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Start Date</label>
                  <DatePicker value={startDate} onChange={setStartDate} placeholder="Select start date" />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>End Date</label>
                  <DatePicker value={endDate} onChange={setEndDate} placeholder="Select end date" />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Card Type</label>
                  <Select value={cardType} onValueChange={setCardType}>
                    <SelectTrigger className="h-10 rounded-[var(--radius-input)]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Permanent">Permanent</SelectItem>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddCard} className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white">Assign Card</Button>
            </div>

            {/* Assigned Cards Table */}
            <div className="space-y-3">
              <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Assigned Cards</p>
              <div className="border border-border rounded-[var(--radius)] overflow-x-auto bg-card mt-2 shadow-[var(--elevation-sm)]">
                <table className="w-full md:min-w-max text-[var(--text-sm)]">
                  <thead>
                    <tr className="bg-muted border-b border-border">
                      <th className="whitespace-nowrap px-4 py-2.5 text-start font-[var(--font-weight-medium)] text-muted-foreground">Card Number</th>
                      <th className="whitespace-nowrap px-4 py-2.5 text-start font-[var(--font-weight-medium)] text-muted-foreground">Start Date</th>
                      <th className="whitespace-nowrap px-4 py-2.5 text-start font-[var(--font-weight-medium)] text-muted-foreground">End Date</th>
                      <th className="whitespace-nowrap px-4 py-2.5 text-start font-[var(--font-weight-medium)] text-muted-foreground">Card Type</th>
                      <th className="whitespace-nowrap px-4 py-2.5 text-start font-[var(--font-weight-medium)] text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockCards.map((card) => (
                      <tr key={card.id} className="hover:bg-muted/30">
                        <td className="whitespace-nowrap px-4 py-2.5 text-foreground tabular-nums">{card.cardNumber}</td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-foreground">{card.startDate}</td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-foreground">{card.endDate}</td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-foreground">{card.cardType}</td>
                        <td className="whitespace-nowrap px-4 py-2.5">
                          <span className={cn(
                            'px-2.5 py-0.5 rounded-full border text-[var(--text-xs)] font-[var(--font-weight-semibold)]',
                            card.status === 'Active'
                              ? 'bg-[#E7F6EF] text-[#064E3B] border-[#047857]'
                              : 'bg-[#FDECEC] text-[#7F1D1D] border-[#B91C1C]'
                          )}>{card.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination currentPage={1} totalPages={1} itemsPerPage={15} onPageChange={() => {}} onItemsPerPageChange={() => {}} />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)]">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Terminate Modal ──
const TerminateModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employee: Employee | null;
  onConfirm: () => void;
}> = ({ open, onOpenChange, employee, onConfirm }) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const [resetPassword, setResetPassword] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Confirm Termination</DialogTitle>
          <DialogDescription className="sr-only">Confirm employee termination</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-destructive/5 rounded-[var(--radius)] border border-destructive/20">
            <p className="text-[var(--text-sm)] text-foreground">
              <strong>{localizePersonName(employee?.name, language)}</strong> is about to be terminated.
            </p>
            <ul className="mt-2 space-y-1 text-[var(--text-xs)] text-muted-foreground list-disc ps-4">
              <li>All access to company resources will be revoked.</li>
              <li>Attendance records will be finalized and archived.</li>
              <li>Active leave requests will be automatically denied.</li>
              <li>This action is permanent. The employee's account will be deactivated immediately.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Need Password?</p>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox checked={resetPassword} onCheckedChange={(c) => setResetPassword(!!c)} />
              <span className="text-[var(--text-sm)] text-foreground font-[var(--font-weight-normal)]">Reset password to shareable format?</span>
            </label>
          </div>
        </div>

        <DialogFooter className="pt-2 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)]">Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} className="w-full sm:w-auto rounded-[var(--radius-button)]">
            Terminate Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Activity Log Detail Modal ──
const ActivityLogDetailModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  entry: ActivityEntry | null;
}> = ({ open, onOpenChange, entry }) => {
  const [detailTab, setDetailTab] = useState<'admin' | 'affected'>('admin');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Admin Activity Log</DialogTitle>
          <DialogDescription className="sr-only">Details of admin activity</DialogDescription>
        </DialogHeader>

        {entry && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-[var(--radius)]">
              <div>
                <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">{entry.admin}</p>
                <p className="text-[var(--text-xs)] text-muted-foreground">{entry.action}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border gap-4">
              <button onClick={() => setDetailTab('admin')} className={cn('border-b-2 border-transparent pb-2 text-[var(--text-sm)] cursor-pointer transition-colors', detailTab === 'admin' ? 'border-accent text-accent font-[var(--font-weight-semibold)]' : 'text-muted-foreground hover:text-foreground')}>Admin</button>
              <button onClick={() => setDetailTab('affected')} className={cn('border-b-2 border-transparent pb-2 text-[var(--text-sm)] cursor-pointer transition-colors', detailTab === 'affected' ? 'border-accent text-accent font-[var(--font-weight-semibold)]' : 'text-muted-foreground hover:text-foreground')}>Affected Accounts</button>
            </div>

            {detailTab === 'admin' && (
              <div className="space-y-3 text-[var(--text-sm)]">
                <InfoRow label="Admin" value={entry.admin} />
                <InfoRow label="Department" value="Company HR Management" />
                <InfoRow label="Action" value={entry.action} />
                <InfoRow label="Date" value={entry.date} />
                <InfoRow label="Details" value="A user action's past will not be modified. This action is recorded for auditing purposes." />
              </div>
            )}

            {detailTab === 'affected' && (
              <div className="space-y-3 text-[var(--text-sm)]">
                <InfoRow label="Employee Number" value={entry.affectedEmployeeNumber} />
                <InfoRow label="Affected Count" value={String(entry.affectedCount)} />
                <InfoRow label="Status" value="Completed" />
              </div>
            )}
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)]">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Department Form Modal ──
const DepartmentFormModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  department?: Department | null;
  onSave: () => void;
}> = ({ open, onOpenChange, title, department, onSave }) => {
  const [name, setName] = useState('');
  const [deptId, setDeptId] = useState('');
  const [leadCount, setLeadCount] = useState('');

  React.useEffect(() => {
    if (department) {
      setName(department.name); setDeptId(department.deptId); setLeadCount(String(department.totalNumber));
    } else {
      setName(''); setDeptId(''); setLeadCount('');
    }
  }, [department, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <FormField label="Department" value={name} onChange={setName} placeholder="Department name" />
          <FormField label="Department ID" value={deptId} onChange={setDeptId} placeholder="e.g. D1006" />
          <FormField label="Lead Count" value={leadCount} onChange={setLeadCount} placeholder="Number of employees" type="number" />
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)]">Cancel</Button>
          <Button onClick={onSave} className="w-full sm:w-auto rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white">
            {department ? 'Save Department' : 'Add Department'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Job Title Form Modal ──
const JobTitleFormModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  jobTitle?: JobTitle | null;
  onSave: () => void;
}> = ({ open, onOpenChange, title, jobTitle: jt, onSave }) => {
  const [jtName, setJtName] = useState('');

  React.useEffect(() => {
    if (jt) { setJtName(jt.title); } else { setJtName(''); }
  }, [jt, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <FormField label="Job Title" value={jtName} onChange={setJtName} placeholder="e.g. Software Developer" />
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)]">Cancel</Button>
          <Button onClick={onSave} className="w-full sm:w-auto rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white">
            {jt ? 'Save Job Title' : 'Add Job Title'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Delete Confirm Modal ──
const DeleteConfirmModal: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  itemType: string;
  itemName: string;
  onConfirm: () => void;
}> = ({ open, onOpenChange, itemType, itemName, onConfirm }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]">Delete {itemType}</DialogTitle>
        <DialogDescription className="sr-only">Delete {itemType}</DialogDescription>
      </DialogHeader>
      <div className="p-4 bg-destructive/5 rounded-[var(--radius)] border border-destructive/20 flex gap-3">
        <Info className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <p className="text-[var(--text-sm)] text-foreground">
          <strong>{itemName}</strong> {itemType.toLowerCase()} will be deleted upon confirmation.
        </p>
      </div>
      <DialogFooter className="pt-2 gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-[var(--radius-button)]">Cancel</Button>
        <Button variant="destructive" onClick={onConfirm} className="w-full sm:w-auto rounded-[var(--radius-button)]">Confirm</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ── Shared Form Field ──
const FormField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
}> = ({ label, value, onChange, placeholder, type = 'text', inputMode, autoComplete }) => (
  <div className="space-y-1.5">
    <label className={labelClass}>{label}</label>
    {type === 'date' ? (
      <DatePicker value={value} onChange={onChange} placeholder={placeholder} />
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} inputMode={inputMode} autoComplete={autoComplete} />
    )}
  </div>
);

// ── Info Row ──
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex gap-3">
    <span className="text-muted-foreground w-24 shrink-0 font-[var(--font-weight-medium)]">{label}:</span>
    <span className="text-foreground">{value}</span>
  </div>
);
