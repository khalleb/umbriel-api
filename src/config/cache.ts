import Redis, { RedisOptions } from 'ioredis';

import { env } from '@shared/env';

export const redisConnection = new Redis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  password: env.REDIS_PASS,
  db: Number(env.REDIS_DB),
});

interface ICacheConfig {
  driver: 'redis';
  config: {
    redis: RedisOptions;
  };
}

const cacheConfig = {
  driver: 'redis',

  config: {
    redis: {
      host: env.REDIS_HOST,
      port: Number(env.REDIS_PORT),
      password: env.REDIS_PASS,
      db: Number(env.REDIS_DB),
    },
  },
} as ICacheConfig;

export { cacheConfig };
