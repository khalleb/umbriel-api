import { env } from '@shared/env';

export default {
  jwt: {
    secret_token: `${env.JWT_APP_SECRET}`,
    expires_in_token: `${env.JWT_APP_EXPIRES}`,
    secret_refresh_token: `${env.JWT_APP_SECRET_REFRESH_TOKEN}`,
    expires_in_refresh_token: `${env.JWT_APP_EXPIRES_REFRESH_TOKEN}`,
    expires_refresh_token_days: `${env.JWT_APP_EXPIRES_REFRESH_TOKEN_DAYS}`,
  },
};
