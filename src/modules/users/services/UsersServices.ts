import { Request } from 'express';

import { inject, injectable } from 'tsyringe';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import { HASH_PROVIDER_NAME } from '@shared/container/utils/ProviderNames';
import AppError from '@shared/errors/AppError';
import { UserTypes } from '@shared/infra/commons/constants';
import { i18n } from '@shared/infra/http/internationalization';
import IBaseService from '@shared/infra/services/IBaseService';
import { IPagination, IPaginationAwareObject } from '@shared/infra/typeorm/Pagination';
import { emailIsValid, passwordValid } from '@shared/infra/utils/validations';

import { IUsersRequestDTO } from '../dtos/IUsersDTO';
import Users from '../infra/typeorm/entities/Users';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class UsersServices implements IBaseService {
  constructor(
    @inject(UsersRepository.name)
    private _usersRepository: IUsersRepository,

    @inject(HASH_PROVIDER_NAME)
    private _hashProvider: IHashProvider,
  ) {}

  private datasValidate(data: IUsersRequestDTO): IUsersRequestDTO {
    if (!data) {
      throw new AppError(i18n('user.enter_the_data'));
    }

    if (!data.name) {
      throw new AppError(i18n('user.enter_the_name_data'));
    }

    if (!data.email) {
      throw new AppError(i18n('user.enter_the_email_data'));
    }
    data.name = data.name.trim();
    data.email = data.email.trim();
    data.email = data.email.toLowerCase();
    if (data.name.length <= 7) {
      throw new AppError(i18n('user.enter_full_name'));
    }
    if (data.name.length >= 70) {
      throw new AppError(i18n('user.user_name_too_long'));
    }
    if (data.email.length <= 7) {
      throw new AppError(i18n('validations.invalid_email'));
    }
    if (data.email.length >= 50) {
      throw new AppError(i18n('validations.email_too_long'));
    }
    if (!emailIsValid(data.email)) {
      throw new AppError(i18n('validations.invalid_email'));
    }
    return data;
  }

  public async store(req: Request): Promise<Users> {
    const { body, user } = req;
    const data: IUsersRequestDTO = body;
    const userStore = await this.storeRepository(data, user?.id);
    return userStore;
  }

  public async storeRepository(datas: IUsersRequestDTO, idUser: string): Promise<Users> {
    const data = this.datasValidate(datas);

    const checkExistEmail = await this._usersRepository.findByEmail(data.email, 'active');
    if (checkExistEmail) {
      throw new AppError(i18n('user.email_already_existing_in_the_database'));
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

    if (data.role === UserTypes.ADMIN) {
      await this.isUserAdmin(idUser);
    }

    data.password = await this._hashProvider.generateHash(data.password);
    const userStore = await this._usersRepository.store(data as Users);
    return userStore;
  }

  public async update(req: Request): Promise<any> {
    const { body, user } = req;
    const data: IUsersRequestDTO = body;
    const userUpdate = await this.updateRepository(data, user?.id);
    return userUpdate;
  }

  public async updateRepository(datas: IUsersRequestDTO, idUser: string): Promise<Users> {
    const data = this.datasValidate(datas);

    if (!data.id) {
      throw new AppError(i18n('user.enter_your_ID'));
    }
    if (data.role === UserTypes.ADMIN) {
      await this.isUserAdmin(idUser);
    }
    const checkMail = await this._usersRepository.findByEmail(data.email, 'active');
    if (checkMail && checkMail.id !== data.id) {
      throw new AppError(i18n('user.existing_email'));
    }
    const userUpdate = await this._usersRepository.update(data as Users);
    return userUpdate;
  }

  public async show(req: Request): Promise<Users | undefined> {
    const { query } = req;
    const id = query?.id as string;
    const user = await this.showRepository(id);
    return user;
  }

  public async showRepository(id: string): Promise<Users | undefined> {
    if (!id) {
      throw new AppError(i18n('user.enter_your_ID'));
    }
    const user = await this._usersRepository.findById(id);
    return user;
  }

  public async inactivateActivate(req: Request): Promise<string> {
    const { query } = req;
    const id = query?.id as string;
    const user = await this.inactivateActivateRepository(id);
    return user;
  }

  public async inactivateActivateRepository(id: string): Promise<string> {
    if (!id) {
      throw new AppError(i18n('user.enter_your_ID'));
    }
    const user = await this._usersRepository.findById(id);
    if (!user) {
      throw new AppError(i18n('user.user_not_found_in_the_database'));
    }
    const response = await this._usersRepository.inactivateActivate(user);
    if (!response) {
      throw new AppError(i18n('user.the_status_of_the_user_could_not_changed'));
    }
    return `${i18n('user.user')} ${user.active ? i18n('labels.activated') : i18n('labels.inactivated')}`;
  }

  public async isUserAdmin(idUserAuth: string): Promise<void> {
    if (!idUserAuth) {
      throw new AppError(i18n('user.was_not_possible_obtain_logged_user_id'));
    }
    const userAuth = await this._usersRepository.findById(idUserAuth);
    if (!userAuth) {
      throw new AppError(i18n('user.logged_user_not_found_the_database'));
    }
    if (userAuth.role !== UserTypes.ADMIN) {
      throw new AppError(i18n('user.user_without_permission_to_register'));
    }
  }

  public async index(data: IPagination): Promise<IPaginationAwareObject> {
    data.status = 'both';
    const list = await this._usersRepository.index(data);
    return list;
  }

  public async me(id: string): Promise<Users | undefined> {
    if (!id) {
      throw new AppError(i18n('user.was_not_possible_obtain_logged_user_id'), 400);
    }
    const user = await this._usersRepository.findById(id);
    if (!user) {
      throw new AppError(i18n('user.logged_user_not_found_the_database'), 400);
    }
    return user;
  }
}
export default UsersServices;
