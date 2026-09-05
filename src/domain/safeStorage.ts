import { type ZodSchema } from 'zod';

/**
 * Zero-Trust Storage Utility.
 * Validates, migrates, and safely recovers from corrupt payloads or schema drift.
 */
export const SafeStorage = {
  /**
   * Retrieve and validate an item from localStorage against a Zod schema.
   * If parsing fails or storage is unavailable, returns defaultValue without throwing.
   */
  getItem<T>(key: string, schema: ZodSchema<T>, defaultValue: T): T {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return defaultValue;
      }
      const raw = window.localStorage.getItem(key);
      if (raw === null) {
        return defaultValue;
      }
      const parsedJson = JSON.parse(raw);
      const validation = schema.safeParse(parsedJson);
      if (validation.success) {
        return validation.data;
      } else {
        console.warn(`[SafeStorage] Schema mismatch for key "${key}". Falling back to default:`, validation.error.issues);
        return defaultValue;
      }
    } catch (err) {
      console.error(`[SafeStorage] Failed to read key "${key}":`, err);
      return defaultValue;
    }
  },

  /**
   * Safely persist an item to localStorage after validating it against the schema.
   */
  setItem<T>(key: string, value: T, schema?: ZodSchema<T>): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      if (schema) {
        const validation = schema.safeParse(value);
        if (!validation.success) {
          console.error(`[SafeStorage] Validation failed before writing key "${key}":`, validation.error.issues);
          return false;
        }
      }
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[SafeStorage] Failed to write key "${key}":`, err);
      return false;
    }
  },

  /**
   * Safely remove a key from localStorage.
   */
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (err) {
      console.error(`[SafeStorage] Failed to remove key "${key}":`, err);
    }
  },
};
