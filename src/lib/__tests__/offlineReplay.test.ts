import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LeaveService, MissionService } from '../services/dbServices';
import { replayOfflineAction } from '../services/offlineReplay';
import type { QueuedOfflineRequest } from '../offlineQueue';
vi.mock('../services/dbServices', () => ({ LeaveService: { create: vi.fn(), updateStatus: vi.fn() }, MissionService: { create: vi.fn() } }));
const base: QueuedOfflineRequest = { id: 'queued', timestamp: 1, retryCount: 0, type: 'APPROVE_LEAVE', payload: { leaveId: 'leave-1' }, submissionId: 'stable-id' };
const payload = { employeeId: 'employee-1', name: 'Sample', type: 'Vacation', range: '2026-10-26 - 2026-10-27', duration: '2 days', notes: '' };
describe('verified offline replay', () => {
  beforeEach(() => vi.resetAllMocks());
  it.each([['APPROVE_LEAVE', 'approved'], ['REJECT_LEAVE', 'rejected']] as const)('persists %s through the real data service', async (type, status) => {
    expect(await replayOfflineAction({ ...base, type })).toBe(true);
    expect(LeaveService.updateStatus).toHaveBeenCalledWith('leave-1', status);
  });
  it.each(['CREATE_LEAVE', 'CREATE_MISSION'] as const)('creates %s using a stable submission ID', async type => {
    const service = type === 'CREATE_LEAVE' ? LeaveService : MissionService;
    vi.mocked(service.create).mockResolvedValue({ ...payload, id: base.submissionId! });
    expect(await replayOfflineAction({ ...base, type, payload })).toBe(true);
    expect(service.create).toHaveBeenCalledWith(payload, base.submissionId);
  });
  it('does not acknowledge an unconfirmed create', async () => {
    vi.mocked(LeaveService.create).mockResolvedValue({ ...payload, id: 'wrong-id' });
    expect(await replayOfflineAction({ ...base, type: 'CREATE_LEAVE', payload })).toBe(false);
  });
  it('propagates server rejection and validates queued data before sending', async () => {
    vi.mocked(LeaveService.updateStatus).mockRejectedValue(new Error('permission denied'));
    await expect(replayOfflineAction(base)).rejects.toThrow('permission denied');
    vi.mocked(LeaveService.updateStatus).mockClear();
    await expect(replayOfflineAction({ ...base, payload: {} })).rejects.toThrow();
    expect(LeaveService.updateStatus).not.toHaveBeenCalled();
  });
});
