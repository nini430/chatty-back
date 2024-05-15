import { CustomError } from './custom-error';
import { StatusCodes } from 'http-status-codes';

export class FileTooLargeError extends CustomError {
  statusCode = StatusCodes.REQUEST_TOO_LONG;
  status = 'fille_too_large';

  constructor(message: string) {
    super(message);
  }
}
