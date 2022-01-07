import IBaseRepository from '@shared/infra/typeorm/repositories/postgres/IBaseRepository';

import { Tags } from '../infra/typeorm/entities/Tags';

interface ITagsRepository extends IBaseRepository<Tags> {
  findByNameLike(name: string): Promise<Tags[]>;
  findByName(name: string): Promise<Tags | undefined>;
}

export { ITagsRepository };
