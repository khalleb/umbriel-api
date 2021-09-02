import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import IDataAcessDTO from '@shared/infra/dtos/IDataAcessDTO';

export abstract class EntityBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  active?: boolean;

  @VersionColumn()
  @Exclude()
  version?: number;

  @CreateDateColumn()
  @Exclude()
  created_at?: Date;

  @Column({ default: 'UNDEFINED', nullable: true })
  @Exclude()
  created_by?: string;

  @UpdateDateColumn()
  @Exclude()
  updated_at?: Date;

  @Column({ nullable: true })
  @Exclude()
  updated_by?: string;

  @Column({ type: 'simple-json', nullable: true })
  @Exclude()
  updated_access?: IDataAcessDTO;

  @Column({ nullable: true })
  @Exclude()
  inactivated_at?: Date;

  @Column({ nullable: true })
  @Exclude()
  inactivated_by?: string;

  @Column({ type: 'simple-json', nullable: true })
  @Exclude()
  inactivated_access?: IDataAcessDTO;

  @BeforeInsert()
  beforeInsertEntityBase(): void {
    this.registrerSave();
  }

  @BeforeUpdate()
  beforeUpdateEntityBase(): void {
    this.registrerUpdate();
  }

  registrerSave(): void {
    this.created_by = global?.__ID_USER__ || 'UNDEFINED';
  }

  registrerUpdate(): void {
    this.updated_by = global?.__ID_USER__ || 'UNDEFINED';
  }
}

export default EntityBase;
