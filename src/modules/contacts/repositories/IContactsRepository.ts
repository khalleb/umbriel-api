import IBaseRepository from '@shared/infra/typeorm/base/IBaseRepository';

import Contacts from '../infra/typeorm/entities/Contacts';

export default interface IContactsRepository extends IBaseRepository<Contacts> {
  findByEmail(email: string): Promise<Contacts | undefined>;
  findByIdWithTags(id: string): Promise<Contacts | undefined>;
  findByTagsIds(tagIds: string[]): Promise<Contacts[]>;
  inscribeDescribe(contact: Contacts): Promise<boolean>;
}
