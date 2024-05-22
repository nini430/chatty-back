import { IUserDocument } from '@user/interfaces/user.interface';
import UserModel from '@user/models/user.model';
import mongoose from 'mongoose';


export async function createUser(data: IUserDocument): Promise<void> {
   await UserModel.create(data);
}

export async function getUserByAuthId(authId: string) {
  return UserModel.findOne({authId});
}

export async function getUserById(userId: string) {
  return UserModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      }
    },
    {
      $lookup:{
        from: 'auths',
        localField: 'authId',
        foreignField: '_id',
        as:'authInfo'
      }
    },
    {
      $unwind: '$authInfo'
    },
    {
      $project: {
        _id: 1,
        username: '$authInfo.username',
        email: '$authInfo.email',
        password: '$authInfo.password',
        avatarColor: '$authInfo.avatarColor',
        uId: '$authInfo.uId',
        postsCount: 1,
        work: 1,
        quote: 1,
        school: 1,
        location: 1,
        blocked: 1,
        blockedBy: 1,
        followersCount: 1,
        followingCount: 1,
        bgImageVersion: 1,
        bgImageId: 1,
        profilePicture: 1,
        notifications: 1,
        social: 1,
        createdAt: 1,
        passwordResetToken: 1,
        passwordResetExpires: 1,

      }
    }
  ]);
}

