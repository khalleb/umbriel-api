import { addDays } from 'date-fns';

import { IDateProvider } from '../models/IDateProvider';

export default class DateFnsProvider implements IDateProvider {
  addDays(days: number): Date {
    return addDays(new Date(), days);
  }
}
