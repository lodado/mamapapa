export type OutboxItem = {
  id: string;
  content: string;
  createdAt: number;
  status: "queued" | "sending" | "sent" | "failed";
  error?: string;
};

const DB_NAME = "offline-demo-db";
const STORE_NAME = "outbox";
const DB_VERSION = 1;

const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const runTransaction = async <T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>) => {
  const db = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = fn(store);

    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
};

export const getAllOutboxItems = async (): Promise<OutboxItem[]> => {
  const db = await openDatabase();
  return new Promise<OutboxItem[]>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve((request.result ?? []) as OutboxItem[]);
    request.onerror = () => reject(request.error);
  });
};

export const putOutboxItem = async (item: OutboxItem) =>
  runTransaction("readwrite", (store) => store.put(item));

export const bulkPutOutboxItems = async (items: OutboxItem[]) => {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    items.forEach((item) => store.put(item));

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const updateOutboxStatus = async (id: string, status: OutboxItem["status"], error?: string) => {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const existing = request.result as OutboxItem | undefined;
      if (!existing) {
        resolve();
        return;
      }

      store.put({ ...existing, status, error });
      transaction.oncomplete = () => resolve();
    };

    request.onerror = () => reject(request.error);
    transaction.onerror = () => reject(transaction.error);
  });
};
