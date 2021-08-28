import redis, { Redis, RedisOptions } from 'ioredis';

import log from '@shypple/shared/log';
import config from '@shypple/config';

export class RedisClient {
  private static instance: RedisClient;
  private client: Redis;

  static get Instance() {
    if (this.instance) return this.instance;

    this.instance = new this();
    this.instance.init();

    return this.instance;
  }

  private init() {
    this.client = new redis(RedisClient.getRedisClientOptions());

    this.client.on('error', (err) => {
      log.error('Error in Redis client.', { err });
      process.exit(-1);
    });
  }

  static getRedisClientOptions(): RedisOptions {
    return {
      host: config.redis.host,
      port: Number(config.redis.port),
      db: Number(config.redis.db),
      password: config.redis.password,
    };
  }

  public getSetMembers(key: string) {
    return this.client.smembers(key);
  }

  public addToSet(key: string, value: string) {
    return this.client.sadd(key, value);
  }

  public removeFromSet(key: string, value: string) {
    return this.client.srem(key, value);
  }

  public expireMember(key: string, member: string, secs: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.client.sendCommand as any)(
      new redis.Command('EXPIREMEMBER', [key, member, secs])
    );
  }
}
