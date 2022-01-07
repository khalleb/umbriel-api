import { container } from 'tsyringe';

import { ContactsServices } from '@modules/contacts/services/ContactsServices';
import { EventsServices } from '@modules/events/services/EventsServices';
import { MessagesServices } from '@modules/messages/services/MessagesServices';
import { RecipientsServices } from '@modules/recipients/services/RecipientsServices';
import { SendersServices } from '@modules/senders/services/SendersServices';
import { TagsServices } from '@modules/tags/services/TagsServices';
import { TemplatesServices } from '@modules/templates/services/TemplatesServices';
import { UsersServices } from '@modules/users/services/UsersServices';

import IBaseService from '@shared/infra/http/services/IBaseService';

const registeredServices = {
  contactsServices: 'ContactsServices',
  eventsServices: 'EventsServices',
  messagesServices: 'MessagesServices',
  recipientsServices: 'RecipientsServices',
  sendersServices: 'SendersServices',
  tagsServices: 'TagsServices',
  templatesServices: 'TemplatesServices',
  usersServices: 'UsersServices',
} as const;

function registerServices() {
  container.registerSingleton<IBaseService>(registeredServices.contactsServices, ContactsServices);
  container.registerSingleton<IBaseService>(registeredServices.eventsServices, EventsServices);
  container.registerSingleton<IBaseService>(registeredServices.messagesServices, MessagesServices);
  container.registerSingleton<IBaseService>(registeredServices.recipientsServices, RecipientsServices);
  container.registerSingleton<IBaseService>(registeredServices.sendersServices, SendersServices);
  container.registerSingleton<IBaseService>(registeredServices.tagsServices, TagsServices);
  container.registerSingleton<IBaseService>(registeredServices.templatesServices, TemplatesServices);
  container.registerSingleton<IBaseService>(registeredServices.usersServices, UsersServices);
}

export { registeredServices, registerServices };
