import { getCurrentUserHandler } from '@auth/controllers/current-user';
import { signinHandler } from '@auth/controllers/signin';
import { signoutHandler } from '@auth/controllers/signout';
import signupHandler from '@auth/controllers/signup';
import { authMiddleware } from '@middlewares/auth-middleware';
import { checkAuth } from '@middlewares/check-auth';
import express from 'express';


const authRouter = express.Router();


authRouter.post('/signup', signupHandler);
authRouter.post('/signin', signinHandler);


authRouter.post('/signout', authMiddleware, checkAuth, signoutHandler);
authRouter.get('/current-user', authMiddleware, checkAuth, getCurrentUserHandler);

export default authRouter;
