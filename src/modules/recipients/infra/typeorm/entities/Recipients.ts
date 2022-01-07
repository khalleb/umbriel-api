import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany } from 'typeorm';

import { Contacts } from '@modules/contacts/infra/typeorm/entities/Contacts';
import { Events } from '@modules/events/infra/typeorm/entities/Events';
import { Messages } from '@modules/messages/infra/typeorm/entities/Messages';

import { EntityBase } from '@shared/infra/typeorm/entities/postgres/EntityBase';
import { RECIPIENTS_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

@Entity(RECIPIENTS_TABLE_NAME)
class Recipients extends EntityBase {
  @Column()
  message_id: string;

  @ManyToOne(() => Messages)
  @JoinColumn({ name: 'message_id' })
  message: Messages;

  @Column()
  contact_id: string;

  @ManyToOne(() => Contacts)
  @JoinColumn({ name: 'contact_id' })
  contact: Contacts;

  @OneToMany(() => Events, event => event.recipient)
  @JoinTable({
    name: 'recipients_events',
    joinColumn: { name: 'recipient_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' },
  })
  events: Events[];
}
export { Recipients };
