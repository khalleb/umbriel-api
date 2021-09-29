import 'dotenv/config';
import { cleanEnv, str, port, url, num } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'], example: 'development' }),

  CORS_HOSTS: str({ example: 'http://localhost:3000;localhost:3000' }),

  APP_API_PORT: port({ example: '3333' }),
  APP_API_URL: url({
    example: `http://localhost:3333`,
  }),
  APP_WEB_URL: url({ example: `http://localhost:3334` }),
  PAGE_SIZE: num({ example: `10` }),
  NAME_PROJECT: str({ example: `UMBRIEL` }),
  DELIVERY_EMAIL: str({ example: `contact@mail.com.br` }),

  JWT_APP_SECRET: str({ devDefault: '' }),
  JWT_APP_EXPIRES: str({ example: `15m`, devDefault: `15m` }),
  JWT_APP_EXPIRES_REFRESH_TOKEN_DAYS: num({ example: `30`, devDefault: 30 }),
  JWT_BLACK_LIST: str({ example: `UMBRIEL_JWT_BLACK_LIST` }),

  POSTGRES_HOST: str({ example: '127.0.0.1' }),
  POSTGRES_PORT: port({ example: '5432' }),
  POSTGRES_USER: str({ example: 'postgres' }),
  POSTGRES_PASS: str({ example: '123456' }),
  POSTGRES_DATABASE: str({ example: 'umbriel' }),

  REDIS_HOST: str({ example: '127.0.0.1' }),
  REDIS_PORT: port({ example: '6379' }),
  REDIS_PASS: str({ example: 'redis' }),
  REDIS_DB: num({ example: '5' }),
  REDIS_ID: str({ example: 'UMBRIEL' }),

  AWS_REGION: str({ devDefault: '' }),
  AWS_ACCESS_KEY_ID: str({ devDefault: '' }),
  AWS_SECRET_ACCESS_KEY: str({ devDefault: '' }),

  MAIL_DRIVER: str({ choices: ['ethereal', 'ses'] }),

  QUEUE_DRIVER: str({ choices: ['BULL', 'SYNC'], devDefault: 'BULL' }),
});
export { env };
