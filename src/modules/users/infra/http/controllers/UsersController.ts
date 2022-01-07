import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { ChangePasswordService } from '@modules/users/services/ChangePasswordService';
import { UsersServices } from '@modules/users/services/UsersServices';

import BaseController from '@shared/infra/http/controllers/BaseController';

class UsersController extends BaseController<UsersServices> {
  public async updatePassword(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const service = container.resolve(ChangePasswordService);
    const reps = await service.updatePassword(request?.body, id);
    return response.json({ message: reps });
  }
}
export { UsersController };
