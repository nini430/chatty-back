import {Document} from 'mongoose';
import {ObjectId} from 'mongodb';
import { IUserDocument } from '@user/interfaces/user.interface';


declare global {
  namespace express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}


export interface AuthPayload {
  userId: string;
  uId: string;
  email: string;
  username: string;
  avatarColor: string;
  iat?: number;
}

export interface IAuthDocument extends Document {
  _id: string | ObjectId;
  uId: string;
  username: string;
  email: string;
  password?: string;
  avatarColor: string;
  createdAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: string | number;
  comparePassword: (password: string)=>Promise<boolean>
  hashPassword: (password:string)=>Promise<string>
}

export interface SignupData {
  _id: ObjectId;
  uId: number;
  username: string;
  email: string;
  password: string;
  avatarColor: string;
}


export interface AuthJob {
  value: string | IAuthDocument | IUserDocument;
}

