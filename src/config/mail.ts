import { env } from '@shared/env';

interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: `${env.DELIVERY_EMAIL}`,
      name: `${env.NAME_PROJECT}`,
    },
  },
} as IMailConfig;
