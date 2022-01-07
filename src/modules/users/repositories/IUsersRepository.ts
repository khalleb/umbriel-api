import IDataAcessDTO from '@shared/infra/models/IDataAcessDTO';
import { StatusType } from '@shared/infra/models/IInfraDTO';
import IBaseRepository from '@shared/infra/typeorm/repositories/postgres/IBaseRepository';

import { Users } from '../infra/typeorm/entities/Users';

interface IUsersRepository extends IBaseRepository<Users> {
  findByEmail(email: string, status: StatusType): Promise<Users | undefined>;
  saveLastAccess(id: string, lastAccess: IDataAcessDTO): Promise<void>;
}
export { IUsersRepository };
