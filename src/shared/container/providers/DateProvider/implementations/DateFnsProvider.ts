import { addDays } from 'date-fns';

import { IDateProvider } from '../models/IDateProvider';

class DateFnsProvider implements IDateProvider {
  addDays(days: number): Date {
    return addDays(new Date(), days);
  }
}

export { DateFnsProvider };
