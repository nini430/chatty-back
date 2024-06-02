import Joi, {ObjectSchema} from 'joi';


export const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().required().email().messages({
    'string.base': 'email should be type of string',
    'string.empty': 'email field is required',
    'string.email': 'invalid email'
  })
});


export const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'passwords don\'t match',
    'any.required': 'confirmPassword field is required'
  })
});
