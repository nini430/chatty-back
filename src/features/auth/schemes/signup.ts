import Joi, {ObjectSchema} from 'joi';


export const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(8).messages({
    'string.base': 'username should be type of string',
    'string.min': 'invalid username',
    'string.max': 'invalid username',
    'string.empty': 'username field is required'
  }),
  password: Joi.string().required().min(4).max(8).messages({
    'string.base': 'password should be type of string',
    'string.min': 'invalid password',
    'string.max': 'invalid password',
    'string.empty': 'password field is required'
  }),
  email : Joi.string().required().email().messages({
    'string.base': 'email should be type string',
    'string.email': 'invalid email',
    'string.empty': 'email field is required'
  }),
  avatarColor: Joi.string().required().messages({
    'any.required': 'avatarColor field is required'
  }),
  avatarImage: Joi.string().required().messages({
    'any.required': 'avatarImage is required field'
  })
});


