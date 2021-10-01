import 'dotenv/config';
import express from 'express';

import { json } from 'body-parser';
import cors from 'cors';

import { env } from '@shared/env';
import Logger from '@shared/errors/Logger';

import '@shared/infra/typeorm';
import '@shared/container';

import routes from '../../../modules/webhook/infra/http/routes/webhook.routes';

const app = express();

// parse json request body
app.use(express.json());
app.use(json());

app.use(
  cors({
    exposedHeaders: ['x-total-count', 'Content-Type', 'Content-Length'],
  }),
);

app.use(
  express.json({
    type: ['application/json', 'text/plain'],
  }),
);

app.use(routes);

app
  .listen(env.APP_API_PORT_WEEBHOOK, () => {
    Logger.info(`🚀 Webhook started on port ${env.APP_API_PORT_WEEBHOOK}`);
  })
  .on('error', error => {
    Logger.error(`
  ********************************************
  🔥 ERROR STARTING WEBHOOK ${error}
  ********************************************
  `);
    process.exit(1);
  });
