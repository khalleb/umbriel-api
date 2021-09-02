import IBaseRepository from '@shared/infra/typeorm/base/IBaseRepository';

import Tags from '../infra/typeorm/entities/Tags';

export default interface ITagsRepository extends IBaseRepository<Tags> {
  findByNameLike(name: string): Promise<Tags[]>;
  findByName(name: string): Promise<Tags | undefined>;
}
