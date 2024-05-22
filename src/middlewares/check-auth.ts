import { UnauthorizedError } from '@errors/unauthorized';
import {Response, NextFunction} from 'express';

export async function checkAuth(req: any, _res: Response, next: NextFunction) {

  if(!req.currentUser) {
    throw new UnauthorizedError('authentication is required');
  }

  next();
}