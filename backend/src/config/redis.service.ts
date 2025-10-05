import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: Redis;

  async onModuleInit() {
    const url = process.env.REDIS_URL; // ví dụ: redis://:pass@host:6379 hoặc rediss://...
    const useTLS = process.env.REDIS_TLS === 'true' || (url?.startsWith('rediss://') ?? false);

    const baseOptions: RedisOptions = {
      lazyConnect: true,                 // chủ động gọi connect()
      enableOfflineQueue: true,
      maxRetriesPerRequest: null,        // tránh lỗi với pub/sub/long commands
      retryStrategy: (times) => Math.min(times * 1000, 10000), // 1s,2s,...<=10s
      reconnectOnError: () => true,
      ...(useTLS ? { tls: {} } : {}),
      keyPrefix: process.env.REDIS_PREFIX || '', // optional namespacing
    };

    if (url) {
      this.client = new Redis(url, baseOptions);
    } else {
      this.client = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD || undefined,
        ...baseOptions,
      });
    }

    this.client.on('connect', () => this.logger.log('✅ Redis connected'));
    this.client.on('error', (err) => this.logger.error('❌ Redis error', err));

    // ioredis v5 có .connect(); nếu v4 sẽ bỏ qua
    if (typeof (this.client as any).connect === 'function') {
      // @ts-ignore
      await this.client.connect();
    }

    // sanity check
    await this.client.ping();
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
    } catch (e) {
      this.logger.error('Error closing Redis', e as any);
    }
  }
}
