import { signToken } from './../../../services/db/auth.service';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { signupSchema } from '@auth/schemes/signup';
import joiValidationDecorator from '@decorators/joi-validation-decorator';
import { BadRequestError } from '@errors/bad-request-error';
import { getUserByUsernameOrEmail, signupData } from '@services/db/auth.service';
import { saveUserCache } from '@services/redis/user.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import upload from '@utils/cloudinary-upload';
import { generateRandomCharacters, makeLowercase, makeUppercase } from '@utils/helpers';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { config } from 'config';
import {NextFunction, Request, Response} from 'express';
import {ObjectId} from 'mongodb';
import {omit} from 'lodash';
import { addAuthUserJob } from '@queues/auth.queue';
import { addUserJob } from '@queues/user.queue';

const userData=(data: IAuthDocument, userId: ObjectId)=>{
  const {_id, avatarColor, username, email, uId, password}=data;

  return {
    _id: userId,
    authId: _id,
    username: makeUppercase(username),
    email: makeLowercase(email),
    uId,
    password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      }
  } as unknown as IUserDocument;
};


export default async function signupHandler(req: Request, res: Response, next: NextFunction) {
  joiValidationDecorator(signupSchema, req, next);
  const {username, email, password, avatarColor, avatarImage}=req.body;

  const existingUser = await getUserByUsernameOrEmail(username , email);
  if(existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const authObjectId = new ObjectId();
  const userObjectId = new ObjectId();
  const uId= generateRandomCharacters(12);

  const authData : IAuthDocument = signupData({_id: authObjectId, avatarColor, email, username, uId, password});
  const result: UploadApiResponse | UploadApiErrorResponse | undefined = await upload(avatarImage, `${userObjectId}`, true, true);
  if(!result?.public_id) {
    throw new BadRequestError('File upload: error occured, Try again.');
  }

  const user = userData(authData, userObjectId);
  user.profilePicture = `https://res.cloudinary.com/${config.cloudinaryName}/image/upload/v${result.version}/${userObjectId}`;
  await saveUserCache(`${userObjectId}`, uId.toString(), user);
  omit(user, ['email', 'password', 'username', 'uId', 'avatarColor']);
  addAuthUserJob('auth-signup', {value: authData});
  addUserJob('user-signup', {value: user });

  const token = signToken(authData, userObjectId);
  req.session ={jwt: token};
  return res.status(201).json({message: 'User created successfully',authData, user, token});

}

