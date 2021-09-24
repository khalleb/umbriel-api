import { Request } from 'express';

import { inject, injectable } from 'tsyringe';

import TagsRepository from '@modules/tags/infra/typeorm/repositories/TagsRepository';
import ITagsRepository from '@modules/tags/repositories/ITagsRepository';

import AppError from '@shared/errors/AppError';
import { i18n } from '@shared/infra/http/internationalization';
import IBaseService from '@shared/infra/services/IBaseService';
import { IPagination, IPaginationAwareObject } from '@shared/infra/typeorm/Pagination';
import { emailIsValid } from '@shared/infra/utils/validations';

import { IContactsRequestDTO } from '../dtos/IContactsDTO';
import Contacts from '../infra/typeorm/entities/Contacts';
import ContactsRepository from '../infra/typeorm/repositories/ContactsRepository';
import IContactsRepository from '../repositories/IContactsRepository';

@injectable()
class ContactsServices implements IBaseService {
  constructor(
    @inject(ContactsRepository.name)
    private _contactsRepository: IContactsRepository,

    @inject(TagsRepository.name)
    private _tagsRepository: ITagsRepository,
  ) {}

  private datasValidate(data: IContactsRequestDTO): IContactsRequestDTO {
    if (!data) {
      throw new AppError(i18n('contact.enter_the_data'));
    }
    if (!data.name) {
      throw new AppError(i18n('contact.enter_the_name_data'));
    }
    if (!data.email) {
      throw new AppError(i18n('contact.enter_the_email_data'));
    }
    data.name = data.name.trim();
    data.email = data.email.trim();
    data.email = data.email.toLocaleLowerCase();

    if (data.name.length < 3) {
      throw new AppError(i18n('contact.the_name_cannot_be_less_than_characters'));
    }
    if (data.name.length > 100) {
      throw new AppError(i18n('contact.the_name_cannot_be_longe_than_characters'));
    }

    if (data.email.length < 7) {
      throw new AppError(i18n('validations.the_email_cannot_be_less_than_characters'));
    }
    if (data.email.length > 100) {
      throw new AppError(i18n('validations.the_email_cannot_be_longe_than_characters'));
    }

    if (!emailIsValid(data.email)) {
      throw new AppError(i18n('validations.invalid_email'));
    }

    if (data.tags && data?.tags?.length > 0) {
      data.tags.forEach(async (e: string) => {
        const checkTags = await this._tagsRepository.findById(e);
        if (!checkTags) {
          throw new AppError(`${i18n('tag.logged_tag_not_found_the_database')}: ${e}`);
        }
      });
    }
    return data;
  }

  public async store(req: Request): Promise<Contacts> {
    const { body } = req;
    const contact = await this.storeRepository(body);
    return contact;
  }

  public async storeRepository(data: IContactsRequestDTO): Promise<Contacts> {
    data = this.datasValidate(data);
    data.subscribed = true;
    const checkEmail = await this._contactsRepository.findByEmail(data.email);
    if (checkEmail) {
      throw new AppError(i18n('contact.existing_email'));
    }
    const listTags = await this._tagsRepository.findByIds(data?.tags || []);
    const datas = { ...data, tags: listTags || [] };
    const contact = await this._contactsRepository.store(datas as Contacts);
    return contact;
  }

  public async update(req: Request): Promise<Contacts> {
    const { body } = req;
    const contact = await this.updateRepository(body);
    return contact;
  }

  public async updateRepository(data: IContactsRequestDTO): Promise<Contacts> {
    if (!data.id) {
      throw new AppError(i18n('contact.enter_your_ID'));
    }
    const checkMail = await this._contactsRepository.findByEmail(data.email);
    if (checkMail && checkMail.id !== data.id) {
      throw new AppError(i18n('contact.existing_email'));
    }
    const listTags = await this._tagsRepository.findByIds(data?.tags || []);
    const datas = { ...data, tags: listTags || [] };
    const contact = await this._contactsRepository.update(datas as Contacts);
    return contact;
  }

  public async delete(req: Request): Promise<string> {
    const { query } = req;
    const id = query?.id as string;
    const result = this.deleteRepository(id);
    return result;
  }

  public async deleteRepository(id: string): Promise<string> {
    if (!id) {
      throw new AppError(i18n('contact.enter_your_contact_details'));
    }
    const response = await this._contactsRepository.delete(id);
    if (!response || response.affected === 0 || response.affected === null) {
      throw new AppError(i18n('contact.the_contact_cannot_be_removed'));
    }
    return i18n('contact.registration_removed_successfully');
  }

  public async show(req: Request): Promise<Contacts | undefined> {
    const { query } = req;
    const id = query?.id as string;
    const result = this.showRepository(id);
    return result;
  }

  public async showRepository(id: string): Promise<Contacts | undefined> {
    if (!id) {
      throw new AppError(i18n('contact.enter_your_contact_details'));
    }
    const contact = await this._contactsRepository.findByIdWithTags(id);
    return contact;
  }

  public async inactivateActivate(req: Request): Promise<string> {
    const { query } = req;
    const id = query?.id as string;
    const result = this.inactivateActivateRepository(id);
    return result;
  }

  public async inactivateActivateRepository(id: string): Promise<string> {
    if (!id) {
      throw new AppError(i18n('contact.enter_your_contact_details'));
    }
    const sender = await this._contactsRepository.findById(id);
    if (!sender) {
      throw new AppError(i18n('sender.contact_not_found_in_the_database'));
    }
    const response = await this._contactsRepository.inactivateActivate(sender);
    if (!response) {
      throw new AppError(i18n('sender.the_status_of_the_contact_could_not_changed'));
    }
    return `${i18n('contact.contact')} ${sender.active ? i18n('labels.activated') : i18n('labels.inactivated')}`;
  }

  public async index(data: IPagination): Promise<IPaginationAwareObject> {
    data.status = 'both';
    const list = await this._contactsRepository.index(data);
    return list;
  }

  public async removeTag(req: Request): Promise<string> {
    const { id_contact, id_tag } = req?.body;
    if (!id_contact) {
      throw new AppError(i18n('contact.enter_your_contact_details'));
    }
    if (!id_tag) {
      throw new AppError(i18n('tag.enter_your_ID'));
    }
    const contact = await this._contactsRepository.findByIdWithTags(id_contact);
    if (!contact) {
      throw new AppError(i18n('contact.contact_not_found_in_the_database'));
    }
    if (!contact?.tags || contact.tags.length < 1) {
      throw new AppError(i18n('contact.contact_not_found_in_the_database'));
    }
    contact.tags = contact?.tags?.filter(tag => tag.id !== id_tag);
    await this._contactsRepository.update(contact);
    return i18n('tag.registration_removed_successfully');
  }

  public async inscribeDescribe(req: Request): Promise<string> {
    const { query } = req;
    const id = query?.id as string;
    const result = this.inscribeDescribeRepository(id);
    return result;
  }

  public async inscribeDescribeRepository(id: string): Promise<string> {
    if (!id) {
      throw new AppError(i18n('contact.enter_your_contact_details'));
    }
    const contact = await this._contactsRepository.findById(id);
    if (!contact) {
      throw new AppError(i18n('sender.contact_not_found_in_the_database'));
    }
    contact.subscribed = !contact.subscribed;
    const response = await this._contactsRepository.inscribeDescribe(contact);
    if (!response) {
      throw new AppError(i18n('sender.the_status_of_the_contact_inscribe_could_not_changed'));
    }
    return `${i18n('contact.contact')} ${contact.subscribed ? i18n('contact.inscribe') : i18n('contact.describe')}`;
  }
}
export default ContactsServices;
