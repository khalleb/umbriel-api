import fs from 'fs';
import { compile } from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

import mailConfig from '@config/mail';

import Logger from '@shared/errors/Logger';

import { IMailMessage } from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

export default class EtherealMailProvider implements IMailProvider {
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

  async sendEmail<T = Record<string, unknown>>(message: IMailMessage<T>): Promise<void> {
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
        name: message.to.name,
        address: message.to.email,
      },
      subject: message.subject,
      html: templateHTML,
    };

    const responseSendEmail = await this.client.sendMail(sendMailConfig);

    Logger.info('Message sent: %s', responseSendEmail.messageId);
    Logger.info('Preview URL: %s', nodemailer.getTestMessageUrl(responseSendEmail));
  }
}
