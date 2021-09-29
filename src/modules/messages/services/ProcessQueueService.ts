import { inject, injectable } from 'tsyringe';

import { IMailQueueProvider } from '@shared/container/providers/EmailQueueProvider/models/IMailQueueProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { MAIL_PROVIDER_NAME, MAIL_QUEUE_PROVIDER_NAME } from '@shared/container/utils/ProviderNames';
import { env } from '@shared/env';
import Logger from '@shared/errors/Logger';

@injectable()
class ProcessQueueService {
  constructor(
    @inject(MAIL_QUEUE_PROVIDER_NAME)
    private _queueProvider: IMailQueueProvider,
    @inject(MAIL_PROVIDER_NAME)
    private _mailProvider: IMailProvider,
  ) {}

  execute(): void {
    this._queueProvider.process(async ({ data: { sender, recipient, message } }) => {
      try {
        await this._mailProvider.sendEmail(
          {
            from: {
              name: sender.name,
              email: sender.email,
            },
            to: {
              name: recipient.name,
              email: recipient.email,
            },
            subject: message.subject,
            body: message.body,
          },
          {
            messageId: message.id,
            contactId: recipient.id,
          },
        );
      } catch (error) {
        Logger.error('Error: ', error);
        if (env.isProduction) {
          // sentry
        }
      }
    });
  }
}

export default ProcessQueueService;
