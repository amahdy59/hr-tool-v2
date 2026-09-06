import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { OfflineBanner } from '../OfflineBanner';
import * as offlineQueue from '@/lib/offlineQueue';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultVal?: string) => defaultVal || key,
    i18n: { resolvedLanguage: 'en', language: 'en' },
  }),
}));

describe('OfflineBanner Component (Resilience & Sync UI)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  it('renders nothing when browser is online and pending queue is empty', async () => {
    vi.spyOn(offlineQueue, 'getPendingOfflineQueue').mockResolvedValue([]);

    const { container } = render(<OfflineBanner />);
    await act(async () => {});

    expect(container.firstChild).toBeNull();
  });

  it('renders offline warning when navigator is offline', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    vi.spyOn(offlineQueue, 'getPendingOfflineQueue').mockResolvedValue([]);

    render(<OfflineBanner />);
    await act(async () => {});

    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText(/offline/i)).toBeTruthy();
  });

  it('renders pending count badge when offline and queue has items', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    vi.spyOn(offlineQueue, 'getPendingOfflineQueue').mockResolvedValue([
      { id: '1', type: 'APPROVE_LEAVE', payload: {}, timestamp: Date.now(), retryCount: 0 },
      { id: '2', type: 'CREATE_MISSION', payload: {}, timestamp: Date.now(), retryCount: 0 },
    ]);

    render(<OfflineBanner />);
    await act(async () => {});

    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText(/2 pending/i)).toBeTruthy();
  });

  it('triggers flushOfflineQueue when reconnected online with pending items', async () => {
    vi.spyOn(offlineQueue, 'getPendingOfflineQueue').mockResolvedValue([
      { id: '1', type: 'APPROVE_LEAVE', payload: {}, timestamp: Date.now(), retryCount: 0 },
    ]);
    const flushSpy = vi.spyOn(offlineQueue, 'flushOfflineQueue').mockResolvedValue({
      processed: 1,
      failed: 0,
    });

    render(<OfflineBanner />);
    await act(async () => {});

    // Trigger online reconnection
    await act(async () => {
      window.dispatchEvent(new Event('online'));
    });

    expect(flushSpy).toHaveBeenCalled();
  });
});
