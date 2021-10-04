import { Router } from 'express';

import { text } from 'body-parser';

import WebHookController from '../controllers/WebHookController';

const router = Router();
const controller = new WebHookController();

router.post('/events/notifications', text(), controller.handle);
export default router;
