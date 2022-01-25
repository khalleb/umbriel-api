import 'dotenv/config';
import 'reflect-metadata';
import { container } from 'tsyringe';

import { ProcessQueueService } from '@modules/messages/services/ProcessQueueService';

import { AppLogger } from '@shared/logger';

const processQueue = container.resolve(ProcessQueueService);

processQueue.execute();
AppLogger.info({ message: `🚀 SERVER UMBRIEL QUEUE STARTED` });
