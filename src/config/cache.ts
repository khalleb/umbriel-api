import { RedisOptions } from 'ioredis';

import { env } from '@shared/env';

export const redisConnectionOptions: RedisOptions = {
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  password: env.REDIS_PASS,
  db: Number(env.REDIS_DB),
};

interface ICacheConfig {
  driver: 'redis';

  config: {
    redis: RedisOptions;
  };
}

export default {
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
