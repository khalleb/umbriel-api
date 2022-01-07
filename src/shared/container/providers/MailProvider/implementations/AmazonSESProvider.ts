import SES, { SendEmailRequest } from 'aws-sdk/clients/ses';
import { htmlToText } from 'html-to-text';

import { env } from '@shared/env';
import { AppLogger } from '@shared/logger';

import { IMailMessage, IMailMessageQueue } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';

class AmazonSESProvider implements IMailProvider {
  private client: SES;

  constructor() {
    this.client = new SES({
      apiVersion: '2010-12-01',
      region: env.AWS_REGION,
    });
  }

  async sendEmailWithTemplate<T = Record<string, unknown>>(message: IMailMessage<T>): Promise<void> {
    AppLogger.info({ message: `Message sent: ${message}` });
  }

  async sendEmail(message: IMailMessageQueue, meta?: Record<string, string>): Promise<void> {
    const sendMailConfig = {
      Source: `${message.from.name} <${message.from.email}>`,
      Destination: {
        ToAddresses: [message.to?.name ? `${message.to?.name} <${message.to.email}>` : message.to.email],
      },
      Message: {
        Subject: {
          Data: message.subject,
        },
        Body: {
          Html: {
            Data: message.body,
          },
          Text: {
            Data: htmlToText(message.body, {
              ignoreImage: true,
              preserveNewlines: true,
              wordwrap: 120,
            }),
          },
        },
      },
    } as SendEmailRequest;

    if (meta) {
      sendMailConfig.ConfigurationSetName = 'umbriel';
      sendMailConfig.Tags = Object.keys(meta).map(key => {
        return {
          Name: key,
          Value: meta[key],
        };
      });
    }
    const responseSendEmail = await this.client.sendEmail(sendMailConfig).promise();
    AppLogger.info({ message: responseSendEmail });
  }
}

export { AmazonSESProvider };
