import { StatusType } from '@shared/infra/dtos/IInfraDTO';
import IBaseRepository from '@shared/infra/typeorm/base/IBaseRepository';

import Users from '../infra/typeorm/entities/Users';

export default interface IUsersRepository extends IBaseRepository<Users> {
  findByEmail(email: string, status: StatusType): Promise<Users | undefined>;
}
