import connectDB from '../../setupDatabase';
import { createLogger, validateConfig } from 'config';
import http from 'http';
import startSocketIO from './socket';
import Logger from 'bunyan';

const log: Logger = createLogger('server');

const SERVICE_PORT = 5000;

export default function startHttpServer() {
  const httpServer: http.Server = new http.Server();
  httpServer.listen(SERVICE_PORT, async () => {
    validateConfig();
    await connectDB();
    startSocketIO(httpServer);
    log.info(`Server running on port ${SERVICE_PORT} on process ${process.pid}`);
  });
}
