import { Router } from 'express';

import contactsRouter from '@modules/contacts/infra/http/routes/contacts.routes';
import messageRouter from '@modules/messages/infra/http/routes/messages.routes';
import sendersRouter from '@modules/senders/infra/http/routes/senders.routes';
import tagsRouter from '@modules/tags/infra/http/routes/tags.routes';
import templatesRouter from '@modules/templates/infra/http/routes/templates.routes';
import sessionRouter from '@modules/users/infra/http/routes/sessions.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';

import { Routes } from '@shared/commons/constants';

const router = Router();

router.use(`/${Routes.USER}`, usersRouter);
router.use(`/${Routes.SESSION}`, sessionRouter);
router.use(`/${Routes.TAG}`, tagsRouter);
router.use(`/${Routes.CONTACT}`, contactsRouter);
router.use(`/${Routes.SENDER}`, sendersRouter);
router.use(`/${Routes.TEMPLATE}`, templatesRouter);
router.use(`/${Routes.MESSAGE}`, messageRouter);

export { router };
