import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => {
  const query: any = { insert: vi.fn(), update: vi.fn(), select: vi.fn(), eq: vi.fn(), single: vi.fn() };
  for (const key of ['insert', 'update', 'select', 'eq']) query[key].mockReturnValue(query);
  return { query, config: { isSupabaseConfigured: true, supabase: { from: vi.fn(() => query), rpc: vi.fn() } }, cache: new Map<string, any[]>() };
});
vi.mock('../supabaseClient', () => mocks.config);
vi.mock('../services/cloudflareStorage', () => ({
  initializeCloudflareData: vi.fn().mockResolvedValue(undefined), resetToCloudflareSampleData: vi.fn(), isCloudflareConfigured: false,
  getCollection: (key: string, fallback: any[]) => mocks.cache.get(key) || structuredClone(fallback),
  setCollection: (key: string, data: any[]) => { mocks.cache.set(key, data); },
}));
import { LeaveService, MissionService } from '../services/dbServices';
const request = { employeeId: 'employee', name: 'Sample', type: 'Vacation', range: '2026-10-26 - 2026-10-27', duration: '2 days', notes: 'Test' };
describe('replay persistence acknowledges actual writes', () => {
  beforeEach(() => {
    vi.clearAllMocks(); mocks.query.single.mockReset(); mocks.config.isSupabaseConfigured = true; mocks.cache.clear();
  });
  it.each([LeaveService, MissionService])('uses the same ID for retries and verifies an existing matching record', async service => {
    mocks.query.single.mockResolvedValueOnce({ data: null, error: { code: '23505' } });
    mocks.query.single.mockImplementationOnce(async () => ({ data: mocks.query.insert.mock.calls[0][0], error: null }));
    expect((await service.create(request, 'stable')).id).toBe('stable');
    expect(mocks.query.insert.mock.calls[0][0].id).toBe('stable');
    expect(mocks.config.supabase.rpc).not.toHaveBeenCalled();
  });
  it('does not treat a different existing request as a successful retry', async () => {
    mocks.query.single.mockResolvedValueOnce({ error: { code: '23505' } });
    mocks.query.single.mockResolvedValueOnce({ data: { id: 'stable', employee_id: 'other' }, error: null });
    await expect(LeaveService.create(request, 'stable')).rejects.toThrow('different request');
  });
  it('keeps a denied replay from using a non-idempotent RPC fallback', async () => {
    mocks.query.single.mockResolvedValue({ error: { message: 'row-level security denied' } });
    await expect(LeaveService.create(request, 'stable')).rejects.toMatchObject({ message: 'row-level security denied' });
    expect(mocks.config.supabase.rpc).not.toHaveBeenCalled();
  });
  it('does not acknowledge a status update with no matching row', async () => {
    mocks.query.single.mockResolvedValue({ error: { message: '0 rows' } });
    await expect(LeaveService.updateStatus('missing', 'approved')).rejects.toMatchObject({ message: '0 rows' });
    expect(mocks.query.select).toHaveBeenCalledWith('id');
  });
  it.each([LeaveService, MissionService])('does not duplicate a locally replayed create', async service => {
    mocks.config.isSupabaseConfigured = false;
    await service.create(request, 'stable'); await service.create(request, 'stable');
    expect((await service.getAll()).filter(v => v.id === 'stable')).toHaveLength(1);
    await expect(service.updateStatus('missing', 'approved')).rejects.toThrow('not found');
  });
});
