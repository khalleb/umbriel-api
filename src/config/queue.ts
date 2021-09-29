import { env } from '@shared/env';

interface IQueueConfig {
  driver: 'BULL' | 'SYNC';
}

export default {
  driver: env.QUEUE_DRIVER,
} as IQueueConfig;
