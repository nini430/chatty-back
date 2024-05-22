import { createAuth } from '@services/db/auth.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { createLogger } from 'config';

const log: Logger = createLogger('auth');

export const saveAuthToDbWorker=async(job: Job, done: DoneCallback)=>{
  try{
    const {value}=job.data;
    await createAuth(value);
    job.progress(100);
    done(null, job.data);
  }catch(err) {
    log.error(err);
    done(err as Error);
  }
};