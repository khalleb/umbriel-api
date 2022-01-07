import { IDeliverMessageJob } from '../dtos/IEmailQueueDTO';

interface IJob {
  data: IDeliverMessageJob;
}

interface IMailQueueProvider {
  addJob(job: IDeliverMessageJob): Promise<void>;
  addManyJobs(jobs: IDeliverMessageJob[]): Promise<void>;
  process(processFunction: (job: IJob) => Promise<void>): void;
}

export { IMailQueueProvider, IJob };
