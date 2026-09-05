import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import { EmployeeSchema, LeaveRequestSchema, MissionRequestSchema, AttendanceEntrySchema } from '../schemas';
import { SafeStorage } from '../safeStorage';

describe('Domain Schemas Runtime Validation', () => {
  it('validates a valid employee with string name', () => {
    const raw = {
      id: 'emp-101',
      name: 'Ahmed Mahdy',
      email: 'amahdy59@gmail.com',
      department: 'Engineering',
      jobTitle: 'Principal Architect',
    };
    const result = EmployeeSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isManager).toBe(false);
      expect(result.data.contractType).toBe('Full-Time');
    }
  });

  it('validates a bilingual employee name', () => {
    const raw = {
      id: 'emp-102',
      name: { nameEn: 'Ahmed Mahdy', nameAr: 'أحمد مهدي' },
      email: 'amahdy@company.com',
    };
    const result = EmployeeSchema.safeParse(raw);
    expect(result.success).toBe(true);
  });

  it('rejects an employee with invalid email format', () => {
    const raw = {
      id: 'emp-103',
      name: 'Test User',
      email: 'not-an-email',
    };
    const result = EmployeeSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });

  it('validates a leave request and applies default status', () => {
    const raw = {
      id: 'leave-1',
      name: 'John Doe',
      type: 'Annual',
    };
    const result = LeaveRequestSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe('pending');
    }
  });

  it('validates mission and attendance entries', () => {
    const mission = MissionRequestSchema.safeParse({ id: 'm-1', name: 'Sara', type: 'Client Visit' });
    expect(mission.success).toBe(true);

    const attendance = AttendanceEntrySchema.safeParse({
      id: 'att-1',
      employeeId: 'emp-1',
      date: '2026-09-05',
    });
    expect(attendance.success).toBe(true);
    if (attendance.success) {
      expect(attendance.data.status).toBe('Present');
    }
  });
});

describe('SafeStorage Zero-Trust Wrapper', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns default value when key does not exist', () => {
    const schema = z.object({ value: z.number() });
    const result = SafeStorage.getItem('missing-key', schema, { value: 42 });
    expect(result).toEqual({ value: 42 });
  });

  it('safely parses valid persisted data', () => {
    const schema = z.object({ theme: z.enum(['light', 'dark']) });
    SafeStorage.setItem('app-theme', { theme: 'dark' }, schema);
    const result = SafeStorage.getItem('app-theme', schema, { theme: 'light' });
    expect(result).toEqual({ theme: 'dark' });
  });

  it('recovers from corrupt JSON or schema mismatch without throwing', () => {
    window.localStorage.setItem('corrupted-key', 'INVALID_JSON{{{');
    const schema = z.object({ count: z.number() });
    const result = SafeStorage.getItem('corrupted-key', schema, { count: 0 });
    expect(result).toEqual({ count: 0 });
  });
});
