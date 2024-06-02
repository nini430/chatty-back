import { EmailJob } from '@user/interfaces/user.interface';
import { addJob, processJob, startQueue } from './base.queue';
import { emailProcessJob } from '@workers/email.worker';


const emailQueue = startQueue('email');


export const startEmailQueue=(name: string, data: EmailJob)=>{
    addJob(name, data, emailQueue);
    processJob(name, 5, emailProcessJob, emailQueue);
};



