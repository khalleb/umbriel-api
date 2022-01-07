import { Column, Entity } from 'typeorm';

import { KeyValueBase } from '@shared/infra/typeorm/entities/postgres/KeyValueBase';
import { TEMPLATES_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

@Entity(TEMPLATES_TABLE_NAME)
class Templates extends KeyValueBase {
  @Column()
  content: string;
}
export { Templates };
