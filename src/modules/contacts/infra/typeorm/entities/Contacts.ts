import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import Tags from '@modules/tags/infra/typeorm/entities/Tags';

import EntityBase from '@shared/infra/typeorm/base/EntityBase';
import { CONTACTS_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

@Entity(CONTACTS_TABLE_NAME)
class Contacts extends EntityBase {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  subscribed: boolean;

  @ManyToMany(() => Tags, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinTable({
    name: 'contacts_tags',
    joinColumn: { name: 'contact_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags?: Tags[];
}
export default Contacts;
