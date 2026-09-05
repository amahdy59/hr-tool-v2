import { z } from 'zod';

/**
 * Branded ID types to eliminate primitive obsession across domain boundaries.
 */
export type EmployeeId = string & { readonly __brand: unique symbol };
export type LeaveRequestId = string & { readonly __brand: unique symbol };
export type MissionRequestId = string & { readonly __brand: unique symbol };

export const LocalizedNameSchema = z.union([
  z.string().min(1, 'Name is required'),
  z.object({
    nameEn: z.string().min(1, 'English name is required'),
    nameAr: z.string().min(1, 'Arabic name is required'),
  }),
]);

export const EmployeeSchema = z.object({
  id: z.string().min(1),
  name: LocalizedNameSchema,
  employeeNumber: z.string().default(''),
  department: z.string().default('General'),
  jobTitle: z.string().default('Staff'),
  email: z.string().email().or(z.literal('')),
  phone: z.string().default(''),
  gender: z.string().default(''),
  contractType: z.string().default('Full-Time'),
  hireDate: z.string().default(''),
  activityType: z.string().default('Active'),
  isManager: z.boolean().default(false),
  img: z.string().default(''),
});

export type ValidatedEmployee = z.infer<typeof EmployeeSchema>;

export const LeaveRequestSchema = z.object({
  id: z.string().min(1),
  name: LocalizedNameSchema,
  img: z.string().optional(),
  type: z.string().min(1),
  range: z.string().default(''),
  duration: z.string().default(''),
  notes: z.string().default(''),
  status: z.enum(['pending', 'approved', 'rejected']).or(z.string()).default('pending'),
  employeeNumber: z.string().optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  contractType: z.string().optional(),
  activityType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ValidatedLeaveRequest = z.infer<typeof LeaveRequestSchema>;

export const MissionRequestSchema = z.object({
  id: z.string().min(1),
  name: LocalizedNameSchema,
  img: z.string().optional(),
  type: z.string().min(1),
  range: z.string().default(''),
  duration: z.string().default(''),
  notes: z.string().default(''),
  status: z.enum(['pending', 'approved', 'rejected']).or(z.string()).default('pending'),
  employeeNumber: z.string().optional(),
  reason: z.string().optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  contractType: z.string().optional(),
  activityType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ValidatedMissionRequest = z.infer<typeof MissionRequestSchema>;

export const AttendanceEntrySchema = z.object({
  id: z.string().min(1),
  employeeId: z.string().min(1),
  date: z.string().min(1),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  status: z.string().default('Present'),
});

export type ValidatedAttendanceEntry = z.infer<typeof AttendanceEntrySchema>;
