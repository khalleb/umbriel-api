import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';

import { json } from 'body-parser';
import { errors } from 'celebrate';
import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import path from 'path';

import { env } from '@shared/env';
import AppError from '@shared/errors/AppError';
import { errorConverter, errorHandler } from '@shared/errors/Error';
import Logger from '@shared/errors/Logger';
import '@shared/infra/typeorm';
import '@shared/container';

import { getEnvironment, getVersion } from '../devops/version';
import { i18n } from './internationalization';
import routes from './routes';

const app = express();

// JSON space
app.set('json spaces', 2);

app.disable('x-powered-by');

// Inactive error 304
app.disable('etag');

// set security HTTP headers
app.use(helmet());

// enable cors
if (!env.isDevelopment) {
  app.use((request: Request, response: Response, next: NextFunction) => {
    request.headers.origin = request.headers.origin || request.headers.host;
    next();
  });

  const whitelist = env.CORS_HOSTS.split(';');

  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        throw new AppError(`${i18n('validations.no_permission_for_origin')}: ${origin}`);
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
} else {
  app.use(cors({ origin: '*' }));
}

// parse json request body
app.use(express.json());
app.use(json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// Return page HTML
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// routes
app.use(routes);

// return page response
app.use((request: Request, response: Response, _: NextFunction) => {
  if (request.url === '/') {
    response.render('welcome', {
      nameProject: `${env.NAME_PROJECT}`,
    });
  } else {
    response.render('404');
  }
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// get celebrate errors
app.use(errors());

// Start API
app
  .listen(env.APP_API_PORT, () => {
    Logger.info(
      `🚀 Server ${env.NAME_PROJECT.toUpperCase()} started on port ${
        env.APP_API_PORT
      } in mode ${getEnvironment()} - VERSION: ${getVersion()}`,
    );
  })
  .on('error', error => {
    Logger.error(`
  ********************************************
  🔥 ERROR STARTING SERVER ${error}
  ********************************************
  `);
    process.exit(1);
  });
