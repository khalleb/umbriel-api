import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

import authConfig from '@config/auth';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import { CACHE_PROVIDER_NAME, DATE_PROVIDER_NAME, HASH_PROVIDER_NAME } from '@shared/container/utils/ProviderNames';
import AppError from '@shared/errors/AppError';
import { i18n } from '@shared/infra/http/internationalization';

import { IResponseRefreshToken, ITokenBodyCache } from '../dtos/IUsersDTO';

@injectable()
class RefreshTokenService {
  constructor(
    @inject(CACHE_PROVIDER_NAME)
    private _cacheProvider: ICacheProvider,

    @inject(DATE_PROVIDER_NAME)
    private _dateProvider: IDateProvider,

    @inject(HASH_PROVIDER_NAME)
    private _hashProvider: IHashProvider,
  ) {}

  async execute(token: string): Promise<IResponseRefreshToken> {
    if (!token) {
      throw new AppError(i18n('validations.enter_token'));
    }
    const userToken = await this._cacheProvider.recover(token);
    if (!userToken) {
      throw new AppError(i18n('validations.refresh_token_does_not_exists'));
    }

    const { user_id, email, role } = userToken as ITokenBodyCache;

    await this._cacheProvider.invalidate(token);

    const expires_date = this._dateProvider.addDays(Number(authConfig.jwt.expires_refresh_token_days));

    const refresh_token = uuid();

    const newToken = this._hashProvider.encodeToken(
      user_id,
      email,
      role,
      authConfig.jwt.secret_token,
      authConfig.jwt.expires_in_token,
    );

    const bodyCacheToke: ITokenBodyCache = {
      user_id,
      email,
      role,
      refresh_token,
      expires_date,
    };

    await this._cacheProvider.save(refresh_token, bodyCacheToke, expires_date.getTime());

    return {
      refresh_token,
      token: newToken,
    };
  }
}
export default RefreshTokenService;
