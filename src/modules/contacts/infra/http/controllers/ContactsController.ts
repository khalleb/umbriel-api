import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { ContactImportByCSVServices } from '@modules/contacts/services/ContactImportByCSVServices';
import { ContactsServices } from '@modules/contacts/services/ContactsServices';

import BaseController from '@shared/infra/http/controllers/BaseController';

class ContactsController extends BaseController<ContactsServices> {
  public async removeTag(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ContactsServices);
    const status = await service.removeTag(request);
    return response.json(status);
  }

  public async inscribeDescribe(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ContactsServices);
    const status = await service.inscribeDescribe(request);
    return response.json(status);
  }

  public async storeByRequestPublic(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ContactsServices);
    const status = await service.storeOrUpdateByRequestPublic(request);
    return response.json(status);
  }

  public async inscribeDescribeByRequestPublic(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ContactsServices);
    const status = await service.inscribeDescribeByRequestPublic(request);
    return response.json(status);
  }

  public async import(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ContactImportByCSVServices);
    const status = await service.execute(request);
    return response.json(status);
  }
}

export { ContactsController };
