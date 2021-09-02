import { Column, Entity } from 'typeorm';

import EntityBase from '@shared/infra/typeorm/base/EntityBase';
import { TAGS_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

@Entity(TAGS_TABLE_NAME)
class Tags extends EntityBase {
  @Column()
  name: string;
}
export default Tags;
