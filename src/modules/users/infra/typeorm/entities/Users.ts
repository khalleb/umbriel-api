import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

import { UserTypes } from '@shared/commons/constants';
import IDataAcessDTO from '@shared/infra/models/IDataAcessDTO';
import { KeyValueBase } from '@shared/infra/typeorm/entities/postgres/KeyValueBase';
import { USERS_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

@Entity(USERS_TABLE_NAME)
class Users extends KeyValueBase {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserTypes,
    default: UserTypes.CLIENT,
  })
  role: UserTypes;

  @Column({ type: 'simple-json', nullable: true })
  @Exclude()
  lastAccess: IDataAcessDTO;
}

export { Users };
