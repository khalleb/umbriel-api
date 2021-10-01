import { container } from 'tsyringe';

import ContactsRepository from '@modules/contacts/infra/typeorm/repositories/ContactsRepository';
import IContactsRepository from '@modules/contacts/repositories/IContactsRepository';
import ContactsServices from '@modules/contacts/services/ContactsServices';
import EventsRepository from '@modules/events/infra/typeorm/repositories/EventsRepository';
import IEventsRepository from '@modules/events/repositories/IEventsRepository';
import EventsServices from '@modules/events/services/EventsServices';
import MessagesRepository from '@modules/messages/infra/typeorm/repositories/MessagesRepository';
import IMessagesRepository from '@modules/messages/repositories/IMessagesRepository';
import MessagesServices from '@modules/messages/services/MessagesServices';
import RecipientsRepository from '@modules/recipients/infra/typeorm/repositories/RecipientsRepository';
import IRecipientsRepository from '@modules/recipients/repositories/IRecipientsRepository';
import RecipientsServices from '@modules/recipients/services/RecipientsServices';
import SendersRepository from '@modules/senders/infra/typeorm/repositories/SendersRepository';
import ISendersRepository from '@modules/senders/repositories/ISendersRepository';
import SendersServices from '@modules/senders/services/SendersServices';
import TagsRepository from '@modules/tags/infra/typeorm/repositories/TagsRepository';
import ITagsRepository from '@modules/tags/repositories/ITagsRepository';
import TagsServices from '@modules/tags/services/TagsServices';
import TemplatesRepository from '@modules/templates/infra/typeorm/repositories/TemplatesRepository';
import ITemplatesRepository from '@modules/templates/repositories/ITemplatesRepository';
import TemplatesServices from '@modules/templates/services/TemplatesServices';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersServices from '@modules/users/services/UsersServices';

import IBaseService from '@shared/infra/services/IBaseService';

import './providers';

container.registerSingleton<IUsersRepository>(UsersRepository.name, UsersRepository);
container.registerSingleton<ITagsRepository>(TagsRepository.name, TagsRepository);
container.registerSingleton<IContactsRepository>(ContactsRepository.name, ContactsRepository);
container.registerSingleton<ISendersRepository>(SendersRepository.name, SendersRepository);
container.registerSingleton<ITemplatesRepository>(TemplatesRepository.name, TemplatesRepository);
container.registerSingleton<IMessagesRepository>(MessagesRepository.name, MessagesRepository);
container.registerSingleton<IEventsRepository>(EventsRepository.name, EventsRepository);
container.registerSingleton<IRecipientsRepository>(RecipientsRepository.name, RecipientsRepository);

container.registerSingleton<IBaseService>(UsersServices.name, UsersServices);
container.registerSingleton<IBaseService>(TagsServices.name, TagsServices);
container.registerSingleton<IBaseService>(ContactsServices.name, ContactsServices);
container.registerSingleton<IBaseService>(SendersServices.name, SendersServices);
container.registerSingleton<IBaseService>(TemplatesServices.name, TemplatesServices);
container.registerSingleton<IBaseService>(MessagesServices.name, MessagesServices);
container.registerSingleton<IBaseService>(EventsServices.name, EventsServices);
container.registerSingleton<IBaseService>(RecipientsServices.name, RecipientsServices);
