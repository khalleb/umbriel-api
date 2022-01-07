import { Entity } from 'typeorm';

import { KeyValueBase } from '@shared/infra/typeorm/entities/postgres/KeyValueBase';
import { TAGS_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

@Entity(TAGS_TABLE_NAME)
class Tags extends KeyValueBase {}
export { Tags };
