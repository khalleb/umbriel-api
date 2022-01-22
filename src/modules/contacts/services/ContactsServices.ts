import { Request } from 'express';

import csvParse from 'csv-parse';
import { createReadStream } from 'fs';
import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';

import { ITagsRepository } from '@modules/tags/repositories';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import { HttpResponseMessage, messageResponse } from '@shared/infra/http/core/HttpResponse';
import IBaseService from '@shared/infra/http/services/IBaseService';
import { IPagination, IPaginationAwareObject } from '@shared/infra/typeorm/core/Pagination';
import { i18n } from '@shared/internationalization';
import { AppLogger } from '@shared/logger';
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

  public async importCSV(request: Request): Promise<void> {
    try {
      const fileName = request?.file?.filename;
      const { tags } = request.body;
      if (!fileName) {
        throw new AppError(i18n('validations.enter_the_data_file'));
      }

      const filePath = resolve(uploadConfig.tmpFolder, fileName);
      if (!filePath) {
        throw new AppError(i18n('validations.enter_the_data_file'));
      }
      const parsers = csvParse({
        delimiter: '|',
        trim: true,
      });

      const contactsFileStream = createReadStream(filePath);
      const parseCSV = contactsFileStream.pipe(parsers);

      parseCSV
        .on('data', async line => {
          try {
            if (line) {
              let email = line[0] ? (line[0] as string) : undefined;
              let name = line[1] ? (line[1] as string) : undefined;
              if (!email) return;
              email = email.trim();
              email = email.toLocaleLowerCase();
              if (name) {
                name = name.trim();
              }
              await this.storeOrUpdateByRequestPublicRepository(name, email, []);
            }
          } catch (error) {
            AppLogger.error({ message: error });
          }
        })
        .on('error', () => {
          AppLogger.info({ message: 'ERROR' });
        })
        .on('end', () => {
          AppLogger.info({ message: 'Acabou' });
        });
      // await new Promise(resolve => parseCSV.on('end', resolve));
    } catch (error) {
      AppLogger.info({ message: error });
    }
  }

  public async storeOrUpdateByRequestPublicRepository(
    name: string | undefined,
    email: string,
    tags: string[],
  ): Promise<HttpResponseMessage> {
    if (!email) {
      throw new AppError(i18n('contact.enter_the_email_data'));
    }
    let tagsId: (string | undefined)[] = [];
    if (tags && tags?.length > 0) {
      const resultsPromise = tags.map(async (name: string) => {
        const result = await this._tagsRepository.findByName(name);
        return result;
      });
      const tagsResult = await Promise.all(resultsPromise);
      if (tagsResult && tagsResult.length > 0) {
        tagsId = tagsResult.map(e => e?.id);
      }
    }

    const existEmailBase = await this._contactsRepository.findByEmail(email);
    if (existEmailBase?.id) {
      const response = await this.updateRepository({
        id: existEmailBase.id,
        name,
        email,
        tags: tagsId as string[],
        subscribed: true,
      });

      if (response?.id) {
        return messageResponse(i18n('contact.contact_update_success'));
      }
    } else {
      const response = await this.storeRepository({ name, email, tags: tagsId as string[], subscribed: true });

      if (response?.id) {
        return messageResponse(i18n('contact.contact_add_success'));
      }
    }
    return messageResponse(i18n('contact.contact_add_fail'));
  }

  public async storeOrUpdateByRequestPublic(request: Request): Promise<HttpResponseMessage> {
    const { name, email, tags } = request.body;
    const result = await this.storeOrUpdateByRequestPublicRepository(name, email, tags);
    return result;
  }

  public async inscribeDescribeByRequestPublic(request: Request): Promise<HttpResponseMessage> {
    const { email, type, tags } = request.body;

    if (!email) {
      throw new AppError(i18n('contact.enter_the_email_data'));
    }
    const existEmailBase = await this._contactsRepository.findByEmail(email);
    if (!existEmailBase) {
      await this.storeOrUpdateByRequestPublicRepository(undefined, email, tags);
    }
    const result = await this.inscribeDescribeByEmailRepository(email, type);
    return result;
  }
}
export { ContactsServices };
