import { Request } from 'express';

import inlineCss from 'inline-css';
import { inject, injectable } from 'tsyringe';

import { IContactsRepository } from '@modules/contacts/repositories';
import { ITagsRepository } from '@modules/tags/repositories';
import { ITemplatesRepository } from '@modules/templates/repositories/ITemplatesRepository';

import { IMailQueueProvider } from '@shared/container/providers/EmailQueueProvider/models/IMailQueueProvider';
import AppError from '@shared/errors/AppError';
import IBaseService from '@shared/infra/http/services/IBaseService';
import { IPagination, IPaginationAwareObject } from '@shared/infra/typeorm/core/Pagination';
import { i18n } from '@shared/internationalization';

import { IMessageDTO } from '../dtos/IMessagesDTO';
import { Messages } from '../infra/typeorm/entities/Messages';
import { IMessagesRepository } from '../repositories';

@injectable()
class MessagesServices implements IBaseService {
  constructor(
    @inject('MessagesRepositories')
    private _messagesRepository: IMessagesRepository,

    @inject('TagsRepositories')
    private _tagsRepository: ITagsRepository,

    @inject('TemplatesRepositories')
    private _templatesRepository: ITemplatesRepository,

    @inject('ContactsRepository')
    private _contactsRepository: IContactsRepository,

    @inject('EmailQueueProvider')
    private _mailQueueProvider: IMailQueueProvider,
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
    if (!data.body) {
      throw new AppError(i18n('message.enter_the_body'));
    }
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

  public async index(data: IPagination): Promise<IPaginationAwareObject> {
    const list = await this._messagesRepository.index(data);
    return list;
  }

  public async send(req: Request): Promise<string> {
    const { query } = req;
    const id = query?.id as string;
    if (!id) {
      throw new AppError(i18n('message.enter_your_message_details'));
    }
    const message = await this._messagesRepository.findByIdWithTags(id);
    if (!message) {
      throw new AppError(i18n('message.message_not_found_in_the_database'));
    }

    if (message.sent_at) {
      throw new AppError(i18n('message.message_has_already_been_sent'));
    }

    let messageBody = message.body;

    if (message.template_id && message.body) {
      const template = await this._templatesRepository.findById(message.template_id);

      if (!template) {
        throw new AppError(i18n('template.template_not_found_in_the_database'));
      }

      const messageBodyContent = template.content.replace('{{ message_content }}', message.body);
      const messageBodyWithInlineCSS = await inlineCss(messageBodyContent, {
        url: 'not-required',
        removeHtmlSelectors: true,
      });
      if (messageBodyWithInlineCSS.length <= 20) {
        throw new AppError(i18n('message.message_body_must_contains_least_characters'));
      }
      messageBody = messageBodyWithInlineCSS;
    }

    const messageTags = message?.tags;

    const tagsIds = messageTags?.map(messageTag => messageTag.id);
    if (!tagsIds) {
      throw new AppError(i18n('message.enter_the_tags'));
    }
    const contacts = await this._contactsRepository.findByTagsIds(tagsIds);

    const { sender } = message;

    message.body = messageBody;
    message.sent_at = new Date();

    const queueJobs = contacts.map(contact => {
      return {
        sender: {
          name: sender.name,
          email: sender.email,
        },
        recipient: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
        },
        message: {
          id: message.id,
          subject: message.subject,
          body: message.body,
        },
      };
    });
    await this._mailQueueProvider.addManyJobs(queueJobs);

    await this._messagesRepository.update(message);
    return i18n('message.email_sent');
  }
}
export { MessagesServices };
