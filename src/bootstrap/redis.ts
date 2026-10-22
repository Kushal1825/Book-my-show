import Redis from 'ioredis';
import { config } from '../config/env.js';
import { logger } from './logger.js';

/** Lazy-initialised Redis client singleton */
let redisClient: Redis | null = null;
let isRedisAvailable = false;

/**
 * Returns the active Redis client, or null if Redis is not connected.
 */
export function getRedisClient(): Redis | null {
  return redisClient;
}

/**
 * Checks whether Redis is currently connected and ready.
 */
export function isRedisConnected(): boolean {
  return isRedisAvailable;
}

/**
 * Connects to Redis with graceful fallback.
 * If Redis is offline (e.g. during local development when Docker isn't running),
 * logs a warning and allows the application to continue without crashing.
 */
export async function connectRedis(): Promise<void> {
  const client = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    // Limit retries so it doesn't loop infinitely when Redis is offline
    retryStrategy(times: number) {
      if (times > 2) {
        return null; // stop reconnecting
      }
      return 1000;
    },
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    enableOfflineQueue: false,
    connectTimeout: 2000,
  });

  // Attach error handler to prevent unhandled EventEmitter errors
  client.on('error', (err: Error) => {
    logger.debug({ message: err.message }, 'Redis connection notice');
  });

  client.on('connect', () => {
    logger.info('Redis client connected');
  });

  client.on('ready', () => {
    isRedisAvailable = true;
    logger.info('Redis client ready');
  });

  client.on('close', () => {
    isRedisAvailable = false;
  });

  try {
    await client.connect();
    redisClient = client;
    isRedisAvailable = true;
  } catch {
    logger.warn(
      `Redis connection skipped: Redis server is not reachable at ${config.redis.host}:${config.redis.port}. The server will continue running without Redis cache. (To enable Redis, run: docker compose -f docker/redis/compose.yml up -d)`,
    );
    try {
      client.disconnect();
    } catch {
      // safe fallback
    }
    redisClient = null;
    isRedisAvailable = false;
  }
}

/**
 * Gracefully disconnects the Redis client and clears the singleton.
 */
export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    try {
      if (redisClient.status === 'ready' || redisClient.status === 'connecting') {
        await redisClient.quit();
      } else {
        redisClient.disconnect();
      }
    } catch {
      redisClient.disconnect();
    } finally {
      redisClient = null;
      isRedisAvailable = false;
      logger.info('Redis disconnected gracefully');
    }
  }
}
