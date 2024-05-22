import {compare, hash} from 'bcryptjs';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import {model, Schema} from 'mongoose';

const SALT_ROUND = 10;

const authSchema = new Schema<IAuthDocument>({
  username: {type: String},
  uId: {type: String},
  email: {type: String},
  avatarColor: {type: String},
  password: {type: String},
  createdAt: {type: Date, default: Date.now},
  passwordResetToken: {type: String, default: ''},
  passwordResetExpires: {type: Number}
},{
  toJSON: {
    transform(_doc, ret) {
      delete ret.password;
      return ret;
    },
  }
});

authSchema.pre('save', async function(this, next) {
  const hashedPassword = await hash(this.password!, SALT_ROUND);
  this.password = hashedPassword;
  next();
});

authSchema.methods.comparePassword=async function(password: string): Promise<boolean> {
  const isPasswordCorrect = await compare(password, this.password);
  return isPasswordCorrect;
};

authSchema.methods.hashPassword = async function(password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};

const authModel = model<IAuthDocument>('Auth', authSchema);
export default authModel;
