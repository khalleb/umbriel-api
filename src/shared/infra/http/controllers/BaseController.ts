/* eslint-disable no-plusplus */
import { Request, Response } from 'express';

import { instanceToInstance } from 'class-transformer';
import httpStatus from 'http-status';
import { container } from 'tsyringe';

import { tokensServices } from '@shared/container';
import { IPagination } from '@shared/infra/typeorm/core/Pagination';
import { cleanObject } from '@shared/utils/objectUtil';

import IBaseService from '../services/IBaseService';

export abstract class BaseController<T extends IBaseService> {
  public async store(request: Request, response: Response, serviceName: tokensServices): Promise<any> {
    const service = container.resolve<T>(serviceName);
    const object = await (service.store && service.store(request));
    return response.status(httpStatus.CREATED).json(cleanObject(instanceToInstance(object)));
  }

  public async update(request: Request, response: Response, serviceName: tokensServices): Promise<any> {
    const service = container.resolve<T>(serviceName);
    const object = await (service.update && service.update(request));
    return response.status(httpStatus.OK).json(cleanObject(instanceToInstance(object)));
  }

  public async delete(request: Request, response: Response, serviceName: tokensServices): Promise<any> {
    const service = container.resolve<T>(serviceName);
    const status = await (service.delete && service.delete(request));
    return response.json(status);
  }

  public async show(request: Request, response: Response, serviceName: tokensServices): Promise<any> {
    const service = container.resolve<T>(serviceName);
    const object = await (service.show && service.show(request));
    return response.json(cleanObject(instanceToInstance(object)));
  }

  public async inactivateActivate(request: Request, response: Response, serviceName: tokensServices): Promise<any> {
    const service = container.resolve<T>(serviceName);
    const status = await (service.inactivateActivate && service.inactivateActivate(request));
    return response.json(status);
  }

  public async index(request: Request, response: Response, serviceName: tokensServices): Promise<any> {
    const service = container.resolve<T>(serviceName);
    const datasPagination: IPagination = request.body;
    const data = await (service.index && service.index(datasPagination));
    return response.json(instanceToInstance(data));
  }
}

export default BaseController;
