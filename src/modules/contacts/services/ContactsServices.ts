import { Request } from 'express';

import { inject, injectable } from 'tsyringe';
import { validate as validateUUID } from 'uuid';

import { ITagsRepository } from '@modules/tags/repositories';

import AppError from '@shared/errors/AppError';
import { HttpResponseMessage, messageResponse } from '@shared/infra/http/core/HttpResponse';
import IBaseService from '@shared/infra/http/services/IBaseService';
import { IPagination, IPaginationAwareObject } from '@shared/infra/typeorm/core/Pagination';
import { i18n } from '@shared/internationalization';
import { emailIsValid } from '@shared/utils/validations';

import { IContactsRequestDTO } from '../dtos/IContactsDTO';
import { Contacts } from '../infra/typeorm/entities/Contacts';
import { IContactsRepository } from '../repositories';

@injectable()
class ContactsServices implements IBaseService {
  constructor(
    @inject('ContactsRepository')
    private _contactsRepository: IContactsRepository,

    @inject('TagsRepositories')
    private _tagsRepository: ITagsRepository,
  ) { }

  private datasValidate(data: IContactsRequestDTO): IContactsRequestDTO {
    if (!data) {
      throw new AppError(i18n('contact.enter_the_data'));
    }

    if (!data.email) {
      throw new AppError(i18n('contact.enter_the_email_data'));
    }
    if (data.name) {
      data.name = data.name.trim();
      if (data.name.length < 3) {
        throw new AppError(i18n('contact.the_name_cannot_be_less_than_characters'));
      }
      if (data.name.length > 100) {
        throw new AppError(i18n('contact.the_name_cannot_be_longe_than_characters'));
      }
    }
    data.email = data.email.trim();
    data.email = data.email.toLocaleLowerCase();

    if (data.email.length < 7) {
      throw new AppError(i18n('validations.the_email_cannot_be_less_than_characters'));
    }
    if (data.email.length > 100) {
      throw new AppError(i18n('validations.the_email_cannot_be_longe_than_characters'));
    }

    if (!emailIsValid(data.email)) {
      throw new AppError(`${i18n('validations.invalid_email')} -> ${data.email}`);
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

  public async storeRepository(data: IContactsRequestDTO, validateEmail = true): Promise<Contacts> {
    data = this.datasValidate(data);
    data.subscribed = true;
    if (validateEmail) {
      const checkEmail = await this._contactsRepository.findByEmail(data.email);
      if (checkEmail) {
        throw new AppError(`${i18n('contact.existing_email')} --> ${data.email}`);
      }
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

  public async updateRepository(data: IContactsRequestDTO, validateEmail = true): Promise<Contacts> {
    if (!data.id) {
      throw new AppError(i18n('contact.enter_your_ID'));
    }
    if (validateEmail) {
      const checkMail = await this._contactsRepository.findByEmail(data.email);
      if (checkMail && checkMail.id !== data.id) {
        throw new AppError(`${i18n('contact.existing_email')} --> ${data.email}`);
      }
    }
    const listTags = await this._tagsRepository.findByIds(data?.tags || []);
    const datas = { ...data, tags: listTags || [] };
    const contact = await this._contactsRepository.update(datas as Contacts);
    return contact;
  }

  public async delete(req: Request): Promise<HttpResponseMessage> {
    const { query } = req;
    const id = query?.id as string;
    const result = await this.deleteRepository(id);
    return result;
  }

  public async deleteRepository(id: string): Promise<HttpResponseMessage> {
    if (!id) {
      throw new AppError(i18n('contact.enter_your_contact_details'));
    }
    const response = await this._contactsRepository.delete(id);
    if (!response || response.affected === 0 || response.affected === null) {
      throw new AppError(i18n('contact.the_contact_cannot_be_removed'));
    }
    return messageResponse(i18n('contact.registration_removed_successfully'));
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

  public async inactivateActivate(req: Request): Promise<HttpResponseMessage> {
    const { query } = req;
    const id = query?.id as string;
    const result = await this.inactivateActivateRepository(id);
    return result;
  }

  public async inactivateActivateRepository(id: string): Promise<HttpResponseMessage> {
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
    return messageResponse(
      `${i18n('contact.contact')} ${sender.active ? i18n('labels.activated') : i18n('labels.inactivated')}`,
    );
  }

  public async index(data: IPagination): Promise<IPaginationAwareObject> {
    const list = await this._contactsRepository.index(data);
    return list;
  }

  public async removeTag(req: Request): Promise<HttpResponseMessage> {
    const { id_contact, id_tag } = req.body;
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
    return messageResponse(i18n('tag.registration_removed_successfully'));
  }

  public async inscribeDescribe(req: Request): Promise<HttpResponseMessage> {
    const { query } = req;
    const id = query?.id as string;
    const result = await this.inscribeDescribeRepository(id);
    return result;
  }

  public async inscribeDescribeRepository(id: string): Promise<HttpResponseMessage> {
    if (!id) {
      throw new AppError(i18n('contact.enter_your_contact_details'));
    }
    const contact = await this._contactsRepository.findById(id);
    if (!contact) {
      throw new AppError(i18n('contact.contact_not_found_in_the_database'));
    }
    contact.subscribed = !contact.subscribed;
    const response = await this._contactsRepository.inscribeDescribe(contact);
    if (!response) {
      throw new AppError(i18n('contact.the_status_of_the_contact_inscribe_could_not_changed'));
    }
    return messageResponse(
      `${i18n('contact.contact')} ${contact.subscribed ? i18n('contact.inscribe') : i18n('contact.describe')}`,
    );
  }

  public async inscribeDescribeByEmailRepository(email: string, type: string): Promise<HttpResponseMessage> {
    if (!email) {
      throw new AppError(i18n('contact.enter_the_email_data'));
    }
    const contact = await this._contactsRepository.findByEmail(email);
    if (!contact) {
      throw new AppError(i18n('contact.contact_not_found_in_the_database'));
    }
    contact.subscribed = type === 'INSCRIBE';
    const response = await this._contactsRepository.inscribeDescribe(contact);
    if (!response) {
      throw new AppError(i18n('contact.the_status_of_the_contact_inscribe_could_not_changed'));
    }
    return messageResponse(
      `${i18n('contact.contact')} ${contact.subscribed ? i18n('contact.inscribe') : i18n('contact.describe')}`,
    );
  }

  public async validateAndReturnTagID(tags: string[]): Promise<string[]> {
    let tagsId: string[] = [];
    if (!tags || tags.length <= 0) return tagsId;

    const resultsPromiseTags = tags.map(async (idOrName: string) => {
      const result = validateUUID(idOrName.trim())
        ? await this._tagsRepository.findById(idOrName.trim())
        : await this._tagsRepository.findByName(idOrName.trim());
      return result;
    });
    const tagsResult = await Promise.all(resultsPromiseTags);
    if (!tagsResult || tagsResult.length <= 0) return tagsId;
    tagsId = tagsResult?.map(e => e?.id) as string[];
    return tagsId;
  }

  public async storeOrUpdateByRequestPublicRepository(
    name: string | undefined,
    email: string,
    tags: string[],
  ): Promise<HttpResponseMessage> {
    if (!email) {
      throw new AppError(i18n('contact.enter_the_email_data'));
    }
    if (name) {
      name = name.trim();
    }
    email = email.trim().toLocaleLowerCase();

    const existEmailBaseGetId = await this._contactsRepository.checkExistEmail(email);
    if (existEmailBaseGetId) {
      const response = await this.updateRepository(
        {
          id: existEmailBaseGetId,
          name,
          email,
          tags,
          subscribed: true,
        },
        false,
      );

      if (response?.id) {
        return messageResponse(i18n('contact.contact_update_success'));
      }
    } else {
      const response = await this.storeRepository({ name, email, tags, subscribed: true }, false);

      if (response?.id) {
        return messageResponse(i18n('contact.contact_add_success'));
      }
    }
    return messageResponse(i18n('contact.contact_add_fail'));
  }

  public async storeOrUpdateByRequestPublic(request: Request): Promise<HttpResponseMessage> {
    const { name, email, tagsId } = request.body;
    const tags = await this.validateAndReturnTagID(tagsId);
    const result = await this.storeOrUpdateByRequestPublicRepository(name, email, tags);
    return result;
  }

  public async inscribeDescribeByRequestPublic(request: Request): Promise<HttpResponseMessage> {
    const { email, type, tagsId } = request.body;

    if (!email) {
      throw new AppError(i18n('contact.enter_the_email_data'));
    }
    const existEmailBase = await this._contactsRepository.findByEmail(email);
    if (!existEmailBase) {
      const tags = await this.validateAndReturnTagID(tagsId);
      await this.storeOrUpdateByRequestPublicRepository(undefined, email, tags);
    }
    const result = await this.inscribeDescribeByEmailRepository(email, type);
    return result;
  }
}
export { ContactsServices };
