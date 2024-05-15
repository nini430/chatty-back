import { CustomError } from './custom-error';
import { StatusCodes } from 'http-status-codes';

export class JoiValidationError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;
  status = 'joi_validation_error';

  constructor(message: string) {
    super(message);
  }
}
