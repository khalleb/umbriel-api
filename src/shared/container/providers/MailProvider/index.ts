import { AmazonSESProvider } from './implementations/AmazonSESProvider';
import { EtherealMailProvider } from './implementations/EtherealMailProvider';

const mailProviders = {
  ethereal: EtherealMailProvider,
  ses: AmazonSESProvider,
};

export { mailProviders };
