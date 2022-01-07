import { Column } from 'typeorm';

import { EntityBase } from './EntityBase';

abstract class KeyValueBase extends EntityBase {
  @Column()
  name: string;
}
export { KeyValueBase };
