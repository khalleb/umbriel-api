import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';
import { inject, injectable } from 'tsyringe';
import { UAParser } from 'ua-parser-js';

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import authConfig from '@config/auth';

import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import { i18n } from '@shared/internationalization';
import { AppLogger } from '@shared/logger';
import { cleanObject } from '@shared/utils/objectUtil';

@injectable()
class EnsureAuthenticatedMiddleware {
  constructor(
    @inject('HashProvider')
    private _hashProvider: IHashProvider,

    @inject('UsersRepositories')
    private _usersRepository: IUsersRepository,
  ) {}

  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const authHeader = request?.headers?.authorization;

      if (!authHeader) {
        throw new AppError(i18n('validations.enter_the_authentication_token'), 400);
      }

      const [, token] = authHeader.split(' ');

      if (!token) {
        throw new AppError(i18n('validations.enter_token'), httpStatus.BAD_REQUEST);
      }

      const { sub, email, role } = this._hashProvider.decodeToken(token, authConfig.jwt.secret_token);

      const datasRequest = new UAParser(request?.headers['user-agent']);
      if (datasRequest) {
        const data = datasRequest.getResult();
        if (data) {
          try {
            this._usersRepository.saveLastAccess(sub, { data: cleanObject(data), date: new Date() });
          } catch (error) {
            if (error instanceof Error) {
              AppLogger.error(error);
            } else {
              AppLogger.error(error as Error);
            }
          }
        }
      }
      globalThis.__ID_USER__ = sub;

      request.user = {
        id: sub,
        email,
        token,
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
