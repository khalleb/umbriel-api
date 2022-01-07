import { autoInjectable, inject } from 'tsyringe';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { Users } from '@modules/users/infra/typeorm/entities/Users';
import { IUsersRepository } from '@modules/users/repositories';

import '@shared/container';

import { UserTypes } from '@shared/commons/constants';
import { registerDependencies } from '@shared/container';
import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';

registerDependencies();
@autoInjectable()
export default class Population1630530183747 implements Seeder {
  constructor(
    @inject('UsersRepositories')
    private _usersRepository: IUsersRepository,

    @inject('HashProvider')
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
