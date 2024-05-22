import { IAuthDocument, SignupData } from '@auth/interfaces/auth.interface';
import authModel from '@auth/models/auth.model';
import { makeLowercase, makeUppercase } from '@utils/helpers';
import { config } from 'config';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';


export async function getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument | null> {
    return authModel.findOne({$or: [{username: makeUppercase(username), email: makeLowercase(email)}]});
}

export async function getUserByUsername(username: string) {
  return authModel.findOne({username: makeUppercase(username)});
}

export const signupData = (data: SignupData): IAuthDocument=>{
  const {_id, avatarColor, email, password, uId, username}= data;
   return {
    _id,
    uId,
    username: makeUppercase(username),
    email: makeLowercase(email),
    avatarColor,
    password,
    createdAt: new Date()
   } as unknown as IAuthDocument;
};


export const createAuth=async(data: IAuthDocument)=>{
  await authModel.create(data);
};


export const signToken=(data: Partial<IAuthDocument>, userObjectId: ObjectId): string=>{
  return jwt.sign({
    userId: userObjectId,
    uId: data.uId,
    email: data.email,
    username: data.username,
    avatarColor: data.avatarColor
  }, config.jwtSecret);
};

