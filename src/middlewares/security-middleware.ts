import { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import { StatusCodes } from 'http-status-codes';
import { config } from 'config';

export default function securityMiddleware(app: Application) {
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: config.clientUrl,
      credentials: true,
      optionsSuccessStatus: StatusCodes.OK,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
}
