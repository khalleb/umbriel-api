import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { i18n } from '@shared/infra/http/internationalization';

import { IRecipientsDTO } from '../dtos/IRecipientsDTO';
import Recipients from '../infra/typeorm/entities/Recipients';
import RecipientsRepository from '../infra/typeorm/repositories/RecipientsRepository';
import IRecipientsRepository from '../repositories/IRecipientsRepository';

@injectable()
class RecipientsServices {
  constructor(
    @inject(RecipientsRepository.name)
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
}
export default RecipientsServices;
