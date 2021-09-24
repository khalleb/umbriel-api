import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ContactsServices from '@modules/contacts/services/ContactsServices';

import BaseController from '@shared/infra/http/controllers/BaseController';

export default class ContactsController extends BaseController<ContactsServices> {
  public async removeTag(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ContactsServices);
    const status = await service.removeTag(request);
    return response.json({ message: status });
  }

  public async inscribeDescribe(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ContactsServices);
    const status = await service.inscribeDescribe(request);
    return response.json({ message: status });
  }
}
