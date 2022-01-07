import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import IDataAcessDTO from '@shared/infra/models/IDataAcessDTO';
import { StatusType } from '@shared/infra/models/IInfraDTO';
import BaseRepository from '@shared/infra/typeorm/repositories/postgres/BaseRepository';

import { Users } from '../entities/Users';

class UsersRepository extends BaseRepository<Users> implements IUsersRepository {
  public constructor() {
    super(Users);
  }

  public async findByEmail(email: string, status: StatusType): Promise<Users | undefined> {
    let user;
    if (status === 'active') {
      user = await this.ormRepository.findOne({ where: { email, active: true } });
    } else if (status === 'inactive') {
      user = await this.ormRepository.findOne({ where: { email, active: false } });
    } else {
      user = await this.ormRepository.findOne({ where: { email } });
    }
    return user;
  }

  public async saveLastAccess(id: string, lastAccess: IDataAcessDTO): Promise<void> {
    await this.ormRepository.save({ id, lastAccess });
  }
}

export { UsersRepository };
