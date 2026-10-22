import { getRedisClient, isRedisConnected } from '../../bootstrap/redis.js';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * In-Memory Map fallback cache.
 * Keeps memory ultra-lightweight with an internal cap of 500 items.
 */
const memoryCache = new Map<string, CacheEntry<unknown>>();
const MAX_MEMORY_CACHE_ITEMS = 500;

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (now >= entry.expiresAt) {
      memoryCache.delete(key);
    }
  }

  // If still above cap, evict oldest inserted entries
  if (memoryCache.size > MAX_MEMORY_CACHE_ITEMS) {
    const keysToEvict = Array.from(memoryCache.keys()).slice(
      0,
      memoryCache.size - MAX_MEMORY_CACHE_ITEMS,
    );
    for (const key of keysToEvict) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Hybrid Cache Utility:
 * - Uses Redis when connected.
 * - Seamlessly falls back to Node.js in-memory RAM cache when Redis is offline.
 * - Supports TTL (auto-expiration).
 */
export const cache = {
  /**
   * Retrieves a cached value by key.
   */
  async get<T>(key: string): Promise<T | null> {
    // 1. Try Redis first if connected
    if (isRedisConnected()) {
      const client = getRedisClient();
      if (client) {
        try {
          const raw = await client.get(key);
          if (raw) {
            return JSON.parse(raw) as T;
          }
        } catch {
          // Fall through to memory cache on Redis read error
        }
      }
    }

    // 2. In-memory RAM cache
    const entry = memoryCache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() >= entry.expiresAt) {
      memoryCache.delete(key);
      return null;
    }

    return entry.value as T;
  },

  /**
   * Stores a value in cache with a TTL (in seconds). Default TTL: 300s (5 minutes).
   */
  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    // 1. Set in Redis if connected
    if (isRedisConnected()) {
      const client = getRedisClient();
      if (client) {
        try {
          await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        } catch {
          // Non-fatal, fall back to memory
        }
      }
    }

    // 2. Set in Node.js in-memory RAM
    cleanupExpiredEntries();
    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  },

  /**
   * Cache-Aside Helper:
   * Returns cached value if available; otherwise executes the fetcher,
   * stores result in cache with TTL, and returns it.
   */
  async remember<T>(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await fetcher();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  },

  /**
   * Deletes a key from cache.
   */
  async delete(key: string): Promise<void> {
    if (isRedisConnected()) {
      const client = getRedisClient();
      if (client) {
        try {
          await client.del(key);
        } catch {
          // ignore
        }
      }
    }
    memoryCache.delete(key);
  },

  /**
   * Clears the in-memory cache.
   */
  clear(): void {
    memoryCache.clear();
  },
};
