import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import { MAIL_PROVIDER_NAME } from '@shared/container/utils/ProviderNames';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import IMailProvider from './models/IMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
};

container.registerInstance<IMailProvider>(MAIL_PROVIDER_NAME, providers[mailConfig.driver]);
