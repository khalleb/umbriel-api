import { ObjectIdColumn } from 'typeorm';

export abstract class EntityBaseMongo {
  @ObjectIdColumn()
  id: string;
}

export default EntityBaseMongo;
