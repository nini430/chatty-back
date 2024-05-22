import connectDB from '../../setupDatabase';
import { createLogger, validateConfig } from 'config';
import http from 'http';
import startSocketIO from './socket';
import Logger from 'bunyan';
import { Application } from 'express';

const log: Logger = createLogger('server');

const SERVICE_PORT = 7000;

export default function startHttpServer(app: Application) {
  const httpServer: http.Server = new http.Server(app);
  httpServer.listen(SERVICE_PORT, async () => {
    validateConfig();
    await connectDB();
    startSocketIO(httpServer);
    log.info(`Server running on port ${SERVICE_PORT} on process ${process.pid}`);
  });
}
