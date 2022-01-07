import { Request, Response } from 'express';

import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';

import { TagsServices } from '@modules/tags/services/TagsServices';

import BaseController from '@shared/infra/http/controllers/BaseController';

class TagsController extends BaseController<TagsServices> {
  public async findByNameLike(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(TagsServices);
    const res = await service.findByNameLike(request);
    return response.json(instanceToInstance(res));
  }
}
export { TagsController };
