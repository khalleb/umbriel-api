import { Request, Response } from 'express';

import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';

import { AuthenticateService } from '@modules/users/services/AuthenticateService';
import { ChangePasswordService } from '@modules/users/services/ChangePasswordService';
import { ForgotService } from '@modules/users/services/ForgotService';
import { RefreshTokenService } from '@modules/users/services/RefreshTokenService';
import { UsersServices } from '@modules/users/services/UsersServices';

import { cleanObject } from '@shared/utils/objectUtil';

class SessionController {
  public async auth(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const authenticateUser = container.resolve(AuthenticateService);
    const { token, refresh_token, user } = await authenticateUser.execute({
      email,
      password,
    });
    return response.json({ token, refresh_token, user: cleanObject(instanceToInstance(user)) });
  }

  public async me(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const service = container.resolve(UsersServices);
    const reps = await service.me(id);
    return response.json(cleanObject(instanceToInstance(reps)));
  }

  public async refreshToken(request: Request, response: Response): Promise<Response> {
    const token = request?.body?.token || request?.query?.token || request?.headers['x-access-token'];
    const service = container.resolve(RefreshTokenService);
    const result = await service.execute(token);
    return response.json(cleanObject(instanceToInstance(result)));
  }

  public async forgotPassword(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;
    const service = container.resolve(ForgotService);
    const reps = await service.execute(email as string);
    return response.json(reps);
  }

  public async changePassword(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ChangePasswordService);
    const reps = await service.execute(request?.body);
    return response.json(reps);
  }
}
export { SessionController };
