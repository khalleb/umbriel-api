import { Request } from 'express';

import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IBaseService from '@shared/infra/http/services/IBaseService';
import { IPagination, IPaginationAwareObject } from '@shared/infra/typeorm/core/Pagination';
import { i18n } from '@shared/internationalization';
import { emailIsValid } from '@shared/utils/validations';

import { ISendersDTO } from '../dtos/ISendersDTO';
import { Senders } from '../infra/typeorm/entities/Senders';
import { ISendersRepository } from '../repositories';

@injectable()
class SendersServices implements IBaseService {
  constructor(
    @inject('SendersRepositories')
    private _sendersRepository: ISendersRepository,
  ) {}

  private datasValidate(data: ISendersDTO): ISendersDTO {
    if (!data) {
      throw new AppError(i18n('sender.enter_the_data'));
    }

    if (!data.name) {
      throw new AppError(i18n('sender.enter_the_name_data'));
    }
    if (!data.email) {
      throw new AppError(i18n('sender.enter_the_email_data'));
    }

    data.name = data.name.trim();
    data.email = data.email.trim();
    data.email = data.email.toLowerCase();

    if (data.name.length < 3) {
      throw new AppError(i18n('sender.the_name_cannot_be_less_than_characters'));
    }
    if (data.name.length > 100) {
      throw new AppError(i18n('sender.the_name_cannot_be_longe_than_characters'));
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
    return data;
  }

  public async store(req: Request): Promise<Senders> {
    const { body } = req;
    const sender = await this.storeRepository(body);
    return sender;
  }

  public async storeRepository(datas: ISendersDTO): Promise<Senders> {
    const data = this.datasValidate(datas);

    const checkEmail = await this._sendersRepository.findByEmail(data.email);
    if (checkEmail) {
      throw new AppError(i18n('sender.existing_email'));
    }
    const senderStore = await this._sendersRepository.store(data as Senders);
    return senderStore;
  }

  public async update(req: Request): Promise<Senders> {
    const { body } = req;
    const sender = await this.updateRepository(body);
    return sender;
  }

  public async updateRepository(datas: ISendersDTO): Promise<any> {
    const data = this.datasValidate(datas);

    if (!data.id) {
      throw new AppError(i18n('sender.enter_your_ID'));
    }
    const checkMail = await this._sendersRepository.findByEmail(data.email);
    if (checkMail && checkMail.id !== data.id) {
      throw new AppError(i18n('sender.existing_email'));
    }
    const userUpdate = await this._sendersRepository.update(data as Senders);
    return userUpdate;
  }

  public async delete(req: Request): Promise<Senders> {
    const { query } = req;
    const id = query?.id as string;
    const result = await this.deleteRepository(id);
    return result;
  }

  public async deleteRepository(id: string): Promise<any> {
    if (!id) {
      throw new AppError(i18n('sender.enter_your_sender_details'));
    }
    const response = await this._sendersRepository.delete(id);
    if (!response || response.affected === 0 || response.affected === null) {
      throw new AppError(i18n('sender.the_sender_cannot_be_removed'));
    }
    return i18n('sender.registration_removed_successfully');
  }

  public async show(req: Request): Promise<Senders | undefined> {
    const { query } = req;
    const id = query?.id as string;
    const result = await this.showRepository(id);
    return result;
  }

  public async showRepository(id: string): Promise<Senders | undefined> {
    if (!id) {
      throw new AppError(i18n('sender.enter_your_sender_details'));
    }
    const sender = await this._sendersRepository.findById(id);
    return sender;
  }

  public async inactivateActivate(req: Request): Promise<string> {
    const { query } = req;
    const id = query?.id as string;
    const result = await this.inactivateActivateRepository(id);
    return result;
  }

  public async inactivateActivateRepository(id: string): Promise<string> {
    if (!id) {
      throw new AppError(i18n('sender.enter_your_sender_details'));
    }
    const sender = await this._sendersRepository.findById(id);
    if (!sender) {
      throw new AppError(i18n('sender.sender_not_found_in_the_database'));
    }
    const response = await this._sendersRepository.inactivateActivate(sender);
    if (!response) {
      throw new AppError(i18n('sender.the_status_of_the_sender_could_not_changed'));
    }
    return `${i18n('sender.sender')} ${sender.active ? i18n('labels.activated') : i18n('labels.inactivated')}`;
  }

  public async index(data: IPagination): Promise<IPaginationAwareObject> {
    const list = await this._sendersRepository.index(data);
    return list;
  }
}
export { SendersServices };
