import { env } from '@shared/env';
import { nameProject } from '@shared/utils/stringUtil';

interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

const mailConfig = {
  driver: env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: `${env.DELIVERY_EMAIL}`,
      name: nameProject(),
    },
  },
} as IMailConfig;
export { mailConfig };
