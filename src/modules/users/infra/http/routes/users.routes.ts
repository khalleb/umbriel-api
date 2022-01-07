import { Router, Request, Response } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import { RoutesType, UserTypes } from '@shared/commons/constants';
import { tokensServices } from '@shared/container';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';
import { paginationRoute } from '@shared/infra/http/routes/validation.routes';

import { UsersController } from '../controllers/UsersController';

const router = Router();
const controller = new UsersController();
const nameService: tokensServices = 'UsersServices';

const datasCreateUpdate = {
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string()
    .valid(...Object.values(UserTypes))
    .default(UserTypes.CLIENT),
};

router.post(
  `/${RoutesType.STORE}`,
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      ...datasCreateUpdate,
      password: Joi.string().required(),
      password_confirmation: Joi.string().required(),
    },
  }),
  (request: Request, response: Response) => controller.store(request, response, nameService),
);

router.put(
  `/${RoutesType.UPDATE}`,
  ensureAuthenticated,
  celebrate({ [Segments.BODY]: { ...datasCreateUpdate, id: Joi.string().required().uuid() } }),
  (request: Request, response: Response) => controller.update(request, response, nameService),
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

router.post(
  `/${RoutesType.UPDATE_PASSWORD}`,
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      password: Joi.string().required(),
      password_confirmation: Joi.string().required(),
    },
  }),
  controller.updatePassword,
);

export default router;
