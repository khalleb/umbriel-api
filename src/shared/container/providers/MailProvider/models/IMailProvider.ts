import { IMailMessage, IMailMessageQueue } from '../dtos/ISendMailDTO';

interface IMailProvider {
  sendEmailWithTemplate<T = Record<string, unknown>>(data: IMailMessage<T>): Promise<void>;
  sendEmail(message: IMailMessageQueue, meta?: Record<string, unknown>): Promise<void>;
}

export { IMailProvider };
