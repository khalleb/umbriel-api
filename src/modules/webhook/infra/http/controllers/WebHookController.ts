import { Request, Response } from 'express';

import { container } from 'tsyringe';

import WebhookService from '@modules/webhook/services/WebhookService';

export default class WebHookController {
  public async handle(request: Request, response: Response): Promise<any> {
    const service = container.resolve(WebhookService);
    const result = await service.execute(request);
    return response.json(result);
  }
}
