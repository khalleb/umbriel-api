import { container } from 'tsyringe';

import { DATE_PROVIDER_NAME } from '@shared/container/utils/ProviderNames';

import DateFnsProvider from './implementations/DateFnsProvider';
import { IDateProvider } from './models/IDateProvider';

container.registerSingleton<IDateProvider>(DATE_PROVIDER_NAME, DateFnsProvider);
