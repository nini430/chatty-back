import express, { Application, Request, Response } from 'express';
import 'express-async-errors';
import { StatusCodes } from 'http-status-codes';

import securityMiddleware from '@middlewares/security-middleware';
import standardMiddleware from '@middlewares/standard-middleware';
import startHttpServer from '@utils/start-http';
import errorHandler from '@middlewares/error-handler';
import router from './routes';
import { cloudinaryConfig } from 'config';
import { serverAdapter } from '@queues/base.queue';

const app: Application = express();

standardMiddleware(app);
securityMiddleware(app);
cloudinaryConfig();


app.use('/api/v1', router);


app.use('/queues', serverAdapter.getRouter());

app.all('*', (req: Request, res: Response) => {
  return res.status(StatusCodes.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
});

app.use(errorHandler);

startHttpServer(app);

