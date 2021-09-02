import IBaseRepository from '@shared/infra/typeorm/base/IBaseRepository';

import Senders from '../infra/typeorm/entities/Senders';

export default interface ISendersRepository extends IBaseRepository<Senders> {
  findByEmail(email: string): Promise<Senders | undefined>;
}
