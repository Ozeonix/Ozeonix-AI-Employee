import { WhatsAppMessagePayload } from './IWhatsAppDriver.js';
import { WhatsAppService } from './WhatsAppService.js';
import { logger } from '../../backend/src/config/logger.js';

export interface QueuedWhatsAppMessage {
  id: string;
  payload: WhatsAppMessagePayload;
  attempts: number;
  maxAttempts: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  queuedAt: Date;
}

export class WhatsAppMessageQueueService {
  private static queue: QueuedWhatsAppMessage[] = [];
  private static whatsappService = new WhatsAppService();

  public static async enqueueMessage(payload: WhatsAppMessagePayload, maxAttempts = 3): Promise<string> {
    const id = `wam_queue_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const item: QueuedWhatsAppMessage = {
      id,
      payload,
      attempts: 0,
      maxAttempts,
      status: 'PENDING',
      queuedAt: new Date(),
    };

    logger.info(`📥 Enqueueing Outgoing WhatsApp Message to ${payload.toPhone} (Queue ID: ${id})`);
    this.queue.push(item);

    // Process asynchronously
    setImmediate(() => this.processNextQueueItem(item));
    return id;
  }

  private static async processNextQueueItem(item: QueuedWhatsAppMessage) {
    item.status = 'PROCESSING';
    item.attempts++;

    try {
      logger.info(`⚙️ Processing Queued WhatsApp Message ID: ${item.id} (Attempt ${item.attempts}/${item.maxAttempts})`);
      const result = await this.whatsappService.sendMessage(item.payload, 1);

      if (result.success) {
        item.status = 'COMPLETED';
        this.queue = this.queue.filter((q) => q.id !== item.id);
        logger.info(`✅ Successfully dispatched Queued WhatsApp Message ID: ${item.id}`);
      }
    } catch (err: any) {
      logger.warn(`⚠️ Queued WhatsApp Message ID ${item.id} failed: ${err.message}`);
      if (item.attempts >= item.maxAttempts) {
        item.status = 'FAILED';
        logger.error(`❌ Permanent queue failure for WhatsApp Message ID: ${item.id}`);
      } else {
        item.status = 'PENDING';
        const delay = Math.pow(2, item.attempts) * 1000;
        setTimeout(() => this.processNextQueueItem(item), delay);
      }
    }
  }

  public static getQueueStats() {
    return {
      pending: this.queue.filter((q) => q.status === 'PENDING').length,
      processing: this.queue.filter((q) => q.status === 'PROCESSING').length,
      failed: this.queue.filter((q) => q.status === 'FAILED').length,
      totalInQueue: this.queue.length,
    };
  }
}
