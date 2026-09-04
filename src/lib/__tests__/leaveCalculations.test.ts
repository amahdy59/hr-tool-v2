import { describe, it, expect } from 'vitest';
import {
  calculateAnnualEntitlement,
  isEgyptianWeekend,
  calculateWorkingDays,
  isNewlyHiredRestricted,
  isPreviousMonthRequestRestricted,
  calculateNewHireBalance,
} from '../leaveCalculations';

describe('calculateAnnualEntitlement', () => {
  it('returns 21 days for employees with less than 10 years since graduation', () => {
    const currentYear = 2024;
    expect(calculateAnnualEntitlement(2018, currentYear)).toBe(21);
    expect(calculateAnnualEntitlement(2015, currentYear)).toBe(21);
  });

  it('returns 30 days for employees with 10 or more years since graduation', () => {
    const currentYear = 2024;
    expect(calculateAnnualEntitlement(2014, currentYear)).toBe(30);
    expect(calculateAnnualEntitlement(2010, currentYear)).toBe(30);
  });

  it('defaults to 21 days when graduation year is missing or zero', () => {
    expect(calculateAnnualEntitlement(0)).toBe(21);
  });
});

describe('isEgyptianWeekend', () => {
  it('identifies Friday and Saturday as weekends', () => {
    // 2024-03-08 is Friday, 2024-03-09 is Saturday
    expect(isEgyptianWeekend('2024-03-08')).toBe(true);
    expect(isEgyptianWeekend('2024-03-09')).toBe(true);
  });

  it('identifies Sunday through Thursday as working days', () => {
    // 2024-03-10 is Sunday, 2024-03-11 is Monday, 2024-03-14 is Thursday
    expect(isEgyptianWeekend('2024-03-10')).toBe(false);
    expect(isEgyptianWeekend('2024-03-11')).toBe(false);
    expect(isEgyptianWeekend('2024-03-14')).toBe(false);
  });

  it('returns false for invalid date strings', () => {
    expect(isEgyptianWeekend('invalid-date')).toBe(false);
  });
});

describe('calculateWorkingDays', () => {
  it('calculates working days in a normal work week (Sunday to Thursday)', () => {
    // 2024-03-10 (Sun) to 2024-03-14 (Thu) = 5 days
    expect(calculateWorkingDays('2024-03-10', '2024-03-14')).toBe(5);
  });

  it('excludes Friday and Saturday from total count', () => {
    // 2024-03-07 (Thu) to 2024-03-10 (Sun) = Thu (1) + Fri (0) + Sat (0) + Sun (1) = 2
    expect(calculateWorkingDays('2024-03-07', '2024-03-10')).toBe(2);
  });

  it('returns 0 if dates are invalid or end is before start', () => {
    expect(calculateWorkingDays('', '2024-03-10')).toBe(0);
    expect(calculateWorkingDays('2024-03-15', '2024-03-10')).toBe(0);
  });
});

describe('isNewlyHiredRestricted', () => {
  it('restricts leave request within first 3 months of employment', () => {
    const hireDate = '2024-01-01';
    const requestDate = '2024-02-15'; // 1.5 months in
    expect(isNewlyHiredRestricted(hireDate, requestDate)).toBe(true);
  });

  it('allows leave request after 3 months of employment', () => {
    const hireDate = '2024-01-01';
    const requestDate = '2024-04-15'; // > 3 months in
    expect(isNewlyHiredRestricted(hireDate, requestDate)).toBe(false);
  });
});

describe('isPreviousMonthRequestRestricted', () => {
  it('restricts past month leave request if submitted after the 5th', () => {
    const vacationDate = '2024-01-20';
    const submissionDate = '2024-02-10'; // after the 5th
    expect(isPreviousMonthRequestRestricted(vacationDate, submissionDate)).toBe(true);
  });

  it('allows past month leave request if submitted on or before the 5th', () => {
    const vacationDate = '2024-01-20';
    const submissionDate = '2024-02-04'; // before the 5th
    expect(isPreviousMonthRequestRestricted(vacationDate, submissionDate)).toBe(false);
  });
});

describe('calculateNewHireBalance', () => {
  it('prorates vacation days for employees hired midway through the year', () => {
    // Hired on July 1 (half year remaining)
    const hireDate = '2024-07-01';
    const annualEntitlement = 21;
    const balance = calculateNewHireBalance(hireDate, annualEntitlement);
    expect(balance).toBeGreaterThan(10);
    expect(balance).toBeLessThanOrEqual(21);
  });

  it('returns full balance when hired on Jan 1', () => {
    const hireDate = '2023-01-01';
    expect(calculateNewHireBalance(hireDate, 21)).toBe(21);
  });
});
