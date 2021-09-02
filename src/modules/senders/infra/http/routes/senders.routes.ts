import { Router, Request, Response } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import SendersServices from '@modules/senders/services/SendersServices';

import { RoutesType } from '@shared/infra/commons/constants';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';
import { paginationRoute } from '@shared/infra/http/routes/validation.routes';

import SendersController from '../controllers/SendersController';

const router = Router();
const controller = new SendersController();
const nameService = SendersServices.name;

const datasCreateUpdate = {
  email: Joi.string().email().required(),
  name: Joi.string().required(),
};

router.post(
  `/${RoutesType.STORE}`,
  celebrate({ [Segments.BODY]: datasCreateUpdate }),
  (request: Request, response: Response) => controller.store(request, response, nameService),
);

router.put(
  `/${RoutesType.UPDATE}`,
  ensureAuthenticated,
  celebrate({ [Segments.BODY]: { ...datasCreateUpdate, id: Joi.string().required().uuid() } }),
  (request: Request, response: Response) => controller.update(request, response, nameService),
);

router.delete(
  `/${RoutesType.DELETE}`,
  ensureAuthenticated,
  celebrate({ [Segments.QUERY]: { id: Joi.string().required().uuid() } }),
  (request: Request, response: Response) => controller.delete(request, response, nameService),
);

router.get(
  `/${RoutesType.SHOW}`,
  ensureAuthenticated,
  celebrate({ [Segments.QUERY]: { id: Joi.string().required().uuid() } }),
  (request: Request, response: Response) => controller.show(request, response, nameService),
);

router.get(
  `/${RoutesType.INACTIVATE_ACTIVATE}`,
  ensureAuthenticated,
  celebrate({ [Segments.QUERY]: { id: Joi.string().required().uuid() } }),
  (request: Request, response: Response) => controller.inactivateActivate(request, response, nameService),
);

router.post(
  `/${RoutesType.INDEX}`,
  ensureAuthenticated,
  celebrate({ [Segments.BODY]: paginationRoute }),
  (request: Request, response: Response) => controller.index(request, response, nameService),
);

export default router;
