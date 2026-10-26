export interface QueuedOfflineRequest {
  id: string;
  type: 'CREATE_LEAVE' | 'APPROVE_LEAVE' | 'REJECT_LEAVE' | 'CREATE_MISSION';
  payload: any;
  timestamp: number;
  retryCount: number;
  submissionId?: string;
}

const DB_NAME = 'hr_tool_offline_db';
const STORE_NAME = 'pending_requests';
let activeFlush: Promise<{ processed: number; failed: number }> | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) return reject(new Error('IndexedDB not supported'));
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// A request succeeding is not a committed transaction. Acknowledge only oncomplete.
async function transaction<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDB();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const request = operation(tx.objectStore(STORE_NAME));
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = () => reject(tx.error || new Error('Offline storage transaction failed'));
      tx.onabort = () => reject(tx.error || new Error('Offline storage transaction aborted'));
    });
  } finally {
    db.close();
  }
}

export async function enqueueOfflineAction(action: Omit<QueuedOfflineRequest, 'id' | 'timestamp' | 'retryCount' | 'submissionId'>): Promise<string> {
  const item: QueuedOfflineRequest = {
    ...action,
    id: 'off_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    timestamp: Date.now(),
    retryCount: 0,
    submissionId: crypto.randomUUID(),
  };
  await transaction('readwrite', store => store.add(item));
  notifyQueueSubscribers();
  return item.id;
}

export async function getPendingOfflineQueue(): Promise<QueuedOfflineRequest[]> {
  const items = await transaction<QueuedOfflineRequest[]>('readonly', store => store.getAll());
  return items.sort((a, b) => a.timestamp - b.timestamp);
}

export async function removeOfflineAction(id: string): Promise<void> {
  await transaction('readwrite', store => store.delete(id));
  notifyQueueSubscribers();
}

async function replayQueue(handler: (item: QueuedOfflineRequest) => Promise<boolean>) {
  const queue = await getPendingOfflineQueue();
  let processed = 0;
  let failed = 0;
  for (const item of queue) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) break;
    try {
      // Persist a stable ID before any remote create, including legacy queued requests.
      if (!item.submissionId) {
        item.submissionId = crypto.randomUUID();
        await transaction('readwrite', store => store.put(item));
      }
      if (!await handler(item)) throw new Error('Replay was not acknowledged');
      await removeOfflineAction(item.id);
      processed++;
    } catch {
      failed++;
      item.retryCount += 1;
      try { await transaction('readwrite', store => store.put(item)); } catch { /* The original request stays queued. */ }
      // Preserve order: do not let a later decision overtake a failed decision.
      break;
    }
  }
  notifyQueueSubscribers();
  return { processed, failed };
}

export function flushOfflineQueue(handler: (item: QueuedOfflineRequest) => Promise<boolean>): Promise<{ processed: number; failed: number }> {
  if (activeFlush) return activeFlush;
  const run = () => replayQueue(handler);
  activeFlush = (typeof navigator !== 'undefined' && navigator.locks
    ? navigator.locks.request('hr-tool-offline-replay', run)
    : run()).finally(() => { activeFlush = null; });
  return activeFlush;
}

function notifyQueueSubscribers() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('hr-offline-queue-changed'));
}

export function subscribeOfflineQueue(callback: () => void): () => void {
  window.addEventListener('hr-offline-queue-changed', callback);
  return () => window.removeEventListener('hr-offline-queue-changed', callback);
}
