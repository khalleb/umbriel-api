import { container } from 'tsyringe';

import { HASH_PROVIDER_NAME } from '@shared/container/utils/ProviderNames';

import BCryptHashProvider from './implementations/BCryptHashProvider';
import IHashProvider from './models/IHashProvider';

container.registerSingleton<IHashProvider>(HASH_PROVIDER_NAME, BCryptHashProvider);
