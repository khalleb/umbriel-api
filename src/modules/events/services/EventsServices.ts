import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { i18n } from '@shared/infra/http/internationalization';
import IBaseService from '@shared/infra/services/IBaseService';
import { IPagination, IPaginationAwareObject } from '@shared/infra/typeorm/Pagination';

import { IEventsDTO } from '../dtos/IEventsDTO';
import Events from '../infra/typeorm/entities/Events';
import EventsRepository from '../infra/typeorm/repositories/EventsRepository';
import IEventsRepository from '../repositories/IEventsRepository';

@injectable()
class EventsServices implements IBaseService {
  constructor(
    @inject(EventsRepository.name)
    private _eventsRepository: IEventsRepository,
  ) {}

  public async index(data: IPagination): Promise<IPaginationAwareObject> {
    data.status = 'both';
    const list = await this._eventsRepository.index(data);
    return list;
  }

  public async storeRepository(datas: IEventsDTO): Promise<Events> {
    if (!datas) {
      throw new AppError(i18n('event.enter_the_data'));
    }
    if (!datas.type) {
      throw new AppError(i18n('event.enter_the_type'));
    }
    if (!datas.recipient_id) {
      throw new AppError(i18n('event.enter_the_recipient'));
    }
    const event = await this._eventsRepository.store(datas as Events);
    return event;
  }
}
export default EventsServices;
