import { Request, Response, NextFunction } from 'express';

import { CelebrateError, isCelebrateError } from 'celebrate';
import httpStatus from 'http-status';
import { MulterError } from 'multer';

import { env } from '@shared/env';

import AppError from './AppError';
import Logger from './Logger';

export function errorConverter(err: Error, request: Request, response: Response, next: NextFunction): any {
  let error = err;

  if (!(error instanceof AppError)) {
    if (isCelebrateError(error) && error instanceof CelebrateError) {
      const mapErrors = new Map(error.details);
      let errorCelebrate = '';
      mapErrors.forEach(value => {
        errorCelebrate = `${errorCelebrate} ${value.message}`;
      });
      error.message = errorCelebrate ? errorCelebrate.trim() : error.message;
      error = new AppError(error.message, httpStatus.BAD_REQUEST, err.stack);
    } else if (error instanceof MulterError) {
      error.message = `O arquivo pode ter no máximo ${env.STORAGE_MAX_SIZE_MEGABYTES} MegaBytes`;
      error = new AppError(error.message, httpStatus.BAD_REQUEST, err.stack);
    } else {
      error = new AppError(error.message, httpStatus.INTERNAL_SERVER_ERROR, err.stack);
    }
  }
  next(error);
}
export function errorHandler(error: Error, request: Request, res: Response, _: NextFunction): void {
  let statusCode = httpStatus.NOT_FOUND;
  let message = 'Error application';
  if (error instanceof AppError) {
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
    Logger.error(error);
  }
  res.status(statusCode).json(response);
}
