import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@/i18n';
import { toast } from 'sonner';
import { OfflineBanner } from '../OfflineBanner';
import * as queue from '@/lib/offlineQueue';
import { replayOfflineAction } from '@/lib/services/offlineReplay';
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/lib/services/offlineReplay', () => ({ replayOfflineAction: vi.fn() }));
vi.mock('@/lib/supabaseClient', () => ({ isSupabaseConfigured: false }));
const pending: queue.QueuedOfflineRequest[] = [{ id: '1', type: 'APPROVE_LEAVE', payload: { leaveId: 'l1' }, timestamp: 1, retryCount: 0 }];
describe('truthful offline status', () => {
  beforeEach(() => {
    vi.restoreAllMocks(); vi.clearAllMocks();
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    vi.spyOn(queue, 'getPendingOfflineQueue').mockResolvedValue([]);
    vi.spyOn(queue, 'flushOfflineQueue').mockResolvedValue({ processed: 0, failed: 0 });
  });
  it('does not show status when online with an empty queue', async () => {
    const { container } = render(<OfflineBanner />); await act(async () => {});
    expect(container.firstChild).toBeNull();
  });
  it('shows an offline warning and pending count', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    vi.mocked(queue.getPendingOfflineQueue).mockResolvedValue(pending);
    render(<OfflineBanner />); await act(async () => {});
    expect(screen.getByRole('status').textContent).toContain('1 pending.');
    expect(screen.getByRole('status').textContent).toContain('You are offline');
    expect(queue.flushOfflineQueue).not.toHaveBeenCalled();
  });
  it('replays requests found on load using the verified handler', async () => {
    vi.mocked(queue.getPendingOfflineQueue).mockResolvedValueOnce(pending);
    vi.mocked(queue.flushOfflineQueue).mockResolvedValue({ processed: 1, failed: 0 });
    render(<OfflineBanner />); await act(async () => {});
    expect(queue.flushOfflineQueue).toHaveBeenCalledWith(replayOfflineAction);
    expect(toast.success).toHaveBeenCalledWith('Pending requests saved in this browser: 1.');
  });
  it('does not announce successful sync when nothing was processed', async () => {
    render(<OfflineBanner />); await act(async () => { window.dispatchEvent(new Event('online')); });
    expect(toast.success).not.toHaveBeenCalled();
  });
  it('retains an actionable error after failure and permits retry', async () => {
    vi.mocked(queue.getPendingOfflineQueue).mockResolvedValue(pending);
    vi.mocked(queue.flushOfflineQueue).mockRejectedValueOnce(new Error('storage failure'));
    render(<OfflineBanner />); await act(async () => {});
    expect(screen.getByRole('status').textContent).toContain('They remain on this device');
    expect(screen.getByRole('button', { name: 'Retry saving' }).hasAttribute('disabled')).toBe(false);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Retry saving' })); });
    expect(queue.flushOfflineQueue).toHaveBeenCalledTimes(2);
    expect(toast.success).not.toHaveBeenCalled();
  });
});
