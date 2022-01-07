import fs from 'fs';
import { compile } from 'handlebars';
import { htmlToText } from 'html-to-text';
import nodemailer, { Transporter } from 'nodemailer';

import { mailConfig } from '@config/mail';

import { AppLogger } from '@shared/logger';

import { IMailMessage, IMailMessageQueue } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  async sendEmailWithTemplate<T = Record<string, unknown>>(message: IMailMessage<T>): Promise<void> {
    const templateFile = fs.readFileSync(message.path, 'utf-8');
    const templateParse = compile<T>(templateFile);
    const templateHTML = templateParse(message.variables);
    const { name, email } = mailConfig.defaults.from;
    const sendMailConfig = {
      from: {
        name: message?.from?.name || name,
        address: message?.from?.email || email,
      },
      to: {
        name: message.to?.name || '',
        address: message.to.email,
      },
      subject: message.subject,
      html: templateHTML,
    };

    const responseSendEmail = await this.client.sendMail(sendMailConfig);

    AppLogger.info({ message: `Message sent %s ${responseSendEmail.messageId}` });
    AppLogger.info({ message: `Preview URL %s ${nodemailer.getTestMessageUrl(responseSendEmail)}` });
  }

  async sendEmail(message: IMailMessageQueue, meta?: Record<string, string>): Promise<void> {
    const sendMailConfig = {
      Source: `${message.from.name} <${message.from.email}>`,
      Destination: {
        ToAddresses: [`${message.to.name} <${message.to.email}>`],
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
            Data: htmlToText(message.body),
          },
        },
      },
    };
    if (meta) {
      AppLogger.info({ message: sendMailConfig });
    }
    AppLogger.info({ message: sendMailConfig });
  }
}
export { EtherealMailProvider };
