import { AppLogger } from '@shared/logger';

import { registerProviders, registeredProviders } from './providers';
import { registerRepositories, registeredRepositories } from './repositories';
import { registerServices, registeredServices } from './services';

const registeredDependencies = {
  ...registeredServices,
  ...registeredRepositories,
  ...registeredProviders,
};

AppLogger.info({ type: 'DEPENDENCIES REGISTERED', message: Object.values(registeredDependencies) });

function registerDependencies() {
  registerRepositories();
  registerProviders();
  registerServices();
}

const tokenValuesServices = Object.values({ ...registeredServices });

type tokensServices = typeof tokenValuesServices[number];
export { registeredDependencies, registerDependencies, tokensServices };
