import IRecipientsRepository from '@modules/recipients/repositories/IRecipientsRepository';

import BaseRepository from '@shared/infra/typeorm/base/BaseRepository';

import Recipients from '../entities/Recipients';

class RecipientsRepository extends BaseRepository<Recipients> implements IRecipientsRepository {
  public constructor() {
    super(Recipients);
  }
}

export default RecipientsRepository;
