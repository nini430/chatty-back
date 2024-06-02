import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { signinSchema } from '@auth/schemes/signin';
import { getUserByUsername, signToken } from '@services/db/auth.service';
import { BadRequestError } from '@errors/bad-request-error';
import { getUserByAuthId } from '@services/db/user.service';
import { JoiValidationError } from '@errors/joi-validation-error';

export async function signinHandler(req: Request, res: Response) {
  const {error} = await Promise.resolve(signinSchema.validate(req.body));
  if(error?.details) {
    throw new JoiValidationError(error?.details?.[0].message);
  }
  const {username, password}=req.body;
  const existingUser = await getUserByUsername(username);
  if(!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const isPasswordCorrect = await existingUser.comparePassword(password);
  if(!isPasswordCorrect) {
    throw new BadRequestError('Invalid credentials');
  }

  const user = await getUserByAuthId(existingUser.id) as any;
  if(!user) {
    throw new BadRequestError('Invalid credentials');
  }


  const token = signToken({
    uId: existingUser.uId,
    username: existingUser.username,
    email: existingUser.email,
    avatarColor: existingUser.avatarColor
  }, user.id);

  const userDocument = {
    ...user,
    authId: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    avatarColor: existingUser.avatarColor,
    createdAt: existingUser.createdAt,
    uId: existingUser.uId,
  };

  req.session = {jwt: token};
  return res.status(StatusCodes.OK).json({message:'User logged in successfully', data: userDocument, token});
}

