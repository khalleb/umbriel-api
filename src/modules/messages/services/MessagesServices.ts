import { Request } from 'express';

import { inject, injectable } from 'tsyringe';

import ContactsRepository from '@modules/contacts/infra/typeorm/repositories/ContactsRepository';
import IContactsRepository from '@modules/contacts/repositories/IContactsRepository';
import SendersRepository from '@modules/senders/infra/typeorm/repositories/SendersRepository';
import ISendersRepository from '@modules/senders/repositories/ISendersRepository';
import TagsRepository from '@modules/tags/infra/typeorm/repositories/TagsRepository';
import ITagsRepository from '@modules/tags/repositories/ITagsRepository';
import TemplatesRepository from '@modules/templates/infra/typeorm/repositories/TemplatesRepository';
import ITemplatesRepository from '@modules/templates/repositories/ITemplatesRepository';

import AppError from '@shared/errors/AppError';
import { i18n } from '@shared/infra/http/internationalization';
import IBaseService from '@shared/infra/services/IBaseService';

import { IMessageDTO } from '../dtos/IMessagesDTO';
import Messages from '../infra/typeorm/entities/Messages';
import MessagesRepository from '../infra/typeorm/repositories/MessagesRepository';
import IMessagesRepository from '../repositories/IMessagesRepository';

@injectable()
class MessagesServices implements IBaseService {
  constructor(
    @inject(MessagesRepository.name)
    private _messagesRepository: IMessagesRepository,

    @inject(TagsRepository.name)
    private _tagsRepository: ITagsRepository,

    @inject(TemplatesRepository.name)
    private _templatesRepository: ITemplatesRepository,

    @inject(ContactsRepository.name)
    private _contactsRepository: IContactsRepository,

    @inject(SendersRepository.name)
    private _sendersRepository: ISendersRepository,
  ) {}

  private datasValidate(data: IMessageDTO): IMessageDTO {
    if (!data) {
      throw new AppError(i18n('message.enter_the_data'));
    }
    if (!data.sender_id) {
      throw new AppError(i18n('sender.enter_your_sender_details'));
    }
    if (!data.subject) {
      throw new AppError(i18n('message.enter_the_subject'));
    }

    // if (!data.body) {
    //   throw new AppError(i18n('message.enter_the_body'));
    // }

    if (!data?.tags || data?.tags?.length <= 0) {
      throw new AppError(i18n('tag.enter_your_tag_details'));
    }
    return data;
  }

  public async store(req: Request): Promise<Messages> {
    const { body } = req;
    const message = await this.storeRepository(body);
    return message;
  }

  public async storeRepository(data: IMessageDTO): Promise<Messages> {
    data = this.datasValidate(data);
    const listTags = await this._tagsRepository.findByIds(data?.tags || []);
    const datas = { ...data, tags: listTags || [] };
    const message = await this._messagesRepository.store(datas as Messages);
    return message;
  }

  public async delete(req: Request): Promise<string> {
    const { query } = req;
    const id = query?.id as string;
    const result = this.deleteRepository(id);
    return result;
  }

  public async deleteRepository(id: string): Promise<string> {
    if (!id) {
      throw new AppError(i18n('message.enter_your_message_details'));
    }
    const response = await this._messagesRepository.delete(id);
    if (!response || response.affected === 0 || response.affected === null) {
      throw new AppError(i18n('message.the_message_cannot_be_removed'));
    }
    return i18n('message.registration_removed_successfully');
  }

  public async show(req: Request): Promise<Messages | undefined> {
    const { query } = req;
    const id = query?.id as string;
    const result = this.showRepository(id);
    return result;
  }

  public async showRepository(id: string): Promise<any | undefined> {
    if (!id) {
      throw new AppError(i18n('message.enter_your_message_details'));
    }
    const message = await this._messagesRepository.findByIdWithTags(id);
    return message;
  }
}
export default MessagesServices;
