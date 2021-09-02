import { Router, Request, Response } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import TagsServices from '@modules/tags/services/TagsServices';

import { RoutesType } from '@shared/infra/commons/constants';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';
import { paginationRoute } from '@shared/infra/http/routes/validation.routes';

import TagsController from '../controllers/TagsController';

const router = Router();
const controller = new TagsController();
const nameService = TagsServices.name;

const datasCreateUpdate = {
  name: Joi.string().required(),
};

router.post(
  `/${RoutesType.STORE}`,
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: datasCreateUpdate,
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

router.get(
  `/get-by-name-like`,
  ensureAuthenticated,
  celebrate({ [Segments.QUERY]: { name: Joi.string().required() } }),
  controller.findByNameLike,
);

export default router;
