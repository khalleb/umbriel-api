import { IContactsRepository } from '@modules/contacts/repositories';

import BaseRepository from '@shared/infra/typeorm/repositories/postgres/BaseRepository';
import { CONTACTS_TABLE_NAME } from '@shared/infra/typeorm/utils/tableNames';

import { Contacts } from '../entities/Contacts';

class ContactsRepository extends BaseRepository<Contacts> implements IContactsRepository {
  public constructor() {
    super(Contacts);
  }

  public async findByEmail(email: string): Promise<Contacts | undefined> {
    const contact = await this.ormRepository.findOne({ where: { email } });
    return contact;
  }

  public async findByIdWithTags(id: string): Promise<Contacts | undefined> {
    const contact = await this.ormRepository.findOne({ where: { id }, relations: ['tags'] });
    return contact;
  }

  public async findByTagsIds(tagIds: string[]): Promise<Contacts[]> {
    const contacts = await this.ormRepository
      .createQueryBuilder(CONTACTS_TABLE_NAME)
      .leftJoinAndSelect('contacts.tags', 'tags')
      .where('contacts.active = true AND tags.id IN (:...ids)', {
        ids: tagIds,
      })
      .getMany();
    return contacts;
  }

  public async inscribeDescribe(contact: Contacts): Promise<boolean> {
    await this.ormRepository.save(contact);
    return true;
  }

  public async checkIfThereIsRegistrationByEmail(email: string): Promise<boolean> {
    const result = await this.ormRepository.findOne({ email });
    return !!result;
  }
}

export { ContactsRepository };
