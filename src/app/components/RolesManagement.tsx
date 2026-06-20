import React, { useState, useMemo } from 'react';
import { Trash2, Plus, Upload, ChevronLeft, ChevronRight, Pencil, X, AlertCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { localizePersonName } from '@/lib/localizedNames';

// ── Interfaces ──
interface RoleAssignment {
  id: string;
  employeeName: string;
  employeeNumber: string;
  dateEnrolled: string;
  dateLeft: string;
  jobTitle: string;
  department: string;
}

// ── Mock Data ──
const ROLE_ASSIGNMENTS: RoleAssignment[] = [
  { id: '1', employeeName: 'Muhammed Nasir', employeeNumber: '41251', dateEnrolled: '12 Feb 2020', dateLeft: '---', jobTitle: 'Admin', department: 'IT' },
  { id: '2', employeeName: 'Layla El-Amin', employeeNumber: '77541', dateEnrolled: '15 Jan 2021', dateLeft: '---', jobTitle: 'Super Admin', department: 'IT' },
  { id: '3', employeeName: 'Li Wei Su', employeeNumber: '19790', dateEnrolled: '03 Mar 2019', dateLeft: '---', jobTitle: 'HR Specialist', department: 'HR' },
  { id: '4', employeeName: 'Dmitri Reznikov', employeeNumber: '14740', dateEnrolled: '22 Apr 2022', dateLeft: '01 Nov 2024', jobTitle: 'Financial Reviewer', department: 'Finance' },
  { id: '5', employeeName: 'Amara Okonkwo', employeeNumber: '30714', dateEnrolled: '10 Jun 2020', dateLeft: '---', jobTitle: 'Accountant', department: 'Finance' },
  { id: '6', employeeName: 'Pablo Morales', employeeNumber: '63020', dateEnrolled: '28 Aug 2018', dateLeft: '---', jobTitle: 'Financial Specialist', department: 'Finance' },
  { id: '7', employeeName: 'Fatima Waluyo', employeeNumber: '39244', dateEnrolled: '05 Dec 2021', dateLeft: '---', jobTitle: 'Team Leader', department: 'Operations' },
  { id: '8', employeeName: 'Johan Andersen', employeeNumber: '25262', dateEnrolled: '17 Sep 2019', dateLeft: '---', jobTitle: 'HR Manager', department: 'HR' },
];

const DEPARTMENTS = ['All', 'IT', 'HR', 'Finance', 'Operations', 'Marketing', 'Sales'];
const JOB_TITLES = ['Admin', 'Super Admin', 'HR Specialist', 'HR Manager', 'Team Leader', 'Financial Specialist', 'Financial Reviewer', 'Accountant'];

// ── CSS Classes ──
const inputClass = 'h-[44px] w-full px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] text-start focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const labelClass = 'text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground';

// ── Form Field Component ──
const FormField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label className={labelClass}>{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  </div>
);

// ── Select Field Component ──
const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}> = ({ label, value, onChange, options, placeholder }) => (
  <div className="space-y-1.5">
    <label className={labelClass}>{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 rounded-[var(--radius-input)]">
        <SelectValue placeholder={placeholder || 'Select...'} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

// ── Main Component ──
export const RolesManagement: React.FC = () => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageInput, setPageInput] = useState('1');

  // Modals
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [deleteRoleOpen, setDeleteRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleAssignment | null>(null);

  // Add Role Form
  const [newPosition, setNewPosition] = useState('');
  const [newManager, setNewManager] = useState('');

  // Edit Role Form
  const [editPosition, setEditPosition] = useState('');
  const [editManager, setEditManager] = useState('');

  // Filter & Search
  const filteredRoles = useMemo(() => {
    let result = [...ROLE_ASSIGNMENTS];

    // Department filter
    if (departmentFilter !== 'All') {
      result = result.filter((r) => r.department === departmentFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(q) ||
          r.employeeNumber.toLowerCase().includes(q) ||
          r.jobTitle.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, departmentFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / itemsPerPage));
  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRoles.slice(start, start + itemsPerPage);
  }, [filteredRoles, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
    setPageInput(String(p));
  };

  // Handlers
  const handleAddRole = () => {
    if (!newPosition.trim() || !newManager.trim()) {
      toast.error('All fields are required');
      return;
    }
    toast.success('Role added successfully', {
      description: `${newPosition} assigned to ${newManager}`,
    });
    setNewPosition('');
    setNewManager('');
    setAddRoleOpen(false);
  };

  const handleEditRole = (role: RoleAssignment) => {
    setSelectedRole(role);
    setEditPosition(role.jobTitle);
    setEditManager(role.employeeName);
    setEditRoleOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editPosition.trim() || !editManager.trim()) {
      toast.error('All fields are required');
      return;
    }
    toast.success('Role updated successfully', {
      description: `Updated ${localizePersonName(selectedRole?.employeeName, language)}'s role`,
    });
    setEditRoleOpen(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = (role: RoleAssignment) => {
    setSelectedRole(role);
    setDeleteRoleOpen(true);
  };

  const handleConfirmDelete = () => {
    toast.success('Role removed successfully', {
      description: `${localizePersonName(selectedRole?.employeeName, language)}'s role has been removed`,
    });
    setDeleteRoleOpen(false);
    setSelectedRole(null);
  };

  const handleUploadData = () => {
    toast.info('Upload feature', {
      description: 'File upload dialog would appear here',
    });
  };

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Page Title ── */}
      <div>
        <h2
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--page-title-size)',
            fontWeight: 'var(--page-title-weight)',
          }}
          className="text-foreground"
        >
          Roles Management
        </h2>
      </div>

      {/* ── Filters & Actions Row ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Department Filter */}
        <div className="flex-1 max-w-md space-y-1.5">
          <label className={labelClass}>Department</label>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="h-10 rounded-[var(--radius-input)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-chart-3 hover:bg-chart-3/90 text-white gap-2 rounded-[var(--radius-button)]" onClick={() => setAddRoleOpen(true)}>
            <Plus className="w-4 h-4" /> Add New Role
          </Button>
          <Button variant="outline" className="hidden sm:flex w-full sm:w-auto gap-2 rounded-[var(--radius-button)]" onClick={handleUploadData}>
            <Upload className="w-4 h-4" /> Upload Data
          </Button>
        </div>
      </div>

      {/* ── Roles List Table ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h3
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--section-heading-size)',
              fontWeight: 'var(--section-heading-weight)',
            }}
            className="text-foreground"
          >
            Roles List
          </h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="cursor-pointer">
                <Info className="w-4 h-4 text-primary" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[var(--text-xs)]">
              <p>Manage employee role assignments and permissions</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden shadow-[var(--elevation-sm)]">
          <div className="overflow-x-auto">
            <table className="w-full md:min-w-max text-[var(--text-sm)] text-start">
              <thead className="hidden md:table-header-group">
                <tr className="bg-muted border-b border-border">
                  <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">
                    Employee Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">
                    Date Enrolled
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">
                    Date Left
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">
                    Job Title
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-muted/30 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-b-0 group">
                    <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground font-[var(--font-weight-medium)] flex justify-between md:table-cell">
                      <span className="md:hidden text-muted-foreground font-[var(--font-weight-medium)]">Name:</span>
                      <span>{localizePersonName(role.employeeName, language)}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground flex justify-between md:table-cell">
                      <span className="md:hidden text-muted-foreground font-[var(--font-weight-medium)]">Enrolled:</span>
                      <span>{role.dateEnrolled}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-1 md:py-3 text-muted-foreground flex justify-between md:table-cell">
                      <span className="md:hidden text-muted-foreground font-[var(--font-weight-medium)]">Left:</span>
                      <span>{role.dateLeft}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-1 md:py-3 text-foreground flex justify-between md:table-cell">
                      <span className="md:hidden text-muted-foreground font-[var(--font-weight-medium)]">Title:</span>
                      <span>{role.jobTitle}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 md:text-end mt-2 md:mt-0">
                      <div className="flex flex-col md:flex-row items-center md:justify-end gap-2 w-full md:w-auto">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="w-full md:w-auto flex justify-center items-center gap-2 p-2 min-h-[44px] md:min-h-0 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer border border-border md:border-none"
                          title="Edit Role"
                        >
                          <span className="md:hidden">Edit Role</span>
                          <Pencil className="w-4 h-4 text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="w-full md:w-auto flex justify-center items-center gap-2 p-2 min-h-[44px] md:min-h-0 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer border border-destructive text-destructive md:border-none"
                          title="Delete Role"
                        >
                          <span className="md:hidden">Delete Role</span>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2 text-[var(--text-sm)] text-muted-foreground w-full sm:w-auto justify-center sm:justify-start whitespace-nowrap shrink-0">
              Items Per Page
              <Select
                value={String(itemsPerPage)}
                onValueChange={(v) => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
                  setPageInput('1');
                }}
              >
                <SelectTrigger className="h-8 w-20 rounded-[var(--radius-input)] bg-input-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="min-w-11 min-h-11 sm:min-w-8 sm:min-h-8 p-1.5 flex items-center justify-center border border-border rounded-[var(--radius-sm)] hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <span className="text-[var(--text-sm)] text-foreground flex items-center gap-1">
                Page
                <input
                  type="text"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={() => handlePageChange(Number(pageInput) || 1)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePageChange(Number(pageInput) || 1)}
                  className="w-10 h-8 text-center border border-border rounded-[var(--radius-input)] bg-input-background text-foreground focus:ring-2 focus:ring-ring/50 outline-none text-[var(--text-sm)]"
                  aria-label="Page number input"
                />
                of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="min-w-11 min-h-11 sm:min-w-8 sm:min-h-8 p-1.5 flex items-center justify-center border border-border rounded-[var(--radius-sm)] hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Add New Role Modal ── */}
      <Dialog open={addRoleOpen} onOpenChange={setAddRoleOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              Add New Role
            </DialogTitle>
            <DialogDescription className="sr-only">Add a new role assignment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <FormField
              label="Position"
              value={newPosition}
              onChange={setNewPosition}
              placeholder="Enter position title"
            />
            <SelectField
              label="Manager"
              value={newManager}
              onChange={setNewManager}
              options={['Select Manager', 'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams']}
              placeholder="Select manager"
            />
            <div className="flex flex-row items-center justify-center sm:justify-end gap-2 pt-2 w-full">
              <Button variant="outline" onClick={() => setAddRoleOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-chart-3 hover:bg-chart-3/90 text-white rounded-[var(--radius-button)]"
                onClick={handleAddRole}
              >
                Add New Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Role Modal ── */}
      <Dialog open={editRoleOpen} onOpenChange={setEditRoleOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              Edit Role for {localizePersonName(selectedRole?.employeeName, language)}
            </DialogTitle>
            <DialogDescription className="sr-only">Edit role assignment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <FormField
              label="Position"
              value={editPosition}
              onChange={setEditPosition}
              placeholder="Enter position title"
            />
            <SelectField
              label="Manager"
              value={editManager}
              onChange={setEditManager}
              options={['Select Manager', 'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams']}
              placeholder="Select manager"
            />
            <div className="flex flex-row items-center justify-center sm:justify-end gap-2 pt-2 w-full">
              <Button variant="outline" onClick={() => setEditRoleOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-chart-3 hover:bg-chart-3/90 text-white rounded-[var(--radius-button)]"
                onClick={handleSaveEdit}
              >
                Save Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Role Confirmation Modal ── */}
      <Dialog open={deleteRoleOpen} onOpenChange={setDeleteRoleOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              Confirm Role Removal
            </DialogTitle>
            <DialogDescription className="sr-only">Confirm role removal</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-[var(--radius)] border border-border">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                }}
                className="text-foreground"
              >
                Are you sure you want to remove this role? This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-row items-center justify-center sm:justify-end gap-2 pt-2 w-full">
              <Button variant="outline" onClick={() => setDeleteRoleOpen(false)}>
                Dismiss
              </Button>
              <Button
                variant="destructive"
                className="rounded-[var(--radius-button)]"
                onClick={handleConfirmDelete}
              >
                Remove
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
