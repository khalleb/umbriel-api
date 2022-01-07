import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IBaseService from '@shared/infra/http/services/IBaseService';
import { IPagination, IPaginationAwareObject } from '@shared/infra/typeorm/core/Pagination';
import { i18n } from '@shared/internationalization';

import { IRecipientsDTO } from '../dtos/IRecipientsDTO';
import { Recipients } from '../infra/typeorm/entities/Recipients';
import { IRecipientsRepository } from '../repositories';

@injectable()
class RecipientsServices implements IBaseService {
  constructor(
    @inject('RecipientsRepositories')
    private _recipientsRepository: IRecipientsRepository,
  ) {}

  public async storeRepository(datas: IRecipientsDTO): Promise<Recipients> {
    if (!datas) {
      throw new AppError(i18n('recipient.enter_the_data'));
    }
    if (!datas.message_id) {
      throw new AppError(i18n('recipient.enter_the_message_id'));
    }
    if (!datas.contact_id) {
      throw new AppError(i18n('recipient.enter_the_contact_id'));
    }
    const event = await this._recipientsRepository.store(datas as Recipients);
    return event;
  }

  public async findByMessageContact(message_id: string, contact_id: string): Promise<Recipients | undefined> {
    if (!message_id) {
      throw new AppError(i18n('recipient.enter_the_message_id'));
    }
    if (!contact_id) {
      throw new AppError(i18n('recipient.enter_the_contact_id'));
    }
    const recipient = await this._recipientsRepository.findByMessageContact(message_id, contact_id);
    return recipient;
  }

  public async index(data: IPagination): Promise<IPaginationAwareObject> {
    const list = await this._recipientsRepository.index(data);
    return list;
  }
}
export { RecipientsServices };
