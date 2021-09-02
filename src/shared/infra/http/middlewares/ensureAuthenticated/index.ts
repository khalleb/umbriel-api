import { NextFunction, Request, Response } from 'express';

import { container } from 'tsyringe';

import { EnsureAuthenticatedMiddleware } from './EnsureAuthenticatedMiddleware';

async function ensureAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
  const ensureAuthenticatedMiddleware = container.resolve(EnsureAuthenticatedMiddleware);
  await ensureAuthenticatedMiddleware.handle(req, res, next);
}
export { ensureAuthenticated };
