interface IBaseRepositoryMongo<T> {
  store(entity: T): Promise<T>;
  stores(entity: T[]): Promise<T[]>;
}
export { IBaseRepositoryMongo };
