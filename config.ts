import dotenv from 'dotenv';
import bunyan from 'bunyan';
dotenv.config({});
import Logger from 'bunyan';

export const createLogger = (name: string) => {
  return bunyan.createLogger({ name, level: 'debug' });
};

export const config = {
  databaseUrl: process.env.DATABASE_URL || '',
  token: process.env.JWT_TOKEN || '',
  env: process.env.NODE_ENV || 'development',
  secretKeyOne: process.env.SECRET_KEY_ONE || '',
  secretKeyTwo: process.env.SECRET_KEY_TWO || '',
  clientUrl: process.env.CLIENT_URL,
  redisHost: process.env.REDIS_HOST
};

const log: Logger = createLogger('config');

export const validateConfig = () => {
  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      throw new Error(`Configuration for ${key} is undefined`);
    }
  }
  log.info('ALl good validating config');
};
