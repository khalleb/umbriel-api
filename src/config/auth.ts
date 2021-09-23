import { env } from '@shared/env';

export default {
  jwt: {
    secret_token: `${env.JWT_APP_SECRET}`,
    expires_in_token: `${env.JWT_APP_EXPIRES}`,
    expires_refresh_token_days: `${env.JWT_APP_EXPIRES_REFRESH_TOKEN_DAYS}`,
  },
};
