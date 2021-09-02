import { Request, Response } from 'express';

import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import TagsServices from '@modules/tags/services/TagsServices';

import BaseController from '@shared/infra/http/controllers/BaseController';

export default class TagsController extends BaseController<TagsServices> {
  public async findByNameLike(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(TagsServices);
    const res = await service.findByNameLike(request);
    return response.json(classToClass(res));
  }
}
