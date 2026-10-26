import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { getCollection, setCollection, initializeCloudflareData } from '../services/cloudflareStorage';
describe('background sample data initialization', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());
  it('does not persist placeholders on read or mutate the shared fallback', () => {
    const seed = [{ id: 'seed', status: 'pending' }];
    getCollection('leaves', seed)[0].status = 'approved';
    expect(seed[0].status).toBe('pending');
    expect(localStorage.getItem('hr_tool_leaves')).toBeNull();
  });
  it('preserves a local write while a sample request is in flight', async () => {
    let finish!: (value: unknown) => void;
    vi.stubGlobal('fetch', vi.fn(() => new Promise(resolve => { finish = resolve; })));
    const load = initializeCloudflareData();
    setCollection('leaves', [{ id: 'local', status: 'approved' }]);
    finish({ ok: true, json: async () => ({ leaves: [{ id: 'remote', status: 'pending' }], missions: [{ id: 'sample' }] }) });
    await load;
    expect(getCollection('leaves', [])).toEqual([{ id: 'local', status: 'approved' }]);
    expect(getCollection('missions', [])).toEqual([{ id: 'sample' }]);
  });
  it('only replaces existing data when reset is explicitly requested', async () => {
    setCollection('leaves', [{ id: 'local' }]);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ leaves: [{ id: 'sample' }] }) }));
    await initializeCloudflareData();
    expect(getCollection('leaves', [])).toEqual([{ id: 'local' }]);
    await initializeCloudflareData(true);
    expect(getCollection('leaves', [])).toEqual([{ id: 'sample' }]);
  });
});
