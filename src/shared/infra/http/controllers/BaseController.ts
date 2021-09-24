/* eslint-disable no-plusplus */
import { Request, Response } from 'express';

import { classToClass } from 'class-transformer';
import httpStatus from 'http-status';
import { container } from 'tsyringe';

import IBaseService from '@shared/infra/services/IBaseService';
import { IPagination } from '@shared/infra/typeorm/Pagination';
import { cleanObject } from '@shared/infra/utils/objectUtil';

export abstract class BaseController<T extends IBaseService> {
  public async store(request: Request, response: Response, serviceName: string): Promise<Response> {
    const service = container.resolve<T>(serviceName);
    const object = await (service.store && service.store(request));
    return response.status(httpStatus.CREATED).json(cleanObject(classToClass(object)));
  }

  public async update(request: Request, response: Response, serviceName: string): Promise<Response> {
    const service = container.resolve<T>(serviceName);
    const company = await (service.update && service.update(request));
    return response.status(httpStatus.OK).json(cleanObject(classToClass(company)));
  }

  public async delete(request: Request, response: Response, serviceName: string): Promise<Response> {
    const service = container.resolve<T>(serviceName);
    const status = await (service.delete && service.delete(request));
    return response.json({ message: status });
  }

  public async show(request: Request, response: Response, serviceName: string): Promise<Response> {
    const service = container.resolve<T>(serviceName);
    const object = await (service.show && service.show(request));
    return response.json(cleanObject(classToClass(object)));
  }

  public async inactivateActivate(request: Request, response: Response, serviceName: string): Promise<Response> {
    const service = container.resolve<T>(serviceName);
    const status = await (service.inactivateActivate && service.inactivateActivate(request));
    return response.json({ message: status });
  }

  public async index(request: Request, response: Response, serviceName: string): Promise<Response> {
    const service = container.resolve<T>(serviceName);
    const datasPagination: IPagination = request.body;
    const data = await (service.index && service.index(datasPagination));
    return response.json(classToClass(data));
  }
}

export default BaseController;
