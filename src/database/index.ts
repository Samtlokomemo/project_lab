/**
 * Database & Local Storage module.
 * Dedicated to the Database branch (SQLite, AsyncStorage, WatermelonDB, or cache layer).
 */

export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

// In-memory fallback adapter until persistent storage or SQLite is configured on the database branch
const memoryStorage = new Map<string, string>();

export const localDatabase: StorageAdapter = {
  async getItem(key: string) {
    return memoryStorage.get(key) ?? null;
  },
  async setItem(key: string, value: string) {
    memoryStorage.set(key, value);
  },
  async removeItem(key: string) {
    memoryStorage.delete(key);
  },
  async clear() {
    memoryStorage.clear();
  },
};
