import { CustomError } from "./custom-error";
import {StatusCodes} from 'http-status-codes'

export class BadRequestError extends CustomError {
    statusCode = StatusCodes.BAD_REQUEST;
    status = 'bad_request'

    constructor(message: string) {
        super(message);
    }
}

