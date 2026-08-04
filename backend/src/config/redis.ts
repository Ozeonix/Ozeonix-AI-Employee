import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on('connect', () => {
  logger.info('🔴 Redis Client connected successfully');
});

redis.on('error', (err) => {
  logger.warn(`⚠️ Redis Connection Error: ${err.message}`);
});

export class RedisCache {
  public static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (_err) {
      return null;
    }
  }

  public static async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (_err) {
      // Graceful fallback
    }
  }

  public static async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (_err) {
      // Graceful fallback
    }
  }
}
