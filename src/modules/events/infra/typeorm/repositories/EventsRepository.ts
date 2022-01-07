import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';

import BaseRepository from '@shared/infra/typeorm/repositories/postgres/BaseRepository';

import { Events } from '../entities/Events';

class EventsRepository extends BaseRepository<Events> implements IEventsRepository {
  public constructor() {
    super(Events);
  }
}

export { EventsRepository };
