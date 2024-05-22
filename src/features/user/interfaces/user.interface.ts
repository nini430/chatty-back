import mongoose, {Document} from 'mongoose';
import {ObjectId} from 'mongodb';


export interface IUserDocument extends Document {
  _id:ObjectId | string;
  authId: string | ObjectId;
  username?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  uId?: string;
  postsCount:  number;
  work: string;
  quote: string;
  school: string;
  location: string;
  blocked: mongoose.Schema.Types.ObjectId[],
  blockedBy: mongoose.Schema.Types.ObjectId[],
  followersCount: number;
  followingCount: number;
  bgImageVersion: string;
  bgImageId: string;
  profilePicture: string;
  notifications: INotificationSettings;
  social: ISocialLinks;
  createdAt?: string | Date;
  passwordResetToken?: string;
  passwordResetExpires?: number;

}


export interface IResetPasswordParams {
  username: string;
  email: string;
  ipaddress: string;
  date: string;
}

export interface INotificationSettings {
  messages: boolean;
  reactions: boolean;
  follows: boolean;
  comments: boolean;
}

export interface BasicInfo {
  quote: string;
  school: string;
  work: string;
  location:string;
}

export interface ISocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface ISearchUser {
  _id: string;
  profilePicture: string;
  username: string;
  email: string;
  avatarColor: string;
}

export interface ISocketData {
  blockedUser: string;
  blockedBy: string;
}

export interface ILogin {
  userId: string;
}

export interface IUserJobInfo {
  key: string;
  value: string | ISocialLinks;
}

export interface IUserJob {
  keyOne?: string;
  keyTwo?: string;
  key?: string;
  value?: string | INotificationSettings | IUserDocument;
}

export interface EmailJob {
  receiverEmail: string;
  template: string;
  subject: string;
}

export interface IAllUsers {
  users: IUserDocument[];
  totalUsers: number;
}
