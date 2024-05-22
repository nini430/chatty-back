import authRouter from '@auth/routes/auth.routes';
import {Router} from 'express';

const router: Router = Router();


router.use('/auth', authRouter);

export default router;
