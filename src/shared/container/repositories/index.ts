import { container } from 'tsyringe';

import * as contactsRepositories from '@modules/contacts/repositories';
import * as eventsRepositories from '@modules/events/repositories';
import * as messagesRepositories from '@modules/messages/repositories';
import * as recipientsRepositories from '@modules/recipients/repositories';
import * as sendersRepositories from '@modules/senders/repositories';
import * as tagsRepositories from '@modules/tags/repositories';
import * as templatesRepositories from '@modules/templates/repositories';
import * as usersRepositories from '@modules/users/repositories';

const registeredRepositories = {
  contactsRepository: 'ContactsRepository',
  eventsRepositories: 'EventsRepositories',
  messagesRepositories: 'MessagesRepositories',
  recipientsRepositories: 'RecipientsRepositories',
  sendersRepositories: 'SendersRepositories',
  tagsRepositories: 'TagsRepositories',
  templatesRepositories: 'TemplatesRepositories',
  usersRepositories: 'UsersRepositories',
} as const;

function registerRepositories() {
  container.registerSingleton<eventsRepositories.IEventsRepository>(
    registeredRepositories.eventsRepositories,
    eventsRepositories.EventsRepository,
  );

  container.registerSingleton<contactsRepositories.IContactsRepository>(
    registeredRepositories.contactsRepository,
    contactsRepositories.ContactsRepository,
  );

  container.registerSingleton<messagesRepositories.IMessagesRepository>(
    registeredRepositories.messagesRepositories,
    messagesRepositories.MessagesRepository,
  );

  container.registerSingleton<recipientsRepositories.IRecipientsRepository>(
    registeredRepositories.recipientsRepositories,
    recipientsRepositories.RecipientsRepository,
  );

  container.registerSingleton<sendersRepositories.ISendersRepository>(
    registeredRepositories.sendersRepositories,
    sendersRepositories.SendersRepository,
  );

  container.registerSingleton<tagsRepositories.ITagsRepository>(
    registeredRepositories.tagsRepositories,
    tagsRepositories.TagsRepository,
  );

  container.registerSingleton<templatesRepositories.ITemplatesRepository>(
    registeredRepositories.templatesRepositories,
    templatesRepositories.TemplatesRepository,
  );

  container.registerSingleton<usersRepositories.IUsersRepository>(
    registeredRepositories.usersRepositories,
    usersRepositories.UsersRepository,
  );
}

export { registeredRepositories, registerRepositories };
