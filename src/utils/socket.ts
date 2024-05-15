import http from 'http'
import {Server} from 'socket.io';
import {createClient} from 'redis';
import {createAdapter} from '@socket.io/redis-adapter';
import { config, createLogger } from 'config';
import Logger from 'bunyan';

const log: Logger = createLogger('socket');

export default async function startSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server  = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }
    });

    const pubClient = createClient({url: config.redisHost} as any);
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    log.info('socket server has started');
    return io;
}

function socketIOConnections(socket: Server) {}

