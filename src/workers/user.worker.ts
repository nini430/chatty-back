import { createUser } from '@services/db/user.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { createLogger } from '../../config';

const log: Logger = createLogger('user');

export const saveUserToDbWorker=async(job: Job, done: DoneCallback)=>{
  const {value}=job.data;
  try{
    await createUser(value);
    job.progress(100);
    done(null, job.data);
  }catch(err) {
    log.error(err);
    done(err as Error);
  }
};