import { AuthJob } from '@auth/interfaces/auth.interface';
import { addJob, processJob, startQueue } from './base.queue';
import { saveAuthToDbWorker } from '@workers/auth.worker';


const authQueue = startQueue('auth');


export const addAuthUserJob = async(name: string, data: AuthJob)=>{
  processJob(name, 5, saveAuthToDbWorker, authQueue);
  addJob(name, data, authQueue);
};