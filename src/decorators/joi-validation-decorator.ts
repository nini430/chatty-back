import { JoiValidationError } from '@errors/joi-validation-error';
import {NextFunction, Request} from 'express';
import { ObjectSchema } from 'joi';


export default async function joiValidationDecorator(schema: ObjectSchema, req: Request, next: NextFunction) {
            const {error}=await Promise.resolve(schema.validate(req.body));
            if(error?.details) {
                return next(new JoiValidationError(error.details[0].message));
            }
}
