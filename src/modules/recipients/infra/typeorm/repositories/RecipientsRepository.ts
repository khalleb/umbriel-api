import IRecipientsRepository from '@modules/recipients/repositories/IRecipientsRepository';

import BaseRepository from '@shared/infra/typeorm/base/BaseRepository';

import Recipients from '../entities/Recipients';

class RecipientsRepository extends BaseRepository<Recipients> implements IRecipientsRepository {
  public constructor() {
    super(Recipients);
  }

  public async findByMessageContact(message_id: string, contact_id: string): Promise<Recipients | undefined> {
    const recipient = await this.ormRepository.findOne({ message_id, contact_id });
    return recipient;
  }
}

export default RecipientsRepository;
