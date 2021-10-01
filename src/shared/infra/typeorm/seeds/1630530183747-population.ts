import { autoInjectable, inject } from 'tsyringe';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import Users from '@modules/users/infra/typeorm/entities/Users';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import { HASH_PROVIDER_NAME } from '@shared/container/utils/ProviderNames';
import { UserTypes } from '@shared/infra/commons/constants';

import '@shared/container';

@autoInjectable()
export default class Population1630530183747 implements Seeder {
  constructor(
    @inject(UsersRepository.name)
    private _usersRepository: IUsersRepository,

    @inject(HASH_PROVIDER_NAME)
    private _hashProvider: IHashProvider,
  ) {}
  public async run(_: Factory, __: Connection): Promise<any> {
    const email = 'mail@mail.com.br';
    const checExistEmail = await this._usersRepository.findByEmail(email, 'all');
    if (!checExistEmail) {
      const password = await this._hashProvider.generateHash('@masterBoss!@#$%fusion1');
      await this._usersRepository.store({
        name: 'UMBRIEL ADMINISTRADOR',
        email,
        password,
        role: UserTypes.ADMIN,
      } as Users);
    }
  }
}
