import { parseISO, differenceInDays, addMonths, isValid, isBefore } from 'date-fns';

/**
 * Calculates annual vacation entitlement based on graduation year.
 * Less than 10 years: 21 days
 * 10 years or more: 30 days
 */
export function calculateAnnualEntitlement(graduationYear: number, currentYear: number = new Date().getFullYear()): number {
  if (!graduationYear) return 21;
  const yearsSinceGraduation = currentYear - graduationYear;
  return yearsSinceGraduation >= 10 ? 30 : 21;
}

/**
 * Checks if the given date is an Egyptian weekend (Friday or Saturday).
 */
export function isEgyptianWeekend(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return false;
  const day = d.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
  return day === 5 || day === 6;
}

/**
 * Calculates the number of working days between two dates, excluding Egyptian weekends (Friday and Saturday).
 */
export function calculateWorkingDays(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);
  if (!isValid(start) || !isValid(end) || end < start) return 0;

  let workingDays = 0;
  const current = new Date(start);
  while (current <= end) {
    if (!isEgyptianWeekend(current)) {
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  return workingDays;
}

/**
 * Checks if the employee is in their first 3 months of employment.
 * Newly hired employees cannot request vacation during this period.
 */
export function isNewlyHiredRestricted(hireDateStr: string, requestDateStr: string): boolean {
  if (!hireDateStr || !requestDateStr) return false;
  const hireDate = parseISO(hireDateStr);
  const requestDate = parseISO(requestDateStr);
  if (!isValid(hireDate) || !isValid(requestDate)) return false;

  const restrictionEndDate = addMonths(hireDate, 3);
  return isBefore(requestDate, restrictionEndDate);
}

/**
 * Checks if request is restricted due to previous month deadline.
 * Employees cannot request vacation for days in the previous month after the 5th of the current month.
 */
export function isPreviousMonthRequestRestricted(requestDateStr: string, currentDateStr: string = new Date().toISOString()): boolean {
  if (!requestDateStr) return false;
  const requestDate = parseISO(requestDateStr);
  const currentDate = parseISO(currentDateStr);
  if (!isValid(requestDate) || !isValid(currentDate)) return false;

  const reqYear = requestDate.getFullYear();
  const reqMonth = requestDate.getMonth();
  const curYear = currentDate.getFullYear();
  const curMonth = currentDate.getMonth();

  // If request is in any past month
  const isPastMonth = (reqYear < curYear) || (reqYear === curYear && reqMonth < curMonth);
  if (isPastMonth) {
    // If we are past the 5th of the current month, restrict
    if (currentDate.getDate() > 5) {
      return true;
    }
  }
  return false;
}

/**
 * Calculates vacation balance for newly hired employees:
 * (Vacation Balance / 365) * remaining days in the hire year (rounded up).
 */
export function calculateNewHireBalance(hireDateStr: string, annualEntitlement: number): number {
  if (!hireDateStr) return annualEntitlement;
  const hireDate = parseISO(hireDateStr);
  if (!isValid(hireDate)) return annualEntitlement;

  const endOfYear = new Date(hireDate.getFullYear(), 11, 31);
  const remainingDays = differenceInDays(endOfYear, hireDate) + 1; // inclusive of start day
  return Math.ceil((annualEntitlement / 365) * remainingDays);
}

/**
 * Calculates termination payout/deduction balance details.
 */
export function calculateTerminationDetails(
  annualEntitlement: number,
  hireDateStr: string,
  terminationDateStr: string,
  usedBalance: number,
  bridges: number
) {
  const hireDate = parseISO(hireDateStr);
  const termDate = parseISO(terminationDateStr);
  if (!isValid(hireDate) || !isValid(termDate)) {
    return { allowed: 0, finalBalance: 0 };
  }

  // 1. Reset the bridges (normally done by adding them to the yearly balance, but functionally we track it in final formula)
  // 2. Allowed balance = (Vacation Balance (21 or 30) / 365) * days worked (rounded up)
  const daysWorked = differenceInDays(termDate, hireDate) + 1;
  const allowed = Math.ceil((annualEntitlement / 365) * daysWorked);

  // 3. Deduct used balance, and since bridges are reset, they are added back (effectively, we don't deduct bridges)
  // So final credited balance = allowed - used + bridges (since bridges were deducted at the start of year, we add them back)
  const finalBalance = allowed - usedBalance + bridges;

  return {
    allowed,
    finalBalance
  };
}
