import IBaseRepository from '@shared/infra/typeorm/base/IBaseRepository';

import Templates from '../infra/typeorm/entities/Templates';

export default interface ITemplatesRepository extends IBaseRepository<Templates> {
  findByName(name: string): Promise<Templates | undefined>;
}
