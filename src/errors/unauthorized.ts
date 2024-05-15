import { CustomError } from "./custom-error"
import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends CustomError {
        statusCode = StatusCodes.UNAUTHORIZED;
        status = 'unauthorized';

        constructor(message: string) {
            super(message);
        }
}

