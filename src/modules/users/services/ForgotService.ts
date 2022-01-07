import path from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';
import { env } from '@shared/env';
import AppError from '@shared/errors/AppError';
import { HttpResponseMessage, messageResponse } from '@shared/infra/http/core/HttpResponse';
import { i18n } from '@shared/internationalization';
import { removeSpecialCharacters } from '@shared/utils/stringUtil';
import { emailIsValid } from '@shared/utils/validations';

import { IUsersRepository } from '../repositories';
import { IForgotPasswordHbs } from '../views/types/IForgotPasswordHbs';

@injectable()
class ForgotService {
  constructor(
    @inject('UsersRepositories')
    private _usersRepository: IUsersRepository,

    @inject('MailProvider')
    private _mailProvider: IMailProvider,

    @inject('CacheProvider')
    private _cacheProvider: ICacheProvider,

    @inject('DateProvider')
    private _dateProvider: IDateProvider,
  ) {}

  async execute(email: string): Promise<HttpResponseMessage> {
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

    await this._mailProvider.sendEmailWithTemplate<IForgotPasswordHbs>({
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
    return messageResponse(i18n('user.password_recovery_send'));
  }
}

export { ForgotService };
