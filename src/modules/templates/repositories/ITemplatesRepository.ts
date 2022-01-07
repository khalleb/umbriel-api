import IBaseRepository from '@shared/infra/typeorm/repositories/postgres/IBaseRepository';

import { Templates } from '../infra/typeorm/entities/Templates';

interface ITemplatesRepository extends IBaseRepository<Templates> {
  findByName(name: string): Promise<Templates | undefined>;
}
export { ITemplatesRepository };
