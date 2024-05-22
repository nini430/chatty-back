import { createClient } from 'redis';
import Logger from 'bunyan';
import {config, createLogger} from '../../../config';


export const createBaseCache=(cacheName: string)=>{
  const client = createClient({url: config.redisHost});
  const log: Logger = createLogger(cacheName);

  return { client, log };
};

