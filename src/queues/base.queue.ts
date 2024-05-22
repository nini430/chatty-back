import Queue, {Job, ProcessCallbackFunction, Queue as QueueType} from 'bull';
import { config, createLogger } from 'config';
import Logger from 'bunyan';
import {ExpressAdapter} from '@bull-board/express';
import {BullAdapter} from '@bull-board/api/bullAdapter';
import {createBullBoard} from '@bull-board/api';
import { AuthJob } from '@auth/interfaces/auth.interface';
import { IUserJob } from '@user/interfaces/user.interface';

type IBaseQueueData = AuthJob | IUserJob;

let bullAdapters: BullAdapter[]=[];

export let serverAdapter: ExpressAdapter;

export const startQueue=(queueName: string)=>{
  const log: Logger = createLogger(queueName);

  log.info(`Starting the queue: ${queueName}`);

  const queue = new Queue(queueName, config.redisHost!);

  bullAdapters.push(new  BullAdapter(queue));
  bullAdapters= [...new Set(bullAdapters)];


  serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/queues');

  createBullBoard({
    queues: bullAdapters,
    serverAdapter
  });

  queue.on('completed', (job: Job)=>{
    job.remove();
  });

  queue.on('global:completed', (jobId: string)=>{
    log.info(`Job with id ${jobId} is completed`);
  });

  queue.on('global:stalled', (jobId: string)=>{
      log.info(`Job with id ${jobId} is stalled`);
  });

  return queue;
};


export const addJob=(name: string, data: IBaseQueueData, queue: QueueType)=>{
  queue.add(name, data);
};

export const processJob=(name: string, concurrency: number, cb: ProcessCallbackFunction<void>, queue: QueueType)=>{
  queue.process(name, concurrency, cb);
};

