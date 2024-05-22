import {Response} from 'express';
import { StatusCodes } from 'http-status-codes';
import { getUserCache } from '@services/redis/user.cache';
import { getUserById } from '@services/db/user.service';
import '@auth/interfaces/auth.interface';


export async function getCurrentUserHandler(req: any, res: Response) {
  let isUser= false;
  let token= '';
  let user= null;

  const cachedUser = await getUserCache(`${req.currentUser.userId}`);

  const existingUser = cachedUser? cachedUser: await getUserById(req.currentUser.userId);

  if(Object.keys(existingUser).length) {
    isUser = true;
    token = req.session?.jwt;
    user = existingUser;
  }

  return res.status(StatusCodes.OK).json({token, isUser, user});
}