/**
 * Cloudflare Edge Storage Service for HR Tool
 *
 * Connects the application to Cloudflare R2 for data storage and sample data previewing.
 *
 * Architecture:
 * 1. Checks VITE_ASSET_BASE_URL (from .env.local).
 * 2. Fetches canonical sample dataset from Cloudflare CDN edge:
 *    `${VITE_ASSET_BASE_URL}/hr-tool/data/sample-data.json`
 * 3. Transparently falls back to `/sample-data.json` or bundled data if offline.
 * 4. Stores mutable changes (create, update, delete) in localStorage with version tracking.
 * 5. Provides a "Reset to Cloudflare Sample Data" trigger for testing and previewing.
 */

export interface SampleDataset {
  version: string;
  updatedAt: string;
  departments: any[];
  jobTitles: any[];
  employees: any[];
  leaves: any[];
  missions: any[];
  attendance: any[];
  payroll: any[];
  activityLog: any[];
}

const STORAGE_PREFIX = 'hr_tool_';
const INITIALIZED_FLAG_KEY = 'hr_tool_cf_initialized';
const DEFAULT_CDN_BASE = 'https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev';

const getAssetBaseUrl = (): string => {
  const url = import.meta.env.VITE_ASSET_BASE_URL || DEFAULT_CDN_BASE;
  return url.replace(/\/+$/, '');
};

export const isCloudflareConfigured = Boolean(getAssetBaseUrl());

/**
 * Fetches canonical sample data from Cloudflare edge or local public fallback
 */
export async function fetchRemoteSampleData(): Promise<SampleDataset | null> {
  const baseUrl = getAssetBaseUrl();
  const remoteUrl = baseUrl
    ? `${baseUrl}/hr-tool/data/sample-data.json`
    : '/sample-data.json';

  try {
    const response = await fetch(remoteUrl, { cache: 'no-cache' });
    if (!response.ok) {
      if (baseUrl && remoteUrl !== '/sample-data.json') {
        // Fallback to local public file
        const fallbackRes = await fetch('/sample-data.json', { cache: 'no-cache' });
        if (fallbackRes.ok) return await fallbackRes.json();
      }
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn('Could not fetch from remote Cloudflare storage, falling back to local storage:', error);
    try {
      const fallbackRes = await fetch('/sample-data.json', { cache: 'no-cache' });
      if (fallbackRes.ok) return await fallbackRes.json();
    } catch {
      // Offline or file not available
    }
    return null;
  }
}

/**
 * Ensures initial data is populated from Cloudflare R2 on first load
 */
export async function initializeCloudflareData(forceRefresh = false): Promise<void> {
  if (typeof window === 'undefined') return;

  const isAlreadyInitialized = localStorage.getItem(INITIALIZED_FLAG_KEY) === 'true';
  if (isAlreadyInitialized && !forceRefresh) {
    return;
  }

  const remoteData = await fetchRemoteSampleData();
  if (remoteData) {
    // Initial sample loading must never overwrite a saved or replayed local change.
    const seed = (name: string, data: unknown[]) => {
      if (data && (forceRefresh || localStorage.getItem(`${STORAGE_PREFIX}${name}`) === null)) setCollection(name, data);
    };
    seed('employees', remoteData.employees);
    seed('departments', remoteData.departments);
    seed('job_titles', remoteData.jobTitles);
    seed('leaves', remoteData.leaves);
    seed('missions', remoteData.missions);
    seed('attendance', remoteData.attendance);
    seed('payroll', remoteData.payroll);
    seed('activity_log', remoteData.activityLog);

    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
    console.info('✓ Initialized data store from Cloudflare R2 edge sample dataset.');
  }
}

/**
 * Reads a collection from local cache, with fallback to initial data
 */
export function getCollection<T>(collectionName: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return structuredClone(fallback);
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${collectionName}`);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return structuredClone(fallback);
    }
  }
  // A read must not persist placeholder data or mutate shared seed objects.
  return structuredClone(fallback);
}

/**
 * Writes an updated collection to local cache
 */
export function setCollection<T>(collectionName: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_PREFIX}${collectionName}`, JSON.stringify(data));
}

/**
 * Resets all collections back to the pristine Cloudflare R2 sample dataset
 */
export async function resetToCloudflareSampleData(): Promise<boolean> {
  try {
    await initializeCloudflareData(true);
    return true;
  } catch (err) {
    console.error('Failed to reset sample data from Cloudflare:', err);
    return false;
  }
}
