import 'dotenv/config';
import express from 'express';

import { json } from 'body-parser';
import cors from 'cors';

import '@shared/infra/typeorm';
import '@shared/container';

import { env } from '@shared/env';
import { AppLogger } from '@shared/logger';

import routes from '../../../modules/webhook/infra/http/routes/webhook.routes';

const app = express();

// app.post('/events/notifications', text(), (req, resp, next) => {
//   try {
//     const payloadStr = req.body;
//     console.log(payloadStr);
//   } catch (err) {
//     console.error(err);
//     resp.status(500).send('Oops');
//   }
//   resp.send('Ok');
// });

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
    AppLogger.info({ message: `👀 WEBHOOK STARTED ON PORT ${env.APP_API_PORT_WEEBHOOK}` });
  })
  .on('error', error => {
    AppLogger.error({
      message: `
    ********************************************
    🔥 ERROR STARTING WEBHOOK ${error}
    ********************************************
    `,
    });
    process.exit(1);
  });
