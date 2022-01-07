import { Column, Entity } from 'typeorm';

import { KeyValueBase } from '@shared/infra/typeorm/entities/postgres/KeyValueBase';
import { SENDERS_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

@Entity(SENDERS_TABLE_NAME)
class Senders extends KeyValueBase {
  @Column({ unique: true })
  email: string;
}
export { Senders };
