import mongoose from 'mongoose';
import { config, createLogger } from 'config';
import Logger from 'bunyan';
import redisConnection from '@services/redis/redis.connection';

const log: Logger = createLogger('database');

export default async function() {
     const connect=async()=>{
        try{
            await  mongoose.connect(config.databaseUrl);
            log.info('Mongo connected successfully');
            await redisConnection();
        }catch(err) {
            log.error('Error connecting to the database');
            process.exit(1);
        }
     };

     connect();

     mongoose.connection.on('disconnect', ()=>{
        connect();
    });
}






