import IEventsRepository from '@modules/events/repositories/IEventsRepository';

import BaseRepository from '@shared/infra/typeorm/base/BaseRepository';

import Events from '../entities/Events';

class EventsRepository extends BaseRepository<Events> implements IEventsRepository {
  public constructor() {
    super(Events);
  }
}

export default EventsRepository;
