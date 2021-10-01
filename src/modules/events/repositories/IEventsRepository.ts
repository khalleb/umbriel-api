import IBaseRepository from '@shared/infra/typeorm/base/IBaseRepository';

import Events from '../infra/typeorm/entities/Events';

export default interface IEventsRepository extends IBaseRepository<Events> {}
