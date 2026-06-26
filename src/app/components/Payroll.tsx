import React, { useState, useMemo } from 'react';
import {
  Download,
  Eye,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Pagination } from './Pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Mock employee data with sample names
const EMPLOYEES = [
  { 
    id: 'E001', 
    sesaId: '580506',
    name: 'Sarah Johnson', 
    position: 'Senior Developer', 
    department: 'Engineering', 
    grossSalary: 85000,
    colaAllowance: 2000,
    bonus: 850,
    totalAllowances: 2850,
    taxDeducted: 12750,
    socialInsurance: 6375,
    pensionEmployeeShare: 4250,
    familyDeductions: 200,
    totalDeductions: 23575,
    netPay: 64275
  },
  { 
    id: 'E002', 
    sesaId: '439259',
    name: 'Michael Chen', 
    position: 'Product Manager', 
    department: 'Product', 
    grossSalary: 92000,
    colaAllowance: 2000,
    bonus: 920,
    totalAllowances: 2920,
    taxDeducted: 13800,
    socialInsurance: 6900,
    pensionEmployeeShare: 4600,
    familyDeductions: 150,
    totalDeductions: 25450,
    netPay: 69470
  },
  { 
    id: 'E003', 
    sesaId: '523970',
    name: 'Emily Rodriguez', 
    position: 'UX Designer', 
    department: 'Design', 
    grossSalary: 78000,
    colaAllowance: 2000,
    bonus: 780,
    totalAllowances: 2780,
    taxDeducted: 11700,
    socialInsurance: 5850,
    pensionEmployeeShare: 3900,
    familyDeductions: 300,
    totalDeductions: 21750,
    netPay: 59030
  },
  { 
    id: 'E004', 
    sesaId: '324909',
    name: 'James Williams', 
    position: 'DevOps Engineer', 
    department: 'Engineering', 
    grossSalary: 88000,
    colaAllowance: 2000,
    bonus: 880,
    totalAllowances: 2880,
    taxDeducted: 13200,
    socialInsurance: 6600,
    pensionEmployeeShare: 4400,
    familyDeductions: 250,
    totalDeductions: 24450,
    netPay: 66430
  },
  { 
    id: 'E005', 
    sesaId: '547849',
    name: 'Lisa Anderson', 
    position: 'Marketing Manager', 
    department: 'Marketing', 
    grossSalary: 82000,
    colaAllowance: 2000,
    bonus: 820,
    totalAllowances: 2820,
    taxDeducted: 12300,
    socialInsurance: 6150,
    pensionEmployeeShare: 4100,
    familyDeductions: 100,
    totalDeductions: 22650,
    netPay: 62170
  },
  { 
    id: 'E006', 
    sesaId: '483797',
    name: 'David Martinez', 
    position: 'Sales Director', 
    department: 'Sales', 
    grossSalary: 95000,
    colaAllowance: 2000,
    bonus: 950,
    totalAllowances: 2950,
    taxDeducted: 14250,
    socialInsurance: 7125,
    pensionEmployeeShare: 4750,
    familyDeductions: 0,
    totalDeductions: 26125,
    netPay: 71825
  },
  { 
    id: 'E007', 
    sesaId: '483798',
    name: 'Jennifer Taylor', 
    position: 'HR Specialist', 
    department: 'Human Resources', 
    grossSalary: 72000,
    colaAllowance: 2000,
    bonus: 720,
    totalAllowances: 2720,
    taxDeducted: 10800,
    socialInsurance: 5400,
    pensionEmployeeShare: 3600,
    familyDeductions: 350,
    totalDeductions: 20150,
    netPay: 54570
  },
  { 
    id: 'E008', 
    sesaId: '483799',
    name: 'Robert Brown', 
    position: 'QA Engineer', 
    department: 'Engineering', 
    grossSalary: 76000,
    colaAllowance: 2000,
    bonus: 760,
    totalAllowances: 2760,
    taxDeducted: 11400,
    socialInsurance: 5700,
    pensionEmployeeShare: 3800,
    familyDeductions: 200,
    totalDeductions: 21100,
    netPay: 57660
  },
  { 
    id: 'E009', 
    sesaId: '483800',
    name: 'Amanda Lee', 
    position: 'Content Writer', 
    department: 'Marketing', 
    grossSalary: 68000,
    colaAllowance: 2000,
    bonus: 680,
    totalAllowances: 2680,
    taxDeducted: 10200,
    socialInsurance: 5100,
    pensionEmployeeShare: 3400,
    familyDeductions: 150,
    totalDeductions: 18850,
    netPay: 51830
  },
  { 
    id: 'E010', 
    sesaId: '483801',
    name: 'Christopher Davis', 
    position: 'Backend Developer', 
    department: 'Engineering', 
    grossSalary: 83000,
    colaAllowance: 2000,
    bonus: 830,
    totalAllowances: 2830,
    taxDeducted: 12450,
    socialInsurance: 6225,
    pensionEmployeeShare: 4150,
    familyDeductions: 180,
    totalDeductions: 23005,
    netPay: 62825
  },
];

const COMPENSATION_ITEMS = [
  { id: 1, name: 'Base Salary', type: 'Monthly', taxable: true },
  { id: 2, name: 'Housing Allowance', type: 'Monthly', taxable: false },
  { id: 3, name: 'Transportation', type: 'Monthly', taxable: false },
  { id: 4, name: 'Performance Bonus', type: 'Quarterly', taxable: true },
  { id: 5, name: 'Health Insurance', type: 'Monthly', taxable: false },
];

const DEDUCTION_ITEMS = [
  { id: 1, name: 'Income Tax', percentage: 15, mandatory: true },
  { id: 2, name: 'Social Insurance', percentage: 7.5, mandatory: true },
  { id: 3, name: 'Pension Fund', percentage: 5, mandatory: true },
  { id: 4, name: 'Health Insurance Premium', amount: 250, mandatory: false },
];

export const Payroll: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedEmployee, setSelectedEmployee] = useState<typeof EMPLOYEES[0] | null>(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'employees', label: 'Employee Payroll' },
    { id: 'compensation', label: 'Compensation' },
    { id: 'deductions', label: 'Deductions' },
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = ['2023', '2024', '2025', '2026'];

  const handleGeneratePayslip = (employee: typeof EMPLOYEES[0]) => {
    setSelectedEmployee(employee);
    setShowPayslipModal(true);
  };

  const handleDownloadPayslip = () => {
    toast.success('Payslip downloaded successfully');
    setShowPayslipModal(false);
  };

  const filteredEmployees = EMPLOYEES.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination state
  const [payrollPage, setPayrollPage] = useState(1);
  const [payrollPerPage, setPayrollPerPage] = useState(10);
  const payrollTotalPages = Math.max(1, Math.ceil(filteredEmployees.length / payrollPerPage));
  const paginatedEmployees = useMemo(() => {
    const start = (payrollPage - 1) * payrollPerPage;
    return filteredEmployees.slice(start, start + payrollPerPage);
  }, [filteredEmployees, payrollPage, payrollPerPage]);

  return (
    <div className="px-1 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6 max-w-7xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-border gap-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'pb-3 text-[var(--text-sm)] whitespace-nowrap transition-colors cursor-pointer shrink-0',
              activeTab === tab.id
                ? "text-chart-3 font-[var(--font-weight-semibold)] border-b-2 border-chart-3"
                : 'text-muted-foreground hover:text-foreground font-[var(--font-weight-medium)]'
            )}
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-xl">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search employees, payroll records..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] px-3 ps-10 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow" 
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>
      </div>

      {activeTab === 'overview' && <OverviewTab selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedYear={selectedYear} setSelectedYear={setSelectedYear} months={months} years={years} />}
      {activeTab === 'employees' && (
        <>
          <EmployeesTab filteredEmployees={paginatedEmployees} handleGeneratePayslip={handleGeneratePayslip} />
          <Pagination
            currentPage={payrollPage}
            totalPages={payrollTotalPages}
            itemsPerPage={payrollPerPage}
            onPageChange={setPayrollPage}
            onItemsPerPageChange={(n) => { setPayrollPerPage(n); setPayrollPage(1); }}
            totalItems={filteredEmployees.length}
          />
        </>
      )}
      {activeTab === 'compensation' && <CompensationTab />}
      {activeTab === 'deductions' && <DeductionsTab />}

      {/* Payslip Modal */}
      {showPayslipModal && selectedEmployee && (
        <PayslipModal employee={selectedEmployee} onClose={() => setShowPayslipModal(false)} onDownload={handleDownloadPayslip} selectedMonth={selectedMonth} selectedYear={selectedYear} />
      )}
    </div>
  );
};

// ════════════════════════════════════
// ── Overview Tab ──
// ════════════════════════════════════
const OverviewTab = ({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, months, years }: any) => (
  <div className="space-y-6 max-w-3xl mx-auto">
    <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Payroll Overview</h3>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard icon={Users} label="Total Employees" value={EMPLOYEES.length.toString()} color="text-primary" />
      <SummaryCard icon={DollarSign} label="Monthly Payroll" value={`$${EMPLOYEES.reduce((sum, emp) => sum + emp.netPay, 0).toLocaleString()}`} color="text-chart-3" />
      <SummaryCard icon={TrendingUp} label="Pending Actions" value="3" color="text-accent" />
    </div>

    {/* Quick Payslip Generator */}
    <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)] space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Quick Payslip Generator</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            Month
          </label>
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-full min-h-[44px] border border-border rounded-[var(--radius-input)] bg-input-background text-foreground">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month: string) => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            Year
          </label>
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="w-full min-h-[44px] border border-border rounded-[var(--radius-input)] bg-input-background text-foreground">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year: string) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    {/* Notifications */}
    <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)] space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Recent Activity</span>
      </div>
      <div className="space-y-3">
        <NotificationItem 
          icon={CheckCircle} 
          iconColor="text-chart-3" 
          bgColor="bg-chart-3/10" 
          borderColor="border-chart-3/30"
          title={`Payroll processed successfully for ${selectedMonth} ${selectedYear}`}
          description={`All ${EMPLOYEES.length} employees have been processed`}
        />
        <NotificationItem 
          icon={Clock} 
          iconColor="text-accent" 
          bgColor="bg-accent/10" 
          borderColor="border-accent/30"
          title="3 pending approvals required"
          description="Review compensation adjustments before processing"
        />
        <NotificationItem 
          icon={AlertCircle} 
          iconColor="text-primary" 
          bgColor="bg-primary/10" 
          borderColor="border-primary/30"
          title="Tax regulations updated"
          description="Review new tax brackets for next payroll cycle"
        />
      </div>
    </div>
  </div>
);

// ════════════════════════════════════
// ── Employees Tab ──
// ════════════════════════════════════
const EmployeesTab = ({ filteredEmployees, handleGeneratePayslip }: any) => (
  <div className="space-y-6 max-w-6xl mx-auto">
    <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Employee Payroll</h3>

    <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
      <div className="overflow-x-auto">
        <table className="w-full md:min-w-max text-[var(--text-sm)]">
          <thead className="bg-muted border-b border-border">
            <tr>
              <TableHeader>SESA ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Department</TableHeader>
              <TableHeader>Gross Salary</TableHeader>
              <TableHeader>Total Deductions</TableHeader>
              <TableHeader>Net Pay</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee: any, index: number) => (
              <tr
                key={employee.id}
                className={cn(
                  'border-b border-border last:border-0 hover:bg-muted/50 transition-colors',
                  index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                )}
              >
                <TableCell>{employee.sesaId}</TableCell>
                <TableCell weight="medium">{employee.name}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>${employee.grossSalary.toLocaleString()}</TableCell>
                <TableCell>${employee.totalDeductions.toLocaleString()}</TableCell>
                <TableCell weight="semibold" color="text-chart-3">${employee.netPay.toLocaleString()}</TableCell>
                <td className="px-3 py-3 whitespace-nowrap">
                  <button
                    onClick={() => handleGeneratePayslip(employee)}
                    className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] text-primary hover:text-chart-3 transition-colors cursor-pointer"
                    aria-label="View payslip"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ════════════════════════════════════
// ── Compensation Tab ──
// ════════════════════════════════════
const CompensationTab = () => (
  <div className="space-y-6 max-w-3xl mx-auto">
    <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Compensation Structure</h3>

    <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)] space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Compensation Items</span>
      </div>
      <div className="space-y-3">
        {COMPENSATION_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-[var(--radius)] border border-border">
            <div>
              <p className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                {item.name}
              </p>
              <p className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                {item.type} {item.taxable ? '• Taxable' : '• Non-taxable'}
              </p>
            </div>
            <DollarSign className="w-5 h-5 text-chart-3" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ════════════════════════════════════
// ── Deductions Tab ──
// ════════════════════════════════════
const DeductionsTab = () => (
  <div className="space-y-6 max-w-3xl mx-auto">
    <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">Payroll Deductions</h3>

    <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)] space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground">Deduction Items</span>
      </div>
      <div className="space-y-3">
        {DEDUCTION_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-[var(--radius)] border border-border">
            <div>
              <p className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                {item.name}
              </p>
              <p className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                {'percentage' in item ? `${item.percentage}% of gross salary` : `Fixed amount: $${item.amount}`} {item.mandatory ? '• Mandatory' : '• Optional'}
              </p>
            </div>
            <span className="text-[var(--text-base)] font-[var(--font-weight-semibold)] text-primary" style={{ fontFamily: "'Inter', sans-serif" }}>
              {'percentage' in item ? `${item.percentage}%` : `$${item.amount}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ════════════════════════════════════
// ── Reusable Components ──
// ════════════════════════════════════
const SummaryCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)]">
    <div className="flex items-center gap-3 mb-2">
      <Icon className={cn("w-5 h-5", color)} />
      <p className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
        {label}
      </p>
    </div>
    <p className="text-[var(--text-2xl)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      {value}
    </p>
  </div>
);

const NotificationItem = ({ icon: Icon, iconColor, bgColor, borderColor, title, description }: any) => (
  <div className={cn("flex items-start gap-3 p-3 rounded-[var(--radius)] border", bgColor, borderColor)}>
    <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", iconColor)} />
    <div>
      <p className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
        {title}
      </p>
      <p className="text-[var(--text-xs)] text-muted-foreground mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
        {description}
      </p>
    </div>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th className="text-start px-3 py-3 whitespace-nowrap text-[var(--text-sm)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>
    {children}
  </th>
);

const TableCell = ({ children, weight = 'normal', color = 'text-foreground' }: { children: React.ReactNode; weight?: 'normal' | 'medium' | 'semibold'; color?: string }) => (
  <td className={cn("px-3 py-3 whitespace-nowrap text-[var(--text-sm)]", color)} style={{ fontFamily: "'Inter', sans-serif", fontWeight: weight === 'normal' ? 'var(--font-weight-normal)' : weight === 'medium' ? 'var(--font-weight-medium)' : 'var(--font-weight-semibold)' }}>
    {children}
  </td>
);

// ════════════════════════════════════
// ── Payslip Modal ──
// ════════════════════════════════════
const PayslipModal = ({ employee, onClose, onDownload, selectedMonth, selectedYear }: any) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-card border border-border rounded-[var(--radius-card)] shadow-[var(--elevation-lg)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
        <div>
          <h2 className="text-[var(--text-lg)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            Payslip - {selectedMonth} {selectedYear}
          </h2>
          <p className="text-[var(--text-sm)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            {employee.name}
          </p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Employee Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-[var(--radius)] border border-border">
          <InfoRow label="SESA ID" value={employee.sesaId} />
          <InfoRow label="Position" value={employee.position} />
          <InfoRow label="Department" value={employee.department} />
          <InfoRow label="Employee ID" value={employee.id} />
        </div>

        {/* Earnings */}
        <div>
          <h3 className="text-[var(--text-base)] font-[var(--font-weight-semibold)] text-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Earnings
          </h3>
          <div className="space-y-2">
            <PayslipRow label="Gross Salary" value={`$${employee.grossSalary.toLocaleString()}`} />
            <PayslipRow label="COLA Allowance" value={`$${employee.colaAllowance.toLocaleString()}`} />
            <PayslipRow label="Bonus" value={`$${employee.bonus.toLocaleString()}`} />
            <PayslipRow label="Total Allowances" value={`$${employee.totalAllowances.toLocaleString()}`} bold />
          </div>
        </div>

        {/* Deductions */}
        <div>
          <h3 className="text-[var(--text-base)] font-[var(--font-weight-semibold)] text-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Deductions
          </h3>
          <div className="space-y-2">
            <PayslipRow label="Tax Deducted" value={`$${employee.taxDeducted.toLocaleString()}`} />
            <PayslipRow label="Social Insurance" value={`$${employee.socialInsurance.toLocaleString()}`} />
            <PayslipRow label="Pension (Employee Share)" value={`$${employee.pensionEmployeeShare.toLocaleString()}`} />
            <PayslipRow label="Family Deductions" value={`$${employee.familyDeductions.toLocaleString()}`} />
            <PayslipRow label="Total Deductions" value={`$${employee.totalDeductions.toLocaleString()}`} bold />
          </div>
        </div>

        {/* Net Pay */}
        <div className="p-4 bg-chart-3/10 border border-chart-3/30 rounded-[var(--radius)]">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-lg)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              Net Pay
            </span>
            <span className="text-[var(--text-2xl)] font-[var(--font-weight-bold)] text-chart-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              ${employee.netPay.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border flex gap-3 justify-end">
        <button onClick={onClose} className="h-10 px-4 border border-border rounded-[var(--radius-button)] text-[var(--text-sm)] font-[var(--font-weight-medium)] hover:bg-muted transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>
          Close
        </button>
        <button onClick={onDownload} className="h-10 px-4 rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white text-[var(--text-sm)] font-[var(--font-weight-medium)] flex items-center gap-2 transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>
          <Download className="w-4 h-4" /> Download Payslip
        </button>
      </div>
    </div>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[var(--text-xs)] text-muted-foreground mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {label}
    </p>
    <p className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      {value}
    </p>
  </div>
);

const PayslipRow = ({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) => (
  <div className={cn("flex items-center justify-between py-2 border-b border-border last:border-0", bold && "pt-3")}>
    <span className={cn("text-[var(--text-sm)] text-foreground", bold && "font-[var(--font-weight-semibold)]")} style={{ fontFamily: "'Inter', sans-serif" }}>
      {label}
    </span>
    <span className={cn("text-[var(--text-sm)] text-foreground", bold && "font-[var(--font-weight-semibold)]")} style={{ fontFamily: "'Inter', sans-serif" }}>
      {value}
    </span>
  </div>
);
