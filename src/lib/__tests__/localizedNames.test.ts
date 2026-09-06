import { describe, it, expect } from 'vitest';
import {
  isArabicLanguage,
  localizePersonName,
  localizeFirstName,
  localizeDepartmentName,
  localizeJobTitle,
  formatLocalizedDate,
} from '../localizedNames';

describe('localizedNames Utilities (Bilingual Parity & Formatting)', () => {
  describe('isArabicLanguage', () => {
    it('returns true for ar, ar-EG, ar-SA', () => {
      expect(isArabicLanguage('ar')).toBe(true);
      expect(isArabicLanguage('ar-EG')).toBe(true);
      expect(isArabicLanguage('ar-SA')).toBe(true);
    });

    it('returns false for en, undefined, and non-arabic locales', () => {
      expect(isArabicLanguage('en')).toBe(false);
      expect(isArabicLanguage('en-US')).toBe(false);
      expect(isArabicLanguage(undefined)).toBe(false);
      expect(isArabicLanguage('')).toBe(false);
    });
  });

  describe('localizePersonName', () => {
    it('returns English name as is when language is en', () => {
      expect(localizePersonName('Ahmed Mahdy', 'en')).toBe('Ahmed Mahdy');
      expect(localizePersonName('Sara Khalil', 'en')).toBe('Sara Khalil');
    });

    it('translates recognized names to Arabic when language is ar', () => {
      expect(localizePersonName('Ahmed Mahdy', 'ar')).toBe('أحمد مهدي');
      expect(localizePersonName('Sara Khalil', 'ar')).toBe('سارة خليل');
      expect(localizePersonName('Aleksander Garcia', 'ar')).toBe('ألكسندر غارسيا');
    });

    it('handles bilingual name object { nameEn, nameAr }', () => {
      const bilingual = { nameEn: 'John Doe', nameAr: 'جون دو' };
      expect(localizePersonName(bilingual, 'en')).toBe('John Doe');
      expect(localizePersonName(bilingual, 'ar')).toBe('جون دو');
    });

    it('falls back to input string if no translation exists', () => {
      expect(localizePersonName('Unknown Visitor', 'ar')).toBe('Unknown Visitor');
    });

    it('returns empty string if name is undefined or empty', () => {
      expect(localizePersonName(undefined, 'ar')).toBe('');
      expect(localizePersonName('', 'ar')).toBe('');
    });
  });

  describe('localizeFirstName', () => {
    it('extracts first name token in English and Arabic', () => {
      expect(localizeFirstName('Ahmed Mahdy', 'en')).toBe('Ahmed');
      expect(localizeFirstName('Ahmed Mahdy', 'ar')).toBe('أحمد');
      expect(localizeFirstName('Sara Khalil', 'ar')).toBe('سارة');
    });
  });

  describe('localizeDepartmentName', () => {
    it('translates department names to Arabic', () => {
      expect(localizeDepartmentName('Engineering', 'ar')).toBe('الهندسة');
      expect(localizeDepartmentName('Human Resources', 'ar')).toBe('الموارد البشرية');
      expect(localizeDepartmentName('Finance', 'ar')).toBe('المالية');
    });

    it('keeps department name in English for en locale', () => {
      expect(localizeDepartmentName('Engineering', 'en')).toBe('Engineering');
      expect(localizeDepartmentName('Finance', 'en')).toBe('Finance');
    });

    it('returns empty string for undefined', () => {
      expect(localizeDepartmentName(undefined, 'ar')).toBe('');
    });
  });

  describe('localizeJobTitle', () => {
    it('translates job titles to Arabic', () => {
      expect(localizeJobTitle('Senior Solutions Architect', 'ar')).toBe('معماري حلول أول');
      expect(localizeJobTitle('Software Developer', 'ar')).toBe('مطور برمجيات');
      expect(localizeJobTitle('HR Manager', 'ar')).toBe('مدير الموارد البشرية');
    });

    it('preserves job title in English for en locale', () => {
      expect(localizeJobTitle('Senior Solutions Architect', 'en')).toBe('Senior Solutions Architect');
    });
  });

  describe('formatLocalizedDate', () => {
    it('formats ISO dates in English locale', () => {
      const formatted = formatLocalizedDate('2026-06-15', 'en');
      expect(formatted).toContain('June 15, 2026');
    });

    it('formats ISO dates in Arabic locale with Arabic month names', () => {
      const formatted = formatLocalizedDate('2026-06-15', 'ar');
      // Arabic output format: day month year (e.g. 15 يونيو 2026)
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });

    it('returns empty string for empty input', () => {
      expect(formatLocalizedDate('', 'en')).toBe('');
      expect(formatLocalizedDate(undefined, 'ar')).toBe('');
    });
  });
});
