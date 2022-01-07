import IBaseRepository from '@shared/infra/typeorm/repositories/postgres/IBaseRepository';

import { Senders } from '../infra/typeorm/entities/Senders';

interface ISendersRepository extends IBaseRepository<Senders> {
  findByEmail(email: string): Promise<Senders | undefined>;
}

export { ISendersRepository };
