import IBaseRepository from '@shared/infra/typeorm/repositories/postgres/IBaseRepository';

import { Messages } from '../infra/typeorm/entities/Messages';

interface IMessagesRepository extends IBaseRepository<Messages> {
  findByIdWithTags(id: string): Promise<Messages | undefined>;
}
export { IMessagesRepository };
