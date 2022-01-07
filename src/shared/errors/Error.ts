import { Request, Response, NextFunction } from 'express';

import { CelebrateError, isCelebrateError } from 'celebrate';
import httpStatus from 'http-status';
import { MulterError } from 'multer';

import { env } from '@shared/env';
import { i18n } from '@shared/internationalization';
import { AppLogger } from '@shared/logger';

import AppError from './AppError';

export function errorConverter(err: any, request: Request, response: Response, next: NextFunction): any {
  let error = err;

  if (!error?.statusCode) {
    if (isCelebrateError(error) && error instanceof CelebrateError) {
      const mapErrors = new Map(error.details);
      let errorCelebrate = '';
      mapErrors.forEach(value => {
        errorCelebrate = `${errorCelebrate} ${value.message}`;
      });
      error.message = errorCelebrate ? errorCelebrate.trim() : error.message;
      error = new AppError(error.message, httpStatus.BAD_REQUEST, err.stack);
    } else if (error instanceof MulterError) {
      error.message = i18n('validations.storage_max_size', { max: '10mb' });
      error = new AppError(error.message, httpStatus.BAD_REQUEST, err.stack);
    } else {
      error = new AppError(error.message, httpStatus.INTERNAL_SERVER_ERROR, err.stack);
    }
  }
  next(error);
}
export function errorHandler(error: any, request: Request, res: Response, _: NextFunction): void {
  let statusCode = httpStatus.NOT_FOUND;
  let message = 'Error application';
  if (error?.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }
  res.locals.errorMessage = error.message;

  const response = {
    status: statusCode,
    message,
    ...(env.isDevelopment && { stack_dev: error.stack }),
  };

  if (env.isDevelopment) {
    AppLogger.error({ error });
  }
  res.status(statusCode).json(response);
}
