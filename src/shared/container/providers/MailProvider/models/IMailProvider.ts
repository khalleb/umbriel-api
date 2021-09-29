import { IMailMessage, IMailMessageQueue } from '../dtos/ISendMailDTO';

export default interface IMailProvider {
  sendEmailWithTemplate<T = Record<string, unknown>>(data: IMailMessage<T>): Promise<void>;
  sendEmail(message: IMailMessageQueue, meta?: Record<string, unknown>): Promise<void>;
}
