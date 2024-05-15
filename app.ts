import express, { Application, Request, Response } from 'express';
import 'express-async-errors';
import { StatusCodes } from 'http-status-codes';

import securityMiddleware from '@middlewares/security-middleware';
import standardMiddleware from '@middlewares/standard-middleware';
import startHttpServer from '@utils/start-http';
import errorHandler from '@middlewares/error-handler';
import router from './routes';

const app: Application = express();

standardMiddleware(app);
securityMiddleware(app);
app.use('/api/v1', router);

app.all('*', (req: Request, res: Response) => {
  return res.status(StatusCodes.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
});

app.use(errorHandler);

startHttpServer();
