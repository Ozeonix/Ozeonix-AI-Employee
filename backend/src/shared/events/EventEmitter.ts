import { EventEmitter as NodeEventEmitter } from 'events';
import { logger } from '../../config/logger.js';

export class AppEventEmitter extends NodeEventEmitter {
  public publish(event: string, payload: any) {
    logger.info(`⚡ Event Published: [${event}]`, { payload });
    this.emit(event, payload);
  }

  public subscribe(event: string, handler: (payload: any) => Promise<void> | void) {
    this.on(event, async (payload) => {
      try {
        await handler(payload);
      } catch (err: any) {
        logger.error(`❌ Error in Event Handler for [${event}]: ${err.message}`);
      }
    });
  }
}

export const eventBus = new AppEventEmitter();
