import { DeleteResult, EntityTarget, getRepository, Repository } from 'typeorm';

import EntityBase from '@shared/infra/typeorm/base/EntityBase';
import IBaseRepository from '@shared/infra/typeorm/base/IBaseRepository';

import { IPagination, IPaginationAwareObject, paginate } from '../Pagination';

export default class BaseRepository<T> implements IBaseRepository<T> {
  protected readonly ormRepository: Repository<T>;

  public constructor(repo: EntityTarget<T>) {
    this.ormRepository = getRepository(repo);
  }

  public async store(entity: T): Promise<T> {
    const entityStore = this.ormRepository.create(entity);
    entity = await this.ormRepository.save(entityStore);
    return entity;
  }

  public async stores(entity: T[]): Promise<T[]> {
    const entityStore = this.ormRepository.create(entity);
    entity = await this.ormRepository.save(entityStore);
    return entity;
  }

  public async update(entity: T): Promise<T> {
    const entityUpdate = await this.ormRepository.save(entity);
    return entityUpdate;
  }

  public async delete(id: string): Promise<DeleteResult> {
    const result = await this.ormRepository.delete(id);
    return result;
  }

  public async findById(id: string): Promise<T | undefined> {
    const result = await this.ormRepository.findOne(id);
    return result;
  }

  public async findByIds(ids: string[]): Promise<T[]> {
    const result = await this.ormRepository.findByIds(ids);
    return result;
  }

  public async inactivateActivate(entity: T): Promise<boolean> {
    if (entity instanceof EntityBase) {
      entity.active = !entity.active;
      await this.ormRepository.save(entity);
      return true;
    }
    return false;
  }

  public async index(data: IPagination): Promise<IPaginationAwareObject> {
    const nameTable = this?.ormRepository?.metadata?.tableName;
    const queryBuilder = this.ormRepository.createQueryBuilder(nameTable);
    const pagination = await paginate({
      builder: queryBuilder,
      page: data?.page || 1,
      limit: data?.limit || 10,
      status: data?.status || 'active',
      orderBySort: data?.orderBySort,
      order: data?.order,
      select: this.buildAttributes(data.select, nameTable),
    });
    return pagination;
  }

  private buildAttributes(attributes: string[] | undefined, nameTable: string | undefined): string[] {
    if (!attributes || attributes.length <= 0 || !nameTable) {
      return [];
    }
    return attributes.map(e => `${nameTable}.${e}`);
  }
}
