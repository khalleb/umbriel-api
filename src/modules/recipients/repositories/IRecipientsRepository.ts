import IBaseRepository from '@shared/infra/typeorm/base/IBaseRepository';

import Recipients from '../infra/typeorm/entities/Recipients';

export default interface IRecipientsRepository extends IBaseRepository<Recipients> {}
