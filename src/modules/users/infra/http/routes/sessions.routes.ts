import { Router } from 'express';

import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

import SessionController from '../controllers/SessionController';

const router = Router();
const sessionsController = new SessionController();

router.post('/auth', sessionsController.auth);
router.get('/me', ensureAuthenticated, sessionsController.me);
router.post('/refresh-token', sessionsController.refreshToken);
router.post('/forgot-password', sessionsController.forgotPassword);
router.post('/change-password', sessionsController.changePassword);

export default router;
