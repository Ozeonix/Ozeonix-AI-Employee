import { logger } from '../../config/logger.js';

export interface JobPayload {
  jobId: string;
  name: string;
  data: any;
  delayMs?: number;
}

export class QueueService {
  private static queue: JobPayload[] = [];

  public static async addJob(name: string, data: any, delayMs = 0): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const job: JobPayload = { jobId, name, data, delayMs };

    logger.info(`📥 Queueing Background Job: [${name}] (Job ID: ${jobId})`);
    this.queue.push(job);

    setTimeout(() => {
      this.processJob(job);
    }, delayMs);

    return jobId;
  }

  private static async processJob(job: JobPayload) {
    logger.info(`⚙️ Processing Background Job: [${job.name}] (Job ID: ${job.jobId})`);
    try {
      // Simulate job worker execution
      this.queue = this.queue.filter((j) => j.jobId !== job.jobId);
      logger.info(`✅ Background Job Completed: [${job.name}] (Job ID: ${job.jobId})`);
    } catch (err: any) {
      logger.error(`❌ Background Job Failed: [${job.name}] - ${err.message}`);
    }
  }
}
