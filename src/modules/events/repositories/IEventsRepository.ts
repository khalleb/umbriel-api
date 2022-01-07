import IBaseRepository from '@shared/infra/typeorm/repositories/postgres/IBaseRepository';

import { Events } from '../infra/typeorm/entities/Events';

interface IEventsRepository extends IBaseRepository<Events> {}

export { IEventsRepository };
