import { IUserDocument } from '@user/interfaces/user.interface';
import mongoose, { Model, Schema } from 'mongoose';


const userSchema = new Schema<IUserDocument>({
  authId: {type: mongoose.Schema.Types.ObjectId, ref: 'Auth', index: true},
  profilePicture: {type: String, default: ''},
  postsCount: {type: Number, default: 0},
  followersCount: {type: Number, default: 0},
  followingCount: {type: Number, defautl: 0},
  blocked: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
  blockedBy: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
  notifications: {
    messages: {type: Boolean, default: true},
    reactions: {type: Boolean, default: true},
    comments: {type: Boolean, default: true},
    follows: { type: Boolean, default: true},
  },
  social: {
    instagram: {type: String, default: ''},
    facebook: {type: String, default: ''},
    twitter: {type: String,default: ''},
    youtube: {type: String, default : ''}
  },
  work: {type: String, default: ''},
  school: {type: String, default: ''},
  location: {type: String, default: ''},
  quote: {type: String, default: ''},
  bgImageId: {type: String, default: ''},
  bgImageVersion: {type: String, default: ''}

});

const UserModel: Model<IUserDocument> = mongoose.model('User', userSchema, 'users');

export default UserModel;
