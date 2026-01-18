// IndexedDB for offline Quran storage

const DB_NAME = 'alsamos-quran-offline';
const DB_VERSION = 1;

interface OfflineSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  verses: Array<{
    number: number;
    numberInSurah: number;
    text: string;
    translation?: string;
  }>;
  savedAt: number;
}

interface OfflineAudio {
  key: string; // surah_ayah_reciter
  blob: Blob;
  savedAt: number;
}

let db: IDBDatabase | null = null;

export const initOfflineDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      // Surah store
      if (!database.objectStoreNames.contains('surahs')) {
        const surahStore = database.createObjectStore('surahs', { keyPath: 'number' });
        surahStore.createIndex('savedAt', 'savedAt', { unique: false });
      }

      // Audio store
      if (!database.objectStoreNames.contains('audio')) {
        const audioStore = database.createObjectStore('audio', { keyPath: 'key' });
        audioStore.createIndex('savedAt', 'savedAt', { unique: false });
      }

      // Metadata store
      if (!database.objectStoreNames.contains('metadata')) {
        database.createObjectStore('metadata', { keyPath: 'key' });
      }
    };
  });
};

// Save surah for offline use
export const saveSurahOffline = async (surah: OfflineSurah): Promise<void> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['surahs'], 'readwrite');
    const store = transaction.objectStore('surahs');
    const request = store.put({ ...surah, savedAt: Date.now() });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Get offline surah
export const getOfflineSurah = async (surahNumber: number): Promise<OfflineSurah | null> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['surahs'], 'readonly');
    const store = transaction.objectStore('surahs');
    const request = store.get(surahNumber);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

// Get all offline surahs
export const getAllOfflineSurahs = async (): Promise<number[]> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['surahs'], 'readonly');
    const store = transaction.objectStore('surahs');
    const request = store.getAllKeys();
    request.onsuccess = () => resolve(request.result as number[]);
    request.onerror = () => reject(request.error);
  });
};

// Save audio for offline use
export const saveAudioOffline = async (surahNumber: number, ayahNumber: number, reciter: string, audioUrl: string): Promise<void> => {
  try {
    const response = await fetch(audioUrl);
    if (!response.ok) return;
    
    const blob = await response.blob();
    const database = await initOfflineDB();
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['audio'], 'readwrite');
      const store = transaction.objectStore('audio');
      const key = `${surahNumber}_${ayahNumber}_${reciter}`;
      const request = store.put({ key, blob, savedAt: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving audio offline:', error);
  }
};

// Get offline audio
export const getOfflineAudio = async (surahNumber: number, ayahNumber: number, reciter: string): Promise<string | null> => {
  try {
    const database = await initOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['audio'], 'readonly');
      const store = transaction.objectStore('audio');
      const key = `${surahNumber}_${ayahNumber}_${reciter}`;
      const request = store.get(key);
      request.onsuccess = () => {
        if (request.result?.blob) {
          resolve(URL.createObjectURL(request.result.blob));
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
};

// Delete offline surah
export const deleteOfflineSurah = async (surahNumber: number): Promise<void> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['surahs'], 'readwrite');
    const store = transaction.objectStore('surahs');
    const request = store.delete(surahNumber);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Get offline storage size estimate
export const getOfflineStorageSize = async (): Promise<{ used: number; quota: number }> => {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    return {
      used: estimate.usage || 0,
      quota: estimate.quota || 0,
    };
  }
  return { used: 0, quota: 0 };
};

// Check if online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Add online/offline listeners
export const addNetworkListeners = (onOnline: () => void, onOffline: () => void): () => void => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};
