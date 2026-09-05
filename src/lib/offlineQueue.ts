export interface QueuedOfflineRequest {
  id: string;
  type: 'CREATE_LEAVE' | 'APPROVE_LEAVE' | 'REJECT_LEAVE' | 'CREATE_MISSION';
  payload: any;
  timestamp: number;
  retryCount: number;
}

const DB_NAME = 'hr_tool_offline_db';
const STORE_NAME = 'pending_requests';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function enqueueOfflineAction(action: Omit<QueuedOfflineRequest, 'id' | 'timestamp' | 'retryCount'>): Promise<string> {
  try {
    const db = await openDB();
    const item: QueuedOfflineRequest = {
      ...action,
      id: `off_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    notifyQueueSubscribers();
    return item.id;
  } catch (err) {
    console.warn('Failed to enqueue into IndexedDB:', err);
    return '';
  }
}

export async function getPendingOfflineQueue(): Promise<QueuedOfflineRequest[]> {
  try {
    const db = await openDB();
    return await new Promise<QueuedOfflineRequest[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function removeOfflineAction(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    notifyQueueSubscribers();
  } catch (err) {
    console.warn('Failed to delete offline item:', err);
  }
}

export async function flushOfflineQueue(
  handler: (item: QueuedOfflineRequest) => Promise<boolean>
): Promise<{ processed: number; failed: number }> {
  const queue = await getPendingOfflineQueue();
  let processed = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      const success = await handler(item);
      if (success) {
        await removeOfflineAction(item.id);
        processed++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  notifyQueueSubscribers();
  return { processed, failed };
}

function notifyQueueSubscribers() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hr-offline-queue-changed'));
  }
}
