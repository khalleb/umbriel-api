import { autoInjectable, inject } from 'tsyringe';

import { registerDependencies } from '@shared/container';
import { IMailQueueProvider } from '@shared/container/providers/EmailQueueProvider/models/IMailQueueProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';
import { env } from '@shared/env';
import { AppLogger } from '@shared/logger';

registerDependencies();
@autoInjectable()
class ProcessQueueService {
  constructor(
    @inject('EmailQueueProvider')
    private _queueProvider: IMailQueueProvider,
    @inject('MailProvider')
    private _mailProvider: IMailProvider,
  ) { }

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
        AppLogger.error({ message: error });
        if (env.isProduction) {
          // sentry
        }
      }
    });
  }
}

export { ProcessQueueService };
