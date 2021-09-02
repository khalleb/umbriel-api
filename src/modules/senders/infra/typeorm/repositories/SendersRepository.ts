import ISendersRepository from '@modules/senders/repositories/ISendersRepository';

import BaseRepository from '@shared/infra/typeorm/base/BaseRepository';

import Senders from '../entities/Senders';

class SendersRepository extends BaseRepository<Senders> implements ISendersRepository {
  public constructor() {
    super(Senders);
  }
  public async findByEmail(email: string): Promise<Senders | undefined> {
    const sender = await this.ormRepository.findOne({ where: { email } });
    return sender;
  }
}

export default SendersRepository;
