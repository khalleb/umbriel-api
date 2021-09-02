import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

import { UserTypes } from '@shared/infra/commons/constants';
import IDataAcessDTO from '@shared/infra/dtos/IDataAcessDTO';
import EntityBase from '@shared/infra/typeorm/base/EntityBase';
import { USERS_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

@Entity(USERS_TABLE_NAME)
class Users extends EntityBase {
  @Column()
  name: string;

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

export default Users;
