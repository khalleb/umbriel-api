import 'express-async-errors';

import express, { Request, Response, NextFunction, Express } from 'express';

import { json } from 'body-parser';
import { errors } from 'celebrate';
import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import path from 'path';

import { registerDependencies } from '@shared/container';
import { env } from '@shared/env';
import AppError from '@shared/errors/AppError';
import { errorConverter, errorHandler } from '@shared/errors/Error';
import { createDbConnection } from '@shared/infra/typeorm';
import { i18n } from '@shared/internationalization';
import { AppLogger } from '@shared/logger';
import { nameProject } from '@shared/utils/stringUtil';

import { getEnvironment, getVersion } from '../devops/version';
import { router } from './routes';

class Server {
  public app: Express;

  constructor() {
    registerDependencies();
    this.app = express();
    // JSON space
    this.app.set('json spaces', 2);
    this.app.disable('x-powered-by');
    // Inactive error 304
    this.app.disable('etag');
    // set security HTTP headers
    this.app.use(helmet());

    this.middlewares();

    // parse json request body
    this.app.use(express.json());
    this.app.use(json());

    // parse urlencoded request body
    this.app.use(express.urlencoded({ extended: true }));

    // gzip compression
    this.app.use(compression());

    // Return page HTML
    this.app.set('views', path.join(__dirname, './views'));
    this.app.set('view engine', 'ejs');

    this.routes();
    this.errorHandlers();
  }

  private middlewares() {
    // enable cors
    if (!env.isDevelopment) {
      this.app.use((request: Request, response: Response, next: NextFunction) => {
        request.headers.origin = request.headers.origin || request.headers.host;
        next();
      });

      const whitelist = env.CORS_HOSTS.split(';');

      const corsOptions: CorsOptions = {
        origin(origin, callback) {
          if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            AppLogger.warn({ message: `${i18n('validations.no_permission_for_origin')}: ${origin}` });
            throw new AppError(`${i18n('validations.no_permission_for_origin')}: ${origin}`);
          }
        },
        credentials: true,
      };
      this.app.use(cors(corsOptions));
    } else {
      this.app.use(cors({ origin: '*' }));
    }

    // return page response
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      if (request.url === '/') {
        response.render('welcome', {
          nameProject: `${nameProject()}`,
        });
      }
      next();
    });
  }

  private routes() {
    this.app.use(router);
  }

  private errorHandlers() {
    // convert error to ApiError, if needed
    this.app.use(errorConverter);

    // handle error
    this.app.use(errorHandler);

    // get celebrate errors
    this.app.use(errors());
  }

  public async start() {
    await createDbConnection();

    this.app
      .listen(env.APP_API_PORT, () => {
        AppLogger.warn({
          message: `🚀 Server ${nameProject().toUpperCase()} started on port ${
            env.APP_API_PORT
          } in mode ${getEnvironment()} - VERSION: ${getVersion()}`,
        });
      })
      .on('error', error => {
        AppLogger.error({
          message: `
        ********************************************
        🔥 ERROR STARTING SERVER ${error}
        ********************************************
        `,
        });
        process.exit(1);
      });
  }
}
export const server = new Server();
