import { createClient, RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Redis connected'));

await redisClient.connect();

export { redisClient };

// Cache utilities
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await redisClient.setEx(key, ttl, serialized);
    } else {
      await redisClient.set(key, serialized);
    }
  },

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  },

  async exists(key: string): Promise<boolean> {
    return (await redisClient.exists(key)) === 1;
  },

  async keys(pattern: string): Promise<string[]> {
    return await redisClient.keys(pattern);
  },

  async flushPattern(pattern: string): Promise<void> {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  },
};

// Queue utilities for appointment queue management
export const queue = {
  async addToQueue(queueKey: string, appointmentId: string, position: number): Promise<void> {
    await redisClient.zAdd(queueKey, { score: position, value: appointmentId });
  },

  async removeFromQueue(queueKey: string, appointmentId: string): Promise<void> {
    await redisClient.zRem(queueKey, appointmentId);
  },

  async getQueuePosition(queueKey: string, appointmentId: string): Promise<number | null> {
    const rank = await redisClient.zRank(queueKey, appointmentId);
    return rank !== null ? rank + 1 : null;
  },

  async getQueueLength(queueKey: string): Promise<number> {
    return await redisClient.zCard(queueKey);
  },

  async getQueue(queueKey: string): Promise<string[]> {
    return await redisClient.zRange(queueKey, 0, -1);
  },

  async updatePosition(queueKey: string, appointmentId: string, newPosition: number): Promise<void> {
    await redisClient.zAdd(queueKey, { score: newPosition, value: appointmentId });
  },
};

