import 'dotenv/config';
import 'reflect-metadata';
import { container } from 'tsyringe';

import ProcessQueueService from '@modules/messages/services/ProcessQueueService';

import '@shared/container';
import Logger from '@shared/errors/Logger';

const processQueue = container.resolve(ProcessQueueService);

processQueue.execute();
Logger.info(`🚀 SERVER UMBRIEL QUEUE STARTED`);
