import { createBaseCache } from './base.cache';


const redisConnection=async()=>{
  const {client, log}= createBaseCache('redisConnection');

  try{
    await client.connect();
    const response = await client.ping();
    log.info(`${response} redis`);
  }catch(err) {
    log.error('Error connecting to the redis');
  }
};

export default redisConnection;
