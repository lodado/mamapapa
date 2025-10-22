import type { FaceCoordinates, ImageMetadata } from "../models/ImageSelectorStore";

const DB_NAME = "face-comparison-images";
const STORE_NAME = "images";
const DB_VERSION = 1;

interface PersistedImageRecord {
  id: string;
  blob: Blob;
  fileName: string;
  fileType: string;
  lastModified: number;
  faceCoordinates: FaceCoordinates;
  selectedPlayer?: string;
  embedding?: number[] | null;
}

const isIndexedDBAvailable = () => typeof window !== "undefined" && typeof window.indexedDB !== "undefined";

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      reject(new Error("IndexedDB is not available in this environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Failed to open IndexedDB."));
    };
  });
};

const toPersistedRecord = (image: ImageMetadata): PersistedImageRecord => ({
  id: image.id,
  blob: image.file,
  fileName: image.file.name,
  fileType: image.file.type,
  lastModified: image.file.lastModified,
  faceCoordinates: image.faceCoordinates,
  selectedPlayer: image.selectedPlayer,
  embedding: image.embedding ? Array.from(image.embedding) : null,
});

const toImageMetadata = (record: PersistedImageRecord): ImageMetadata => {
  const file = new File([record.blob], record.fileName, {
    type: record.fileType,
    lastModified: record.lastModified,
  });

  return {
    id: record.id,
    file,
    url: URL.createObjectURL(file),
    faceCoordinates: record.faceCoordinates,
    selectedPlayer: record.selectedPlayer,
    embedding: record.embedding ? new Float32Array(record.embedding) : undefined,
  };
};

export const loadImagesFromIndexedDB = async (): Promise<ImageMetadata[]> => {
  if (!isIndexedDBAvailable()) return [];

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const records = request.result as PersistedImageRecord[];
      db.close();
      resolve(records.map(toImageMetadata));
    };

    request.onerror = () => {
      db.close();
      reject(request.error ?? new Error("Failed to load images from IndexedDB."));
    };
  });
};

export const persistImagesToIndexedDB = async (images: ImageMetadata[]): Promise<void> => {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDatabase();

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };

      transaction.onerror = () => {
        const error = transaction.error ?? new Error("Failed to save images to IndexedDB.");
        db.close();
        reject(error);
      };

      store.clear();

      images.forEach((image) => {
        store.put(toPersistedRecord(image));
      });
    });
  } catch (error) {
    console.error(error);
  }
};

export const clearStoredImages = async (): Promise<void> => {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDatabase();

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };

      transaction.onerror = () => {
        const error = transaction.error ?? new Error("Failed to clear IndexedDB store.");
        db.close();
        reject(error);
      };

      store.clear();
    });
  } catch (error) {
    console.error(error);
  }
};
