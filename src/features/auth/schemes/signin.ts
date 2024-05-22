import Joi, {ObjectSchema} from 'joi';


export const signinSchema : ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(8).messages({
    'string.base': 'username should be type of string',
    'string.min': 'invalid username',
    'string.max': 'invalid username',
    'string.empty': 'username field is required'
  }),
  password: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field'
  })
});


