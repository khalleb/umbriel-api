import { ILike } from 'typeorm';

import { ITagsRepository } from '@modules/tags/repositories';

import BaseRepository from '@shared/infra/typeorm/repositories/postgres/BaseRepository';

import { Tags } from '../entities/Tags';

class TagsRepository extends BaseRepository<Tags> implements ITagsRepository {
  public constructor() {
    super(Tags);
  }

  public async findByNameLike(name: string): Promise<Tags[]> {
    const tags = await this.ormRepository.find({ name: ILike(`%${name}%`) });
    return tags;
  }

  public async findByName(name: string): Promise<Tags | undefined> {
    const tag = await this.ormRepository.findOne({ name });
    return tag;
  }
}

export { TagsRepository };
