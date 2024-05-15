import { CustomError } from './custom-error';
import { StatusCodes } from 'http-status-codes';

export class ServerError extends CustomError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  status = 'server_error';

  constructor(message: string) {
    super(message);
  }
}
