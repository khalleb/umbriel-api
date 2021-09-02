import { container } from 'tsyringe';

import { CACHE_PROVIDER_NAME } from '@shared/container/utils/ProviderNames';

import RedisCacheProvider from './implementations/RedisCacheProvider';
import ICacheProvider from './models/ICacheProvider';

const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>(CACHE_PROVIDER_NAME, providers.redis);
