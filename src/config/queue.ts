import { env } from '@shared/env';

interface IQueueConfig {
  driver: 'BULL' | 'SYNC';
}

const queueConfig = {
  driver: env.QUEUE_DRIVER || 'SYNC',
} as IQueueConfig;

export { queueConfig };
