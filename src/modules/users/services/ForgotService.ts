import path from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { CACHE_PROVIDER_NAME, DATE_PROVIDER_NAME, MAIL_PROVIDER_NAME } from '@shared/container/utils/ProviderNames';
import { env } from '@shared/env';
import AppError from '@shared/errors/AppError';
import { i18n } from '@shared/infra/http/internationalization';
import { removeSpecialCharacters } from '@shared/infra/utils/stringUtil';
import { emailIsValid } from '@shared/infra/utils/validations';

import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import { IForgotPasswordHbs } from '../views/types/IForgotPasswordHbs';

@injectable()
class ForgotService {
  constructor(
    @inject(UsersRepository.name)
    private _usersRepository: IUsersRepository,

    @inject(MAIL_PROVIDER_NAME)
    private _mailProvider: IMailProvider,

    @inject(CACHE_PROVIDER_NAME)
    private _cacheProvider: ICacheProvider,

    @inject(DATE_PROVIDER_NAME)
    private _dateProvider: IDateProvider,
  ) {}

  async execute(email: string): Promise<string> {
    if (!email) {
      throw new AppError(i18n('user.enter_the_email'));
    }

    if (!emailIsValid(email)) {
      throw new AppError(i18n('validations.invalid_email'));
    }

    const user = await this._usersRepository.findByEmail(email, 'active');
    if (!user) {
      throw new AppError(i18n('user.user_not_found'));
    }

    const templatepath = path.resolve(__dirname, '..', 'views', 'emails', 'forgotPassword.hbs');
    const expires_date = this._dateProvider.addDays(2).getTime();
    let token = uuid();
    token = removeSpecialCharacters(token) + expires_date;
    await this._cacheProvider.save(token, user.id, expires_date);

    await this._mailProvider.sendEmail<IForgotPasswordHbs>({
      to: {
        name: user.name,
        email,
      },
      subject: `${env.NAME_PROJECT} | ${i18n('user.password_recovery')}`,
      path: templatepath,
      variables: {
        expiresIn: `48h`,
        link: `${env.APP_WEB_URL}/user/alterar-senha?token=${token}`,
        nameProject: `${env.NAME_PROJECT}`,
      },
    });
    return i18n('user.password_recovery_send');
  }
}

export default ForgotService;
