import { Router, Request, Response } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import MessagesServices from '@modules/messages/services/MessagesServices';

import { RoutesType } from '@shared/infra/commons/constants';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';
import { paginationRoute } from '@shared/infra/http/routes/validation.routes';

import MessagesController from '../controllers/MessagesController';

const router = Router();
const controller = new MessagesController();
const nameService = MessagesServices.name;

const datasCreateUpdate = {
  template_id: Joi.string().required().uuid(),
  sender_id: Joi.string().required().uuid(),
  tags: Joi.array().required(),
  subject: Joi.string().required(),
  body: Joi.string().required(),
};

router.post(
  `/${RoutesType.STORE}`,
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: datasCreateUpdate,
  }),
  (request: Request, response: Response) => controller.store(request, response, nameService),
);

router.get(
  `/${RoutesType.SHOW}`,
  ensureAuthenticated,
  celebrate({ [Segments.QUERY]: { id: Joi.string().required().uuid() } }),
  (request: Request, response: Response) => controller.show(request, response, nameService),
);

router.delete(
  `/${RoutesType.DELETE}`,
  ensureAuthenticated,
  celebrate({ [Segments.QUERY]: { id: Joi.string().required().uuid() } }),
  (request: Request, response: Response) => controller.delete(request, response, nameService),
);

router.post(
  `/${RoutesType.INDEX}`,
  ensureAuthenticated,
  celebrate({ [Segments.BODY]: paginationRoute }),
  (request: Request, response: Response) => controller.index(request, response, nameService),
);

router.get(`/send`, celebrate({ [Segments.QUERY]: { id: Joi.string().required().uuid() } }), controller.send);

export default router;
