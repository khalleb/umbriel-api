import IBaseRepository from '@shared/infra/typeorm/repositories/postgres/IBaseRepository';

import { Contacts } from '../infra/typeorm/entities/Contacts';

interface IContactsRepository extends IBaseRepository<Contacts> {
  findByEmail(email: string): Promise<Contacts | undefined>;
  findByIdWithTags(id: string): Promise<Contacts | undefined>;
  findByTagsIds(tagIds: string[]): Promise<Contacts[]>;
  inscribeDescribe(contact: Contacts): Promise<boolean>;
  checkIfThereIsRegistrationByEmail(email: string): Promise<boolean>;
  checkExistEmail(email: string): Promise<string | undefined>;
}

export { IContactsRepository };
