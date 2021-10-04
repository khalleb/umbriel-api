import { Request } from 'express';

import { get } from 'lodash';
import { container, injectable } from 'tsyringe';

import EventsServices from '@modules/events/services/EventsServices';
import RecipientsServices from '@modules/recipients/services/RecipientsServices';

import AppError from '@shared/errors/AppError';
import Logger from '@shared/errors/Logger';
import { i18n } from '@shared/infra/http/internationalization';

import { IWebHookRequestDTO } from '../dtos/IWebHookDTO';

@injectable()
class WebhookService {
  async execute(request: Request): Promise<void> {
    try {
      if (!request) {
        throw new AppError(i18n('webhook.request_not_found'));
      }
      if (!request?.body) {
        throw new AppError(i18n('webhook.request_not_found_body'));
      }
      const data = request.body as IWebHookRequestDTO;

      if (!data.mail?.tags?.contactId?.[0]) {
        throw new AppError(i18n('webhook.contact_id_not_found_body'));
      }
      if (!data.mail?.tags?.messageId?.[0]) {
        throw new AppError(i18n('webhook.message_id_not_found_body'));
      }

      const eventTypesMap = {
        Bounce: 'bounce',
        Complaint: 'complaint',
        Delivery: 'delivery',
        Send: 'send',
        Reject: 'reject',
        Open: 'open',
        Click: 'click',
        'Rendering Failure': 'failure',
        DeliveryDelay: 'deliveryDelay',
      };

      const type = eventTypesMap[data.eventType];
      if (!type) {
        throw new AppError(i18n('webhook.type_id_not_found'));
      }
      const meta = get(data, `${type}`);

      if (!meta) {
        throw new AppError(i18n('webhook.meta_id_not_found'));
      }

      //  Filter false GMail openings
      if (
        type === 'open' &&
        meta?.userAgent ===
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246 Mozilla/5.0'
      ) {
        throw new AppError('Filter false GMail openings');
      }

      let importantMetadata: any = {};

      switch (type) {
        case 'Bounce':
          importantMetadata = {
            bounceType: meta?.bounceType,
            bounceSubType: meta?.bounceSubType,
            diagnosticCode: meta?.bouncedRecipients[0]?.diagnosticCode,
          };
          break;
        case 'Complaint':
          importantMetadata = {
            userAgent: meta?.userAgent,
            complaintFeedbackType: meta?.complaintFeedbackType,
          };
          break;
        case 'Open':
          importantMetadata = {
            ipAddress: meta?.ipAddress,
            userAgent: meta?.userAgent,
          };
          break;
        case 'Click':
          importantMetadata = {
            link: meta?.link,
            linkTags: meta?.linkTags,
            ipAddress: meta?.ipAddress,
            userAgent: meta?.userAgent,
          };
          break;
        case 'Delivery':
          importantMetadata = {
            timestamp: meta?.timestamp,
            smtpResponse: meta?.smtpResponse,
            reportingMTA: meta?.reportingMTA,
          };
          break;
        case 'Reject':
          importantMetadata = {
            reason: meta?.reason,
          };
          break;
        case 'Rendering Failure':
          importantMetadata = {
            errorMessage: meta?.errorMessage,
            templateName: meta?.templateName,
          };
          break;
        default:
          importantMetadata = {};
          break;
      }

      const recipientsServices = container.resolve(RecipientsServices);

      const messageId = data.mail.tags.messageId[0];
      const contactId = data.mail.tags.contactId[0];

      let recipient = await recipientsServices.findByMessageContact(messageId, contactId);
      if (!recipient) {
        recipient = await recipientsServices.storeRepository({ message_id: messageId, contact_id: contactId });
      }
      if (!recipient) {
        throw new AppError('Recipient not generated');
      }

      const eventsServices = container.resolve(EventsServices);
      await eventsServices.storeRepository({ recipient_id: recipient.id, meta: importantMetadata, type });
    } catch (error) {
      Logger.error(error as string);
    }
  }
}

export default WebhookService;
