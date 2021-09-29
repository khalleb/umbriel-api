import { IDeliverMessageJob } from '../dtos/IEmailQueueDTO';

export interface IJob {
  data: IDeliverMessageJob;
}

export interface IMailQueueProvider {
  addJob(job: IDeliverMessageJob): Promise<void>;
  addManyJobs(jobs: IDeliverMessageJob[]): Promise<void>;
  process(processFunction: (job: IJob) => Promise<void>): void;
}
