import { ClientOpts, createClient, RedisClient } from 'redis';

import log from '@shypple/shared/log';
import config from '@shypple/config';

export class Redis {
  private static instance: Redis;
  private client: RedisClient;

  static get Instance() {
    if (this.instance) return this.instance;

    this.instance = new this();
    this.instance.init();

    return this.instance;
  }

  private init() {
    this.client = createClient(Redis.getRedisClientOptions());

    this.client.on('error', (err) => {
      log.error('Error in Redis client.', { err });
      process.exit(-1);
    });
  }

  static getRedisClientOptions(): ClientOpts {
    return {
      host: config.redis.host,
      port: Number(config.redis.port),
      db: config.redis.db,
      password: config.redis.password,
    };
  }
}
