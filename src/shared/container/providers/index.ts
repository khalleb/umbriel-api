import { container } from 'tsyringe';

import { mailConfig } from '@config/mail';
import { queueConfig } from '@config/queue';

import { RedisCacheProvider } from './CacheProvider/implementations/RedisCacheProvider';
import { ICacheProvider } from './CacheProvider/models/ICacheProvider';
import { DateFnsProvider } from './DateProvider/implementations/DateFnsProvider';
import { IDateProvider } from './DateProvider/models/IDateProvider';
import { mailQueueProviders } from './EmailQueueProvider';
import { IMailQueueProvider } from './EmailQueueProvider/models/IMailQueueProvider';
import { BCryptHashProvider } from './HashProvider/implementations/BCryptHashProvider';
import { IHashProvider } from './HashProvider/models/IHashProvider';
import { mailProviders } from './MailProvider';
import { IMailProvider } from './MailProvider/models/IMailProvider';

const registeredProviders = {
  hashProvider: 'HashProvider',
  emailQueueProvider: 'EmailQueueProvider',
  cacheProvider: 'CacheProvider',
  dateProvider: 'DateProvider',
  mailProvider: 'MailProvider',
} as const;
function registerProviders() {
  container.registerSingleton<IHashProvider>(registeredProviders.hashProvider, BCryptHashProvider);

  container.registerSingleton<IMailQueueProvider>(
    registeredProviders.emailQueueProvider,
    mailQueueProviders[queueConfig.driver],
  );

  container.registerSingleton<ICacheProvider>(registeredProviders.cacheProvider, RedisCacheProvider);

  container.registerSingleton<IDateProvider>(registeredProviders.dateProvider, DateFnsProvider);

  container.registerSingleton<IMailProvider>(registeredProviders.mailProvider, mailProviders[mailConfig.driver]);
}
export { registeredProviders, registerProviders };
