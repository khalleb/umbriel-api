import { SendersServices } from '@modules/senders/services/SendersServices';

import BaseController from '@shared/infra/http/controllers/BaseController';

class SendersController extends BaseController<SendersServices> {}
export { SendersController };
