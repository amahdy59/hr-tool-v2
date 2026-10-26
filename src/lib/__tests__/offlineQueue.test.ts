import { describe, it, expect, beforeEach, vi } from 'vitest';
import { enqueueOfflineAction, getPendingOfflineQueue, removeOfflineAction, flushOfflineQueue, subscribeOfflineQueue } from '../offlineQueue';

describe('offline queue committed storage and replay', () => {
  let records: Map<string, any>;
  let abortNext: string | undefined;
  let close: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    records = new Map(); abortNext = undefined; close = vi.fn();
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    const indexedDB = { open: () => {
      const request: any = {};
      queueMicrotask(() => {
        request.result = { close, objectStoreNames: { contains: () => true }, transaction: () => {
          const tx: any = {};
          const operation = (kind: string, value?: any) => {
            const result: any = {};
            setTimeout(() => {
              if (abortNext === kind) { abortNext = undefined; tx.onabort?.(); return; }
              if (kind === 'getAll') result.result = [...records.values()].map(v => structuredClone(v));
              if (kind === 'add' || kind === 'put') records.set(value.id, structuredClone(value));
              if (kind === 'delete') records.delete(value);
              result.onsuccess?.(); tx.oncomplete?.();
            }, 0);
            return result;
          };
          tx.objectStore = () => ({ add: (v: any) => operation('add', v), put: (v: any) => operation('put', v), delete: (v: any) => operation('delete', v), getAll: () => operation('getAll') });
          return tx;
        } };
        request.onsuccess?.();
      });
      return request;
    } };
    Object.defineProperty(window, 'indexedDB', { value: indexedDB, configurable: true });
  });
  const add = () => enqueueOfflineAction({ type: 'APPROVE_LEAVE', payload: { leaveId: 'leave-1' } });
  it('commits the action with a stable submission ID and notifies subscribers', async () => {
    const changed = vi.fn(); const unsubscribe = subscribeOfflineQueue(changed);
    const id = await add();
    expect((await getPendingOfflineQueue())[0]).toMatchObject({ id, retryCount: 0, submissionId: expect.any(String) });
    expect(changed).toHaveBeenCalledOnce();
    await removeOfflineAction(id); expect(await getPendingOfflineQueue()).toEqual([]);
    unsubscribe(); expect(close).toHaveBeenCalledTimes(4);
  });
  it('rejects an aborted write instead of pretending it was saved', async () => {
    abortNext = 'add'; await expect(add()).rejects.toThrow('aborted');
    expect(await getPendingOfflineQueue()).toEqual([]);
  });
  it('retains failed requests and prevents later decisions overtaking them', async () => {
    await add(); await add(); const handler = vi.fn().mockRejectedValue(new Error('network'));
    expect(await flushOfflineQueue(handler)).toEqual({ processed: 0, failed: 1 });
    expect(handler).toHaveBeenCalledOnce();
    expect((await getPendingOfflineQueue()).map(v => v.retryCount)).toEqual([1, 0]);
  });
  it('does not count success when queue deletion aborts and reuses the same ID on retry', async () => {
    await add(); const handler = vi.fn().mockResolvedValue(true); abortNext = 'delete';
    expect(await flushOfflineQueue(handler)).toEqual({ processed: 0, failed: 1 });
    const original = handler.mock.calls[0][0].submissionId;
    expect(await flushOfflineQueue(handler)).toEqual({ processed: 1, failed: 0 });
    expect(handler.mock.calls[1][0].submissionId).toBe(original);
    expect(await getPendingOfflineQueue()).toEqual([]);
  });
  it('serializes overlapping retries so an action is submitted once', async () => {
    await add(); let finish!: (value: boolean) => void;
    const handler = vi.fn(() => new Promise<boolean>(resolve => { finish = resolve; }));
    const first = flushOfflineQueue(handler); const second = flushOfflineQueue(handler);
    expect(second).toBe(first);
    await vi.waitFor(() => expect(handler).toHaveBeenCalledOnce()); finish(true);
    expect(await first).toEqual({ processed: 1, failed: 0 });
  });
  it('persists IDs for legacy requests before submitting', async () => {
    records.set('old', { id: 'old', type: 'APPROVE_LEAVE', payload: {}, timestamp: 1, retryCount: 0 });
    await flushOfflineQueue(async item => { expect(records.get('old').submissionId).toBe(item.submissionId); return true; });
    expect(records.size).toBe(0);
  });
  it('keeps requests queued while offline', async () => {
    await add(); Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    const handler = vi.fn(); expect(await flushOfflineQueue(handler)).toEqual({ processed: 0, failed: 0 });
    expect(handler).not.toHaveBeenCalled(); expect(records.size).toBe(1);
  });
  it('exposes unavailable storage rather than returning an empty queue', async () => {
    Object.defineProperty(window, 'indexedDB', { value: undefined, configurable: true });
    await expect(getPendingOfflineQueue()).rejects.toThrow('not supported');
  });
});
