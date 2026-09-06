import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  enqueueOfflineAction,
  getPendingOfflineQueue,
  removeOfflineAction,
  flushOfflineQueue,
  subscribeOfflineQueue,
} from '../offlineQueue';

describe('offlineQueue (IndexedDB Resilience & Sync)', () => {
  let mockStore: Map<string, any>;

  beforeEach(() => {
    mockStore = new Map();

    const mockIDB = {
      open: vi.fn().mockImplementation(() => {
        const req: any = {};
        setTimeout(() => {
          const fakeDB: any = {
            objectStoreNames: { contains: () => true },
            createObjectStore: vi.fn(),
            transaction: (storeName: string, mode: string) => ({
              objectStore: () => ({
                add: (item: any) => {
                  mockStore.set(item.id, item);
                  const r: any = {};
                  setTimeout(() => r.onsuccess && r.onsuccess(), 0);
                  return r;
                },
                getAll: () => {
                  const r: any = { result: Array.from(mockStore.values()) };
                  setTimeout(() => r.onsuccess && r.onsuccess(), 0);
                  return r;
                },
                delete: (id: string) => {
                  mockStore.delete(id);
                  const r: any = {};
                  setTimeout(() => r.onsuccess && r.onsuccess(), 0);
                  return r;
                },
              }),
            }),
          };
          req.result = fakeDB;
          if (req.onsuccess) req.onsuccess();
        }, 0);
        return req;
      }),
    };

    // Attach mock indexedDB to window
    (window as any).indexedDB = mockIDB;
  });

  it('enqueues an offline action into the storage and generates an ID', async () => {
    const id = await enqueueOfflineAction({
      type: 'APPROVE_LEAVE',
      payload: { leaveId: 'lv-101' },
    });

    expect(id).toMatch(/^off_\d+_[a-z0-9]+$/);
    const queue = await getPendingOfflineQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].type).toBe('APPROVE_LEAVE');
    expect(queue[0].payload.leaveId).toBe('lv-101');
  });

  it('retrieves all pending offline actions', async () => {
    await enqueueOfflineAction({ type: 'CREATE_LEAVE', payload: { days: 3 } });
    await enqueueOfflineAction({ type: 'CREATE_MISSION', payload: { days: 5 } });

    const queue = await getPendingOfflineQueue();
    expect(queue.length).toBe(2);
    expect(queue.map((q) => q.type)).toEqual(['CREATE_LEAVE', 'CREATE_MISSION']);
  });

  it('removes an offline action by ID', async () => {
    const id1 = await enqueueOfflineAction({ type: 'APPROVE_LEAVE', payload: { id: 1 } });
    const id2 = await enqueueOfflineAction({ type: 'REJECT_LEAVE', payload: { id: 2 } });

    await removeOfflineAction(id1);

    const queue = await getPendingOfflineQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].id).toBe(id2);
  });

  it('flushes queue and deletes items when sync handler succeeds', async () => {
    await enqueueOfflineAction({ type: 'APPROVE_LEAVE', payload: { id: 10 } });
    await enqueueOfflineAction({ type: 'CREATE_MISSION', payload: { id: 20 } });

    const handler = vi.fn().mockResolvedValue(true);

    const result = await flushOfflineQueue(handler);

    expect(result.processed).toBe(2);
    expect(result.failed).toBe(0);
    expect(handler).toHaveBeenCalledTimes(2);

    const remaining = await getPendingOfflineQueue();
    expect(remaining.length).toBe(0);
  });

  it('retains item in queue when sync handler fails', async () => {
    await enqueueOfflineAction({ type: 'APPROVE_LEAVE', payload: { id: 99 } });

    const handler = vi.fn().mockResolvedValue(false);

    const result = await flushOfflineQueue(handler);

    expect(result.processed).toBe(0);
    expect(result.failed).toBe(1);

    const remaining = await getPendingOfflineQueue();
    expect(remaining.length).toBe(1);
    expect(remaining[0].payload.id).toBe(99);
  });

  it('notifies subscribers when items are added or removed', async () => {
    const subscriber = vi.fn();
    const unsubscribe = subscribeOfflineQueue(subscriber);

    const id = await enqueueOfflineAction({ type: 'APPROVE_LEAVE', payload: {} });
    expect(subscriber).toHaveBeenCalled();

    subscriber.mockClear();
    await removeOfflineAction(id);
    expect(subscriber).toHaveBeenCalled();

    unsubscribe();
  });
});
