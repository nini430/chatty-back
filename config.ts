import dotenv from 'dotenv';
import bunyan from 'bunyan';
dotenv.config({});
import Logger from 'bunyan';
import cloudinary from 'cloudinary';

export const createLogger = (name: string) => {
  return bunyan.createLogger({ name, level: 'debug' });
};

export const config = {
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  env: process.env.NODE_ENV || 'development',
  secretKeyOne: process.env.SECRET_KEY_ONE || '',
  secretKeyTwo: process.env.SECRET_KEY_TWO || '',
  clientUrl: process.env.CLIENT_URL,
  redisHost: process.env.REDIS_HOST,
  cloudinaryName: process.env.CLOUDINARY_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  senderEmail: process.env.SENDER_EMAIL || '',
  senderPassword: process.env.SENDER_PASSWORD || '',
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  sendgridSender: process.env.SENDGRID_SENDER || ''


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


export const cloudinaryConfig=()=> {
  cloudinary.v2.config({
    cloud_name: config.cloudinaryName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
  });

  log.info('Cloudinary configured');
};


