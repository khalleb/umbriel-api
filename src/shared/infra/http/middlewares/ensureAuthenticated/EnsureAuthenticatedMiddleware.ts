import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';
import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import { HASH_PROVIDER_NAME } from '@shared/container/utils/ProviderNames';
import AppError from '@shared/errors/AppError';

import { i18n } from '../../internationalization';

@injectable()
class EnsureAuthenticatedMiddleware {
  constructor(
    @inject(HASH_PROVIDER_NAME)
    private _hashProvider: IHashProvider,
  ) {}

  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const authHeader = request?.headers?.authorization;

      if (!authHeader) {
        throw new AppError(i18n('validations.enter_the_authentication_token'), 400);
      }

      const [, token] = authHeader?.split(' ');

      if (!token) {
        throw new AppError(i18n('validations.enter_token'), 400);
      }

      const { sub, email, role } = this._hashProvider.decodeToken(token, authConfig.jwt.secret_token);

      request.user = {
        id: sub,
        email,
        role,
      };

      return next();
    } catch (error) {
      if (error instanceof Error) {
        if (error?.message === 'jwt expired' || error.name === 'TokenExpiredError') {
          throw new AppError('token.expired', httpStatus.UNAUTHORIZED);
        }
        if (error instanceof AppError) {
          throw new AppError(error.message, error.statusCode);
        }
        throw new AppError(error.message, httpStatus.BAD_REQUEST);
      }
      throw new AppError('authenticated');
    }
  }
}

export { EnsureAuthenticatedMiddleware };
