import { Column, Entity } from 'typeorm';

import EntityBase from '@shared/infra/typeorm/base/EntityBase';
import { SENDERS_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

@Entity(SENDERS_TABLE_NAME)
class Senders extends EntityBase {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
export default Senders;
