import { Request, Response } from 'express';

import { container } from 'tsyringe';

import MessagesServices from '@modules/messages/services/MessagesServices';

import BaseController from '@shared/infra/http/controllers/BaseController';

export default class MessagesController extends BaseController<MessagesServices> {
  public async send(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(MessagesServices);
    const status = await service.send(request);
    return response.json({ message: status });
  }
}
