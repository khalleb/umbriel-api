import IBaseRepository from '@shared/infra/typeorm/base/IBaseRepository';

import Messages from '../infra/typeorm/entities/Messages';

export default interface IMessagesRepository extends IBaseRepository<Messages> {
  findByIdWithTags(id: string): Promise<Messages | undefined>;
}
