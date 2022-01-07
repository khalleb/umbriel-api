import { ITemplatesRepository } from '@modules/templates/repositories/ITemplatesRepository';

import BaseRepository from '@shared/infra/typeorm/repositories/postgres/BaseRepository';

import { Templates } from '../entities/Templates';

class TemplatesRepository extends BaseRepository<Templates> implements ITemplatesRepository {
  public constructor() {
    super(Templates);
  }

  public async findByName(name: string): Promise<Templates | undefined> {
    const template = await this.ormRepository.findOne({ name });
    return template;
  }
}

export { TemplatesRepository };
