import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import { StatusType } from '@shared/infra/dtos/IInfraDTO';
import BaseRepository from '@shared/infra/typeorm/base/BaseRepository';

import Users from '../entities/Users';

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
}

export default UsersRepository;
