import { sendEmail } from '@services/email/mail.transport';
import {DoneCallback, Job} from 'bull';
import { createLogger } from '../../config';
import Logger from 'bunyan';

const log : Logger = createLogger('email');

export const emailProcessJob=async(job: Job, done: DoneCallback)=>{
  const {receiverEmail, subject, template}=job.data;
    try{
      await sendEmail(receiverEmail, subject, template);
      job.progress(100);
      done(null, job.data);
    }catch(err) {
      log.error(err);
      done(err as Error);
    }
};

