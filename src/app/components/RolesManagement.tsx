import React, { useState, useMemo } from 'react';
import { Trash2, Plus, Upload, ChevronLeft, ChevronRight, Pencil, X, AlertCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
const inputClass = 'h-10 w-full px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
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
      description: `Updated ${selectedRole?.employeeName}'s role`,
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
      description: `${selectedRole?.employeeName}'s role has been removed`,
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
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
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
        <p className="text-[var(--page-subtitle-size)] text-muted-foreground mt-1">
          Manage user roles and access permissions.
        </p>
      </div>

      {/* ── Filters & Actions Row ── */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Department Filter */}
        <div className="w-52 space-y-1.5">
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
        <div className="flex items-center gap-3 ml-auto">
          <Button variant="outline" className="gap-2" onClick={handleUploadData}>
            <Upload className="w-4 h-4" /> Upload Data
          </Button>
          <Button
            className="bg-chart-3 hover:bg-chart-3/90 text-white gap-2 rounded-[var(--radius-button)]"
            onClick={() => setAddRoleOpen(true)}
          >
            <Plus className="w-4 h-4" /> Add New Role
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
            <table className="w-full text-[var(--text-sm)] text-left">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">
                    Employee Name
                  </th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">
                    Date Enrolled
                  </th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">
                    Date Left
                  </th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground">
                    Job Title
                  </th>
                  <th className="px-4 py-3 font-[var(--font-weight-medium)] text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground font-[var(--font-weight-medium)]">
                      {role.employeeName}
                    </td>
                    <td className="px-4 py-3 text-foreground">{role.dateEnrolled}</td>
                    <td className="px-4 py-3 text-muted-foreground">{role.dateLeft}</td>
                    <td className="px-4 py-3 text-foreground">{role.jobTitle}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer"
                          title="Edit Role"
                        >
                          <Pencil className="w-4 h-4 text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] transition-colors cursor-pointer"
                          title="Delete Role"
                        >
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2 text-[var(--text-sm)] text-muted-foreground">
              Items Per Page
              <Select
                value={String(itemsPerPage)}
                onValueChange={(v) => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
                  setPageInput('1');
                }}
              >
                <SelectTrigger className="h-8 w-20 rounded-[var(--radius-input)]">
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 border border-border rounded-[var(--radius-sm)] hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                  className="w-10 h-8 text-center border border-border rounded-[var(--radius-input)] bg-input-background text-foreground focus:ring-2 focus:ring-ring/50 outline-none"
                />
                of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-border rounded-[var(--radius-sm)] hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
            <div className="flex justify-end gap-2 pt-2">
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
              Edit Role for {selectedRole?.employeeName}
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
            <div className="flex justify-end gap-2 pt-2">
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
            <div className="flex justify-end gap-2 pt-2">
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
