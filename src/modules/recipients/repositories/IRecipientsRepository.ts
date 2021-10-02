import IBaseRepository from '@shared/infra/typeorm/base/IBaseRepository';

import Recipients from '../infra/typeorm/entities/Recipients';

export default interface IRecipientsRepository extends IBaseRepository<Recipients> {
  findByMessageContact(message_id: string, contact_id: string): Promise<Recipients | undefined>;
}
