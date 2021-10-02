import { Column, Entity, JoinColumn, JoinTable, OneToMany, ManyToMany, ManyToOne } from 'typeorm';

import Recipients from '@modules/recipients/infra/typeorm/entities/Recipients';
import Senders from '@modules/senders/infra/typeorm/entities/Senders';
import Tags from '@modules/tags/infra/typeorm/entities/Tags';
import Templates from '@modules/templates/infra/typeorm/entities/Templates';

import EntityBase from '@shared/infra/typeorm/base/EntityBase';
import { MESSAGES_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

@Entity(MESSAGES_TABLE_NAME)
class Messages extends EntityBase {
  @Column({ nullable: true })
  template_id?: string;

  @ManyToOne(() => Templates, { nullable: true })
  @JoinColumn({ name: 'template_id' })
  template?: Templates;

  @Column()
  sender_id: string;

  @ManyToOne(() => Senders)
  @JoinColumn({ name: 'sender_id' })
  sender: Senders;

  @ManyToMany(() => Tags, { nullable: true, cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'messages_tags',
    joinColumn: { name: 'messages_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tags_id', referencedColumnName: 'id' },
  })
  tags?: Tags[];

  @OneToMany(() => Recipients, recipient => recipient.message)
  recipients: Recipients[];

  @Column()
  subject: string;

  @Column({ nullable: true })
  body: string;

  @Column({ nullable: true })
  sent_at?: Date;
}
export default Messages;
