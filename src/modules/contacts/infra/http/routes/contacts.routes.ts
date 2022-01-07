import { Router, Request, Response } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';

import uploadConfig from '@config/upload';

import { RoutesType } from '@shared/commons/constants';
import { tokensServices } from '@shared/container';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';
import { paginationRoute } from '@shared/infra/http/routes/validation.routes';

import { ContactsController } from '../controllers/ContactsController';

const router = Router();
const controller = new ContactsController();
const nameService: tokensServices = 'ContactsServices';
const upload = multer(uploadConfig.multer);

const datasCreateUpdate = {
  name: Joi.string().allow(null),
  email: Joi.string().email().required(),
  tags: Joi.array(),
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

// router.delete(
//   `/${RoutesType.DELETE}`,
//   ensureAuthenticated,
//   celebrate({ [Segments.QUERY]: { id: Joi.string().required().uuid() } }),
//   (request: Request, response: Response) => controller.delete(request, response, nameService),
// );

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

router.delete(
  `/delete-tag`,
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: { id_contact: Joi.string().required().uuid(), id_tag: Joi.string().required().uuid() },
  }),
  controller.removeTag,
);

router.get(
  `/inscribe-describe`,
  ensureAuthenticated,
  celebrate({ [Segments.QUERY]: { id: Joi.string().required().uuid() } }),
  controller.inscribeDescribe,
);

router.post(`/import`, ensureAuthenticated, upload.single('file'), controller.import);

export default router;
