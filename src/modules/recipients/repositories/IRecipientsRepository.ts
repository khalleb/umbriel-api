import IBaseRepository from '@shared/infra/typeorm/repositories/postgres/IBaseRepository';

import { Recipients } from '../infra/typeorm/entities/Recipients';

interface IRecipientsRepository extends IBaseRepository<Recipients> {
  findByMessageContact(message_id: string, contact_id: string): Promise<Recipients | undefined>;
}
export { IRecipientsRepository };
