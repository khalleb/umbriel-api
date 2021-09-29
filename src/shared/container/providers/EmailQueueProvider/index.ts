import { container } from 'tsyringe';

import queueConfig from '@config/queue';

import { MAIL_QUEUE_PROVIDER_NAME } from '@shared/container/utils/ProviderNames';

import { BullProvider } from './implementations/BullProvider';
import { SyncQueueProvider } from './implementations/SyncQueueProvider';
import { IMailQueueProvider } from './models/IMailQueueProvider';

const providers = {
  BULL: container.resolve(BullProvider),
  SYNC: container.resolve(SyncQueueProvider),
};

container.registerInstance<IMailQueueProvider>(MAIL_QUEUE_PROVIDER_NAME, providers[queueConfig.driver]);
