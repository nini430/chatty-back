import { IUserJob } from '@user/interfaces/user.interface';
import { addJob, processJob, startQueue } from './base.queue';
import { saveUserToDbWorker } from '@workers/user.worker';


const userQueue= startQueue('user');


export async function addUserJob(name: string, data: IUserJob) {
  processJob(name, 5, saveUserToDbWorker, userQueue);
  addJob(name, data, userQueue);
}