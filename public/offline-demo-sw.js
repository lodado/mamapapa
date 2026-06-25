const DB_NAME = "offline-demo-db";
const STORE_NAME = "outbox";
const DB_VERSION = 1;
const SYNC_TAG = "offline-demo-sync";

const openDatabase = () =>
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

const getAllItems = async () => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result ?? []);
    request.onerror = () => reject(request.error);
  });
};

const updateStatus = async (id, status, error) => {
  const db = await openDatabase();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const existing = request.result;
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

const broadcastMessage = async (payload) => {
  const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  clientList.forEach((client) => client.postMessage(payload));
};

const broadcastQueue = async () => {
  const queue = await getAllItems();
  await broadcastMessage({ type: "outbox-queue", queue });
};

const fetchQueueItems = async () => {
  const queue = await getAllItems();
  return queue.filter((item) => item.status !== "sent");
};

const flushOutbox = async () => {
  const pending = await fetchQueueItems();

  if (!pending.length) {
    await broadcastQueue();
    await broadcastMessage({ type: "sync-complete" });
    return;
  }

  await broadcastMessage({ type: "sync-start" });

  for (const item of pending) {
    await updateStatus(item.id, "sending");
    try {
      const response = await fetch("/api/offline-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, message: item.content, createdAt: item.createdAt }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      await updateStatus(item.id, "sent");
    } catch (error) {
      await updateStatus(item.id, "failed", error?.message ?? "Unknown error");
    }
  }

  await broadcastQueue();
  await broadcastMessage({ type: "sync-complete" });
};

const registerBackgroundSync = async () => {
  try {
    const registration = await self.registration.sync.register(SYNC_TAG);
    return registration;
  } catch (error) {
    return null;
  }
};

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("sync", (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(flushOutbox());
  }
});

self.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === "request-queue") {
    event.waitUntil(broadcastQueue());
    return;
  }

  if (data.type === "manual-sync") {
    event.waitUntil((async () => {
      const registration = await registerBackgroundSync();
      if (!registration) {
        await flushOutbox();
      }
    })());
    return;
  }

  if (data.type === "network-status" && data.online) {
    event.waitUntil((async () => {
      const registration = await registerBackgroundSync();
      if (!registration) {
        await flushOutbox();
      }
    })());
  }
});
