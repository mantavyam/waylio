import { PrismaClient } from '@prisma/client';
import { cache } from '../config/redis.js';

export abstract class BaseService {
  protected prisma: PrismaClient;
  protected cache = cache;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  protected getCacheKey(prefix: string, id: string): string {
    return `${prefix}:${id}`;
  }

  protected async getCached<T>(key: string): Promise<T | null> {
    return await this.cache.get<T>(key);
  }

  protected async setCached(key: string, value: any, ttl?: number): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  protected async invalidateCache(key: string): Promise<void> {
    await this.cache.del(key);
  }

  protected async invalidateCachePattern(pattern: string): Promise<void> {
    await this.cache.flushPattern(pattern);
  }
}

