import {Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'config';
import { UnauthorizedError } from '@errors/unauthorized';


export async function authMiddleware(req: any, _res: Response, next: NextFunction) {
   const token = req.session?.jwt;
   if(!token) {
    throw new UnauthorizedError('token is not available, please login again');
   }

   try{
    const payload = jwt.verify(token, config.jwtSecret);
    req.currentUser = payload;
   }catch(err) {
    throw new UnauthorizedError('Token is invalid, please login again');
   }

   next();
}