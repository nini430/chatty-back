import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'src/errors/custom-error';
import Logger from 'bunyan';
import { createLogger } from 'config';

const log: Logger = createLogger('error-handler');

export default function errorHandler(error: CustomError, req: Request, res: Response, next: NextFunction) {
  log.error(error);
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json(error.serializeErrors());
  }

  next();
}
