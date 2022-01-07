import { Router } from 'express';

import { WebHookController } from '../controllers/WebHookController';

const router = Router();
const controller = new WebHookController();

router.post('/events/notifications', controller.handle);
export default router;
