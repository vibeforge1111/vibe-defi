import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    logger.warn('REDIS_URL not set, caching disabled');
    return null;
  }

  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: () => 100,
    });

    redis.on('error', (err) => {
      logger.error('Redis error:', err);
    });

    return redis;
  } catch {
    logger.warn('Failed to connect to Redis, caching disabled');
    return null;
  }
}

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    const client = getRedis();
    if (!client) return null;

    try {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    const client = getRedis();
    if (!client) return;

    try {
      await client.setex(key, ttlSeconds, JSON.stringify(value));
    } catch {
      // Ignore cache errors
    }
  },

  async invalidate(pattern: string): Promise<void> {
    const client = getRedis();
    if (!client) return;

    try {
      const keys = await client.keys(pattern);
      if (keys.length) {
        await client.del(...keys);
      }
    } catch {
      // Ignore cache errors
    }
  },

  // Cache TTL configuration
  ttl: {
    farms: 60,           // 1 minute
    protocols: 3600,     // 1 hour
    chains: 86400,       // 24 hours
    prices: 30,          // 30 seconds
    history: 300,        // 5 minutes
  },
};
