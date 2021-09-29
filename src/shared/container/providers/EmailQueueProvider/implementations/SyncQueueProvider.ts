import { IDeliverMessageJob } from '../dtos/IEmailQueueDTO';
import { IJob, IMailQueueProvider } from '../models/IMailQueueProvider';

export class SyncQueueProvider implements IMailQueueProvider {
  private jobs: IDeliverMessageJob[] = [];

  async addManyJobs(jobs: IDeliverMessageJob[]): Promise<void> {
    this.jobs.push(...jobs);
  }

  async addJob(job: IDeliverMessageJob): Promise<void> {
    this.jobs.push(job);
  }

  process(processFunction: (job: IJob) => Promise<void>): void {
    this.jobs.forEach((job, index) => {
      processFunction({ data: job });
      this.jobs.splice(index, 1);
    });
  }
}
