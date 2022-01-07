import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Recipients } from '@modules/recipients/infra/typeorm/entities/Recipients';

import { EntityBase } from '@shared/infra/typeorm/entities/postgres/EntityBase';
import { EVENTS_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

@Entity(EVENTS_TABLE_NAME)
class Events extends EntityBase {
  @Column()
  type: string;

  @Column({ type: 'simple-json', nullable: true })
  meta?: string;

  @Column()
  recipient_id: string;

  @ManyToOne(() => Recipients)
  @JoinColumn({ name: 'recipient_id' })
  recipient: Recipients;
}
export { Events };
