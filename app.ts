import express, {Application, Request, Response} from 'express';
import 'express-async-errors';

import securityMiddleware from './src/middlewares/security-middleware';
import standardMiddleware from './src/middlewares/standard-middleware';
import startHttpServer from './src/utils/start-http';
import router from './routes';
import { StatusCodes } from 'http-status-codes';
import errorHandler from 'src/middlewares/error-handler';

const app: Application = express();

standardMiddleware(app);
securityMiddleware(app);
app.use('/api/v1',router);

app.all('*', (req: Request, res: Response)=>{
    return res.status(StatusCodes.NOT_FOUND).json({message: `${req.originalUrl} not found`});
})

app.use(errorHandler)

startHttpServer();

