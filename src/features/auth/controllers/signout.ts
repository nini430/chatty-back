import {Request, Response} from 'express';
import { StatusCodes } from 'http-status-codes';


export async function signoutHandler(req: Request, res: Response) {
  req.session = null;

  return res.status(StatusCodes.OK).json({message: 'User logged out successfully', user: {}, token: ''});
}

