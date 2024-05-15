import { CustomError } from "./custom-error";
import {StatusCodes} from 'http-status-codes';

export class NotFoundError extends CustomError {
    statusCode = StatusCodes.NOT_FOUND;
    status= 'not_found';

    constructor(message: string) {
        super(message);
    }
}
