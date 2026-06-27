import { supabase, isSupabaseConfigured } from '../supabaseClient';

// --- TS Interfaces ---

export interface Employee {
  id: string;
  name: string | { nameEn: string; nameAr: string };
  employeeNumber: string;
  department: string;
  jobTitle: string;
  email: string;
  phone: string;
  gender: string;
  contractType: string;
  hireDate: string;
  activityType: string;
  isManager: boolean;
  img: string;
}

export interface LeaveRequest {
  id: string;
  name: string;
  img?: string;
  type: string;
  range: string;
  duration: string;
  notes: string;
  status?: string;
  employeeNumber?: string;
  department?: string;
  jobTitle?: string;
  contractType?: string;
  activityType?: string;
  startDate?: string;
  endDate?: string;
}

export interface MissionRequest {
  id: string;
  name: string;
  img?: string;
  type: string;
  range: string;
  duration: string;
  notes: string;
  status?: string;
  employeeNumber?: string;
  reason?: string;
  department?: string;
  jobTitle?: string;
  contractType?: string;
  activityType?: string;
  startDate?: string;
  endDate?: string;
}

export interface AttendanceEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
  notes?: string;
}

export interface PayrollEntry {
  id: string;
  employeeName: string;
  employeeNumber: string;
  jobTitle: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string;
  status: 'Paid' | 'Pending';
}

export interface Department {
  id: string;
  name: string;
  deptId: string;
  totalNumber: number;
}

export interface JobTitle {
  id: string;
  title: string;
  count: number;
}

export interface ActivityEntry {
  id: string;
  admin: string;
  action: string;
  date: string;
  affectedCount: number;
  affectedEmployeeNumber: string;
}

const isRowLevelSecurityError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String((error as any)?.message || error || '');
  return message.toLowerCase().includes('row-level security');
};

const isMissingRpcFunctionError = (error: unknown, functionName: string): boolean => {
  const message = error instanceof Error ? error.message : String((error as any)?.message || error || '');
  return message.includes(functionName) && message.toLowerCase().includes('schema cache');
};

const missingSubmissionFunctionMessage = (functionName: string): string =>
  `The database is missing ${functionName}. Run supabase/repair-mission-submission-functions.sql in Supabase SQL Editor, then try again.`;


// --- LOCAL STORAGE CACHE HELPERS (Fallback Mode) ---

const getCache = <T>(key: string, initialData: T[]): T[] => {
  const cached = localStorage.getItem(`hr_tool_${key}`);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return initialData;
    }
  }
  localStorage.setItem(`hr_tool_${key}`, JSON.stringify(initialData));
  return initialData;
};

const setCache = <T>(key: string, data: T[]): void => {
  localStorage.setItem(`hr_tool_${key}`, JSON.stringify(data));
};

// --- INITIAL MOCK DATA SEEDS ---

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Aleksander Garcia', employeeNumber: '12345', department: 'Marketing', jobTitle: 'Senior Solutions Architect', email: 'alex.garcia@acme.com', phone: '+972(0) 2788-9451', gender: 'Male', contractType: 'Freelance', hireDate: '2023-04-15', activityType: 'Direct', isManager: false, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: '2', name: 'Tanvi Lumari', employeeNumber: '54321', department: 'Sales', jobTitle: 'Global Operations Manager', email: 'tanvi.l@acme.com', phone: '+972(0) 2788-9452', gender: 'Female', contractType: 'Permanent', hireDate: '2022-01-10', activityType: 'Direct', isManager: true, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: '3', name: 'Jack Gray', employeeNumber: '98765', department: 'Software', jobTitle: 'Senior Project Manager', email: 'jack.g@acme.com', phone: '+972(0) 2788-9453', gender: 'Male', contractType: 'Permanent', hireDate: '2021-08-22', activityType: 'Direct', isManager: false, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: '4', name: 'Saad Jawahir', employeeNumber: '24680', department: 'SCADA', jobTitle: 'Senior Cybersecurity Specialist', email: 'saad.j@acme.com', phone: '+972(0) 2788-9454', gender: 'Male', contractType: 'Contract', hireDate: '2023-11-01', activityType: 'InDirect', isManager: false, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: '5', name: 'Imani Adimbola', employeeNumber: '24252', department: 'Oil & Gas', jobTitle: 'Director of Supply Chain Optimization', email: 'imani.a@acme.com', phone: '+972(0) 2788-9455', gender: 'Female', contractType: 'Permanent', hireDate: '2020-03-14', activityType: 'Direct', isManager: true, img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop' }
];

const INITIAL_LEAVES: LeaveRequest[] = [
  { id: 'l1', name: 'Sara Abdallah', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', type: 'Sick', range: 'Sep 10 - Sep 14', duration: '5 days', notes: 'Fever and flu', employeeNumber: '49201', status: 'pending' },
  { id: 'l2', name: 'Vinay Ansari', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', type: 'Vacation', range: 'Oct 5 - Oct 12', duration: '8 days', notes: 'Annual leave', employeeNumber: '31245', status: 'pending' },
  { id: 'l3', name: 'Sara Kasongo', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop', type: 'Sick', range: 'Nov 3 - Nov 6', duration: '4 days', notes: 'Stomachache', employeeNumber: '20124', status: 'approved' },
  { id: 'l4', name: 'María Fernanda', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', type: 'Vacation', range: 'Dec 20 - Jan 2', duration: '14 days', notes: 'Holiday travel', employeeNumber: '55102', status: 'approved' },
  { id: 'l5', name: 'Luka Silva', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', type: 'Vacation', range: 'Jan 15 - Jan 17', duration: '3 days', notes: 'Cold symptoms', employeeNumber: '12098', status: 'rejected' }
];

const INITIAL_MISSIONS: MissionRequest[] = [
  { id: 'm1', name: 'Sara Abdallah', employeeNumber: '49201', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', type: 'Work From Home', range: 'Sep 10 - Sep 14', duration: '5 days', notes: 'Remote work for project', reason: 'Project deadline requires focus time', status: 'pending' },
  { id: 'm2', name: 'Vinay Ansari', employeeNumber: '31245', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', type: 'Work From Home', range: 'Oct 5 - Oct 12', duration: '8 days', notes: 'Personal reasons', reason: 'Working remotely for personal convenience', status: 'pending' },
  { id: 'm3', name: 'Sara Kasongo', employeeNumber: '20124', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop', type: 'Client Visit', range: 'Nov 3 - Nov 6', duration: '4 days', notes: 'Client site visit', reason: 'On-site client requirements review', status: 'approved' },
  { id: 'm4', name: 'María Fernanda', employeeNumber: '55102', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', type: 'Training', range: 'Dec 20 - Jan 2', duration: '14 days', notes: 'Professional training', reason: 'Advanced cybersecurity certification', status: 'approved' },
  { id: 'm5', name: 'Luka Silva', employeeNumber: '12098', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', type: 'Visa Issuing', range: 'Jan 15 - Jan 17', duration: '3 days', notes: 'Visa appointment', reason: 'Travel visa processing', status: 'rejected' }
];

const INITIAL_ATTENDANCE: AttendanceEntry[] = [];
const INITIAL_PAYROLL: PayrollEntry[] = [];

const INITIAL_DEPARTMENTS: Department[] = [
  { id: '1', name: 'Marketing', deptId: 'D1001', totalNumber: 23 },
  { id: '2', name: 'Software', deptId: 'D1002', totalNumber: 45 },
  { id: '3', name: 'Oil & Gas', deptId: 'D1003', totalNumber: 31 },
  { id: '4', name: 'Sales', deptId: 'D1004', totalNumber: 18 },
  { id: '5', name: 'SCADA', deptId: 'D1005', totalNumber: 12 }
];

const INITIAL_JOB_TITLES: JobTitle[] = [
  { id: '1', title: 'Cybersecurity Engineer', count: 5 },
  { id: '2', title: 'Software Developer', count: 12 },
  { id: '3', title: 'Senior Project Manager', count: 3 },
  { id: '4', title: 'Solutions Architect', count: 7 }
];

const INITIAL_ACTIVITY_LOG: ActivityEntry[] = [
  { id: '1', admin: 'Muhammed Habib', action: 'Edited Employee Info', date: 'February 25, 2013', affectedCount: 2, affectedEmployeeNumber: '12345' },
  { id: '2', admin: 'Lena Mohamed', action: 'Terminated Employee', date: 'April 25, 2011', affectedCount: 1, affectedEmployeeNumber: '54321' },
  { id: '3', admin: 'Mohammed Habib', action: 'Added New Employee', date: 'January 4, 2014', affectedCount: 3, affectedEmployeeNumber: '98765' },
  { id: '4', admin: 'Mohammed Habib', action: 'Edited Access Card Details', date: 'January 4, 2014', affectedCount: 1, affectedEmployeeNumber: '98765' }
];


// --- API SERVICES ---

export const EmployeeService = {
  async getAll(): Promise<Employee[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          id,
          employee_number,
          first_name,
          last_name,
          first_name_ar,
          last_name_ar,
          email,
          phone,
          gender,
          contract_type,
          hire_date,
          activity_type,
          is_manager,
          img_url,
          departments ( name ),
          job_titles ( title )
        `);
      if (error) throw error;
      return (data || []).map((e: any) => ({
        id: e.id,
        name: e.first_name_ar && e.last_name_ar ? {
          nameEn: `${e.first_name} ${e.last_name}`,
          nameAr: `${e.first_name_ar} ${e.last_name_ar}`
        } : `${e.first_name} ${e.last_name}`,
        employeeNumber: e.employee_number,
        department: e.departments?.name || 'Unassigned',
        jobTitle: e.job_titles?.title || 'Unassigned',
        email: e.email,
        phone: e.phone || '',
        gender: e.gender || '',
        contractType: e.contract_type || 'Full-Time',
        hireDate: e.hire_date,
        activityType: e.activity_type || 'Direct',
        isManager: e.is_manager,
        img: e.img_url || ''
      }));
    }
    return getCache('employees', INITIAL_EMPLOYEES);
  },

  async create(employee: Omit<Employee, 'id'>): Promise<Employee> {
    if (isSupabaseConfigured) {
      const nameStr = typeof employee.name === 'string' ? employee.name : (employee.name?.nameEn || '');
      const [first_name, ...last_names] = nameStr.split(' ');
      const last_name = last_names.join(' ') || 'Employee';

      // Insert dummy auth user first if on remote, or rely on triggers/admins.
      // Usually admins invite users. For simplicity:
      const { data, error } = await supabase
        .from('employees')
        .insert({
          employee_number: employee.employeeNumber,
          first_name,
          last_name,
          email: employee.email,
          phone: employee.phone,
          gender: employee.gender,
          contract_type: employee.contractType,
          hire_date: employee.hireDate,
          activity_type: employee.activityType,
          is_manager: employee.isManager,
          img_url: employee.img
        })
        .select()
        .single();
      if (error) throw error;
      return {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        employeeNumber: data.employee_number,
        department: employee.department,
        jobTitle: employee.jobTitle,
        email: data.email,
        phone: data.phone || '',
        gender: data.gender || '',
        contractType: data.contract_type,
        hireDate: data.hire_date,
        activityType: data.activity_type,
        isManager: data.is_manager,
        img: data.img_url || ''
      };
    }

    const cached = getCache('employees', INITIAL_EMPLOYEES);
    const newEmployee = { ...employee, id: Math.random().toString(36).substr(2, 9) };
    cached.push(newEmployee);
    setCache('employees', cached);
    return newEmployee;
  },

  async update(id: string, updates: Partial<Employee>): Promise<void> {
    if (isSupabaseConfigured) {
      const dbUpdates: any = {};
      if (updates.name) {
        const nameStr = typeof updates.name === 'string' ? updates.name : (updates.name?.nameEn || '');
        const [first_name, ...last_names] = nameStr.split(' ');
        dbUpdates.first_name = first_name;
        dbUpdates.last_name = last_names.join(' ') || 'Employee';
      }
      if (updates.employeeNumber) dbUpdates.employee_number = updates.employeeNumber;
      if (updates.email) dbUpdates.email = updates.email;
      if (updates.phone) dbUpdates.phone = updates.phone;
      if (updates.gender) dbUpdates.gender = updates.gender;
      if (updates.contractType) dbUpdates.contract_type = updates.contractType;
      if (updates.hireDate) dbUpdates.hire_date = updates.hireDate;
      if (updates.activityType) dbUpdates.activity_type = updates.activityType;
      if (updates.isManager !== undefined) dbUpdates.is_manager = updates.isManager;
      if (updates.img) dbUpdates.img_url = updates.img;

      const { error } = await supabase
        .from('employees')
        .update(dbUpdates)
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const cached = getCache('employees', INITIAL_EMPLOYEES);
    const index = cached.findIndex(e => e.id === id);
    if (index !== -1) {
      cached[index] = { ...cached[index], ...updates };
      setCache('employees', cached);
    }
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
      return;
    }
    const cached = getCache('employees', INITIAL_EMPLOYEES);
    const filtered = cached.filter(e => e.id !== id);
    setCache('employees', filtered);
  }
};

export const LeaveService = {
  async getAll(): Promise<LeaveRequest[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('leaves')
        .select(`
          id,
          leave_type,
          start_date,
          end_date,
          days_count,
          reason,
          status,
          employees:employees!employee_id (
            first_name,
            last_name,
            employee_number,
            img_url,
            contract_type,
            activity_type,
            departments ( name ),
            job_titles ( title )
          )
        `);
      if (error) throw error;
      return (data || []).map((l: any) => ({
        id: l.id,
        name: `${l.employees?.first_name || 'New'} ${l.employees?.last_name || 'Employee'}`,
        img: l.employees?.img_url || '',
        type: l.leave_type,
        range: `${l.start_date} - ${l.end_date}`,
        duration: `${l.days_count} days`,
        notes: l.reason || '',
        status: l.status,
        employeeNumber: l.employees?.employee_number || '',
        department: l.employees?.departments?.name || 'Unassigned',
        jobTitle: l.employees?.job_titles?.title || 'Unassigned',
        contractType: l.employees?.contract_type || '',
        activityType: l.employees?.activity_type || '',
        startDate: l.start_date,
        endDate: l.end_date
      }));
    }
    return getCache('leaves', INITIAL_LEAVES);
  },

  async create(leave: Omit<LeaveRequest, 'id'> & { employeeId: string }): Promise<LeaveRequest> {
    if (isSupabaseConfigured) {
      const [start_date, end_date] = leave.range.split(' - ');
      const days_count = parseInt(leave.duration) || 1;
      const payload = {
        employee_id: leave.employeeId,
        leave_type: leave.type,
        start_date: start_date || new Date().toISOString().split('T')[0],
        end_date: end_date || new Date().toISOString().split('T')[0],
        days_count,
        reason: leave.notes,
        status: 'Pending'
      };
      let { data, error } = await supabase
        .from('leaves')
        .insert(payload)
        .select()
        .single();

      if (error && isRowLevelSecurityError(error)) {
        const rpcResult = await supabase.rpc('create_leave_for_employee', {
          p_employee_id: payload.employee_id,
          p_leave_type: payload.leave_type,
          p_start_date: payload.start_date,
          p_end_date: payload.end_date,
          p_days_count: payload.days_count,
          p_reason: payload.reason || null
        });
        data = rpcResult.data;
        error = rpcResult.error;
      }

      if (error && isMissingRpcFunctionError(error, 'create_leave_for_employee')) {
        throw new Error(missingSubmissionFunctionMessage('create_leave_for_employee'));
      }

      if (error) throw error;
      return {
        id: data.id,
        name: leave.name,
        img: leave.img,
        type: data.leave_type,
        range: leave.range,
        duration: leave.duration,
        notes: data.reason || '',
        status: data.status,
        employeeNumber: leave.employeeNumber
      };
    }

    const cached = getCache('leaves', INITIAL_LEAVES);
    const newLeave = { ...leave, id: Math.random().toString(36).substr(2, 9), status: 'pending' };
    cached.push(newLeave);
    setCache('leaves', cached);
    return newLeave;
  },

  async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('leaves')
        .update({ status: status === 'approved' ? 'Approved' : 'Rejected' })
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const cached = getCache('leaves', INITIAL_LEAVES);
    const index = cached.findIndex(l => l.id === id);
    if (index !== -1) {
      cached[index].status = status;
      setCache('leaves', cached);
    }
  }
};

export const MissionService = {
  async getAll(): Promise<MissionRequest[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('missions')
        .select(`
          id,
          title,
          start_date,
          end_date,
          duration_days,
          destination,
          reason,
          status,
          employees:employees!employee_id (
            first_name,
            last_name,
            employee_number,
            img_url,
            contract_type,
            activity_type,
            departments ( name ),
            job_titles ( title )
          )
        `);
      if (error) throw error;
      return (data || []).map((m: any) => ({
        id: m.id,
        name: `${m.employees?.first_name || 'New'} ${m.employees?.last_name || 'Employee'}`,
        img: m.employees?.img_url || '',
        type: m.title,
        range: `${m.start_date} - ${m.end_date}`,
        duration: `${m.duration_days} days`,
        notes: m.reason || '',
        reason: m.reason || '',
        status: m.status,
        employeeNumber: m.employees?.employee_number || '',
        department: m.employees?.departments?.name || 'Unassigned',
        jobTitle: m.employees?.job_titles?.title || 'Unassigned',
        contractType: m.employees?.contract_type || '',
        activityType: m.employees?.activity_type || '',
        startDate: m.start_date,
        endDate: m.end_date
      }));
    }
    return getCache('missions', INITIAL_MISSIONS);
  },

  async create(mission: Omit<MissionRequest, 'id'> & { employeeId: string }): Promise<MissionRequest> {
    if (isSupabaseConfigured) {
      const [start_date, end_date] = mission.range.split(' - ');
      const duration_days = parseInt(mission.duration) || 1;
      const payload = {
        employee_id: mission.employeeId,
        title: mission.type,
        start_date: start_date || new Date().toISOString().split('T')[0],
        end_date: end_date || new Date().toISOString().split('T')[0],
        duration_days,
        destination: 'Remote / Client Site',
        reason: mission.notes,
        status: 'Pending'
      };
      let { data, error } = await supabase
        .from('missions')
        .insert(payload)
        .select()
        .single();

      if (error && isRowLevelSecurityError(error)) {
        const rpcResult = await supabase.rpc('create_mission_for_employee', {
          p_employee_id: payload.employee_id,
          p_title: payload.title,
          p_start_date: payload.start_date,
          p_end_date: payload.end_date,
          p_duration_days: payload.duration_days,
          p_destination: payload.destination,
          p_reason: payload.reason || null
        });
        data = rpcResult.data;
        error = rpcResult.error;
      }

      if (error && isMissingRpcFunctionError(error, 'create_mission_for_employee')) {
        throw new Error(missingSubmissionFunctionMessage('create_mission_for_employee'));
      }

      if (error) throw error;
      return {
        id: data.id,
        name: mission.name,
        img: mission.img,
        type: data.title,
        range: mission.range,
        duration: mission.duration,
        notes: data.reason || '',
        status: data.status,
        employeeNumber: mission.employeeNumber
      };
    }

    const cached = getCache('missions', INITIAL_MISSIONS);
    const newMission = { ...mission, id: Math.random().toString(36).substr(2, 9), status: 'pending' };
    cached.push(newMission);
    setCache('missions', cached);
    return newMission;
  },

  async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('missions')
        .update({ status: status === 'approved' ? 'Approved' : 'Rejected' })
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const cached = getCache('missions', INITIAL_MISSIONS);
    const index = cached.findIndex(m => m.id === id);
    if (index !== -1) {
      cached[index].status = status;
      setCache('missions', cached);
    }
  }
};

export const AttendanceService = {
  async getByDate(date: string): Promise<AttendanceEntry[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id,
          employee_id,
          date,
          clock_in,
          clock_out,
          status,
          notes,
          employees ( first_name, last_name, employee_number )
        `)
        .eq('date', date);
      if (error) throw error;
      return (data || []).map((a: any) => ({
        id: a.id,
        employeeId: a.employee_id,
        employeeName: `${a.employees?.first_name} ${a.employees?.last_name}`,
        employeeNumber: a.employees?.employee_number,
        date: a.date,
        clockIn: a.clock_in || undefined,
        clockOut: a.clock_out || undefined,
        status: a.status as any,
        notes: a.notes || undefined
      }));
    }
    return getCache('attendance', INITIAL_ATTENDANCE);
  },

  async upsert(entry: Omit<AttendanceEntry, 'id'>): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('attendance')
        .upsert({
          employee_id: entry.employeeId,
          date: entry.date,
          clock_in: entry.clockIn || null,
          clock_out: entry.clockOut || null,
          status: entry.status,
          notes: entry.notes || null
        });
      if (error) throw error;
      return;
    }

    const cached = getCache('attendance', INITIAL_ATTENDANCE);
    const idx = cached.findIndex(a => a.employeeId === entry.employeeId && a.date === entry.date);
    if (idx !== -1) {
      cached[idx] = { ...cached[idx], ...entry };
    } else {
      cached.push({ ...entry, id: Math.random().toString(36).substr(2, 9) });
    }
    setCache('attendance', cached);
  }
};

export const PayrollService = {
  async getAll(month: string): Promise<PayrollEntry[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('payroll')
        .select(`
          id,
          month,
          basic_salary,
          allowances,
          deductions,
          bonuses,
          net_salary,
          payment_status,
          employees ( first_name, last_name, employee_number, departments(name), job_titles(title) )
        `)
        .eq('month', month);
      if (error) throw error;
      return (data || []).map((p: any) => ({
        id: p.id,
        employeeName: `${p.employees?.first_name} ${p.employees?.last_name}`,
        employeeNumber: p.employees?.employee_number,
        jobTitle: p.employees?.job_titles?.title || 'Staff',
        department: p.employees?.departments?.name || 'Department',
        basicSalary: parseFloat(p.basic_salary),
        allowances: parseFloat(p.allowances),
        deductions: parseFloat(p.deductions),
        netSalary: parseFloat(p.net_salary),
        month: p.month,
        status: p.payment_status === 'Paid' ? 'Paid' : 'Pending'
      }));
    }
    return getCache('payroll', INITIAL_PAYROLL);
  }
};

export const DepartmentService = {
  async getAll(): Promise<Department[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          id,
          name,
          dept_code,
          employees:employees!department_id ( id )
        `);
      if (error) throw error;
      return (data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        deptId: d.dept_code,
        totalNumber: d.employees ? d.employees.length : 0
      }));
    }
    return getCache('departments', INITIAL_DEPARTMENTS);
  },
  async create(dept: Omit<Department, 'id' | 'totalNumber'>): Promise<Department> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('departments')
        .insert({
          name: dept.name,
          dept_code: dept.deptId
        })
        .select()
        .single();
      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        deptId: data.dept_code,
        totalNumber: 0
      };
    }
    const cached = getCache('departments', INITIAL_DEPARTMENTS);
    const newDept = { ...dept, id: Math.random().toString(36).substr(2, 9), totalNumber: 0 };
    cached.push(newDept);
    setCache('departments', cached);
    return newDept;
  },
  async update(id: string, updates: Omit<Department, 'id' | 'totalNumber'>): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('departments')
        .update({
          name: updates.name,
          dept_code: updates.deptId
        })
        .eq('id', id);
      if (error) throw error;
      return;
    }
    const cached = getCache('departments', INITIAL_DEPARTMENTS);
    const idx = cached.findIndex(d => d.id === id);
    if (idx !== -1) {
      cached[idx] = { ...cached[idx], ...updates };
      setCache('departments', cached);
    }
  },
  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }
    const cached = getCache('departments', INITIAL_DEPARTMENTS);
    const filtered = cached.filter(d => d.id !== id);
    setCache('departments', filtered);
  }
};


export const JobTitleService = {
  async getAll(): Promise<JobTitle[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('job_titles')
        .select(`
          id,
          title,
          employees:employees!job_title_id ( id )
        `);
      if (error) throw error;
      return (data || []).map((j: any) => ({
        id: j.id,
        title: j.title,
        count: j.employees ? j.employees.length : 0
      }));
    }
    return getCache('job_titles', INITIAL_JOB_TITLES);
  },
  async create(titleStr: string): Promise<JobTitle> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('job_titles')
        .insert({ title: titleStr })
        .select()
        .single();
      if (error) throw error;
      return {
        id: data.id,
        title: data.title,
        count: 0
      };
    }
    const cached = getCache('job_titles', INITIAL_JOB_TITLES);
    const newJt = { id: Math.random().toString(36).substr(2, 9), title: titleStr, count: 0 };
    cached.push(newJt);
    setCache('job_titles', cached);
    return newJt;
  },
  async update(id: string, titleStr: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('job_titles')
        .update({ title: titleStr })
        .eq('id', id);
      if (error) throw error;
      return;
    }
    const cached = getCache('job_titles', INITIAL_JOB_TITLES);
    const idx = cached.findIndex(j => j.id === id);
    if (idx !== -1) {
      cached[idx].title = titleStr;
      setCache('job_titles', cached);
    }
  },
  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('job_titles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }
    const cached = getCache('job_titles', INITIAL_JOB_TITLES);
    const filtered = cached.filter(j => j.id !== id);
    setCache('job_titles', filtered);
  }
};


export const ActivityLogService = {
  async getAll(): Promise<ActivityEntry[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('activity_log')
        .select(`
          id,
          action,
          date,
          affected_employee_number,
          details,
          employees:admin_id ( first_name, last_name )
        `)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data || []).map((log: any) => {
        const adminName = log.employees ? `${log.employees.first_name} ${log.employees.last_name}` : 'System';
        return {
          id: log.id,
          admin: adminName,
          action: log.action,
          date: new Date(log.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          affectedCount: log.details?.affectedCount || 1,
          affectedEmployeeNumber: log.affected_employee_number || 'N/A'
        };
      });
    }
    return getCache('activity_log', INITIAL_ACTIVITY_LOG);
  }
};
