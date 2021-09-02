import { Column, Entity } from 'typeorm';

import EntityBase from '@shared/infra/typeorm/base/EntityBase';
import { TEMPLATES_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

@Entity(TEMPLATES_TABLE_NAME)
class Templates extends EntityBase {
  @Column()
  name: string;

  @Column()
  content: string;
}
export default Templates;
