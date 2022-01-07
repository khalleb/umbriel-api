import { inject, injectable } from 'tsyringe';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import { i18n } from '@shared/internationalization';
import { passwordValid } from '@shared/utils/validations';

import { IRequestForgotPassword, IRequestUpdatePassword } from '../dtos/IUsersDTO';
import { IUsersRepository } from '../repositories';

@injectable()
class ChangePasswordService {
  constructor(
    @inject('UsersRepositories')
    private _usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private _cacheProvider: ICacheProvider,

    @inject('HashProvider')
    private _hashProvider: IHashProvider,
  ) {}

  async execute(data: IRequestForgotPassword): Promise<string> {
    if (!data) {
      throw new AppError(i18n('user.enter_data_password_recovery'));
    }
    if (!data.token) {
      throw new AppError(i18n('user.enter_data_password_recovery_token'));
    }
    if (!data.password) {
      throw new AppError(i18n('user.enter_the_password'));
    }
    if (!data.password_confirmation) {
      throw new AppError(i18n('user.enter_the_password_confirmation'));
    }
    const passwordValidate = passwordValid(data.password);
    if (passwordValidate) {
      throw new AppError(passwordValidate);
    }
    if (data.password !== data.password_confirmation) {
      throw new AppError(i18n('user.passwords_do_not_match'));
    }

    const idUser = await this._cacheProvider.recover<string>(data.token);
    if (!idUser) {
      throw new AppError(i18n('user.enter_data_password_recovery_token_not_found'));
    }
    const user = await this._usersRepository.findById(idUser);
    if (!user) {
      throw new AppError(i18n('user.enter_data_password_recovery_token_not_found'));
    }
    user.password = await this._hashProvider.generateHash(data.password);
    await this._usersRepository.update(user);
    await this._cacheProvider.invalidate(data.token);
    return i18n('user.password_changed_successfully');
  }

  async updatePassword(data: IRequestUpdatePassword, user_id: string): Promise<string> {
    if (!data) {
      throw new AppError(i18n('user.enter_data_password_update'));
    }
    if (!user_id) {
      throw new AppError(i18n('user.enter_your_ID'));
    }
    if (!data.password) {
      throw new AppError(i18n('user.enter_the_password'));
    }
    if (!data.password_confirmation) {
      throw new AppError(i18n('user.enter_the_password_confirmation'));
    }
    const passwordValidate = passwordValid(data.password);
    if (passwordValidate) {
      throw new AppError(passwordValidate);
    }
    if (data.password !== data.password_confirmation) {
      throw new AppError(i18n('user.passwords_do_not_match'));
    }

    const user = await this._usersRepository.findById(user_id);
    if (!user) {
      throw new AppError(i18n('user.not_found_in_the_database'));
    }
    user.password = await this._hashProvider.generateHash(data.password);
    await this._usersRepository.update(user);
    return i18n('user.password_changed_successfully');
  }
}

export { ChangePasswordService };
