import { getMongoRepository, MongoRepository, EntityTarget } from 'typeorm';

import { IBaseRepositoryMongo } from './IBaseRepositoryMongo';

class BaseRepositoryMongo<T> implements IBaseRepositoryMongo<T> {
  protected readonly ormRepositoryMongo: MongoRepository<T>;

  public constructor(repo: EntityTarget<T>) {
    this.ormRepositoryMongo = getMongoRepository(repo, 'mongo');
  }

  public async store(entity: T): Promise<T> {
    const entityStore = this.ormRepositoryMongo.create(entity);
    entity = await this.ormRepositoryMongo.save(entityStore);
    return entity;
  }

  public async stores(entity: T[]): Promise<T[]> {
    const entityStore = this.ormRepositoryMongo.create(entity);
    entity = await this.ormRepositoryMongo.save(entityStore);
    return entity;
  }
}

export { BaseRepositoryMongo };
