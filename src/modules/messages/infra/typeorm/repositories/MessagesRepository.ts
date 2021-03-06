import { IMessagesRepository } from '@modules/messages/repositories/IMessagesRepository';

import BaseRepository from '@shared/infra/typeorm/repositories/postgres/BaseRepository';

import { Messages } from '../entities/Messages';

class MessagesRepository extends BaseRepository<Messages> implements IMessagesRepository {
  public constructor() {
    super(Messages);
  }

  public async findByIdWithTags(id: string): Promise<Messages | undefined> {
    const contact = await this.ormRepository.findOne({ where: { id }, relations: ['tags', 'sender'] });
    return contact;
  }
}

export { MessagesRepository };
