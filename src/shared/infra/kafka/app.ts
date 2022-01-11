import 'dotenv/config';

import { AppLogger } from '@shared/logger';

import { start } from './consumer';

start().then(() => {
  AppLogger.info({ message: '🤡 KAFKA running' });
});
