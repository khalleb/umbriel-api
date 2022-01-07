import { BullProvider } from './implementations/BullProvider';
import { SyncQueueProvider } from './implementations/SyncQueueProvider';

const mailQueueProviders = {
  BULL: BullProvider,
  SYNC: SyncQueueProvider,
};

export { mailQueueProviders };
