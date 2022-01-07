import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

import authConfig from '@config/auth';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import { i18n } from '@shared/internationalization';
import { emailIsValid } from '@shared/utils/validations';

import { IRequestAuth, IResponseAuth, ITokenBodyCache } from '../dtos/IUsersDTO';
import { IUsersRepository } from '../repositories';

@injectable()
class AuthenticateService {
  constructor(
    @inject('UsersRepositories')
    private _usersRepository: IUsersRepository,

    @inject('HashProvider')
    private _hashProvider: IHashProvider,

    @inject('DateProvider')
    private _dateProvider: IDateProvider,

    @inject('CacheProvider')
    private _cacheProvider: ICacheProvider,
  ) {}

  async execute({ email, password }: IRequestAuth): Promise<IResponseAuth> {
    if (!email) {
      throw new AppError(i18n('user.enter_the_email'));
    }
    if (!password) {
      throw new AppError(i18n('user.enter_the_password'));
    }

    if (!emailIsValid(email)) {
      throw new AppError(i18n('validations.invalid_email'));
    }

    const user = await this._usersRepository.findByEmail(email, 'active');

    if (!user) {
      throw new AppError(i18n('user.user_not_found'));
    }
    const passwordValid = await this._hashProvider.compareHash(password, user.password);
    if (!passwordValid) {
      throw new AppError(i18n('user.incorrect_email_password'));
    }
    const token = this._hashProvider.encodeToken(
      user.id,
      user.email,
      user.role,
      authConfig.jwt.secret_token,
      authConfig.jwt.expires_in_token,
    );

    const refresh_token = uuid();

    const refresh_token_expires_date = this._dateProvider.addDays(Number(authConfig.jwt.expires_refresh_token_days));

    const bodyCacheToke: ITokenBodyCache = {
      user_id: user.id,
      email: user.email,
      role: user.role,
      refresh_token,
      expires_date: refresh_token_expires_date,
    };

    await this._cacheProvider.save(refresh_token, bodyCacheToke, refresh_token_expires_date.getTime());

    return {
      token,
      refresh_token,
      user: {
        id: user.id,
        active: user.active as boolean,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

export { AuthenticateService };
