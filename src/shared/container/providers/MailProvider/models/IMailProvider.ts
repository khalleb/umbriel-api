import { IMailMessage } from '../dtos/ISendMailDTO';

export default interface IMailProvider {
  sendEmail<T = Record<string, unknown>>(data: IMailMessage<T>): Promise<void>;
}
