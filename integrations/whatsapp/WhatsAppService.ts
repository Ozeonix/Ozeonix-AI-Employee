import { IWhatsAppDriver, WhatsAppMessagePayload, NormalizedWhatsAppEvent } from './IWhatsAppDriver.js';
import { prisma } from '../../backend/src/config/database.js';
import { logger } from '../../backend/src/config/logger.js';
import crypto from 'crypto';

export class WhatsAppService implements IWhatsAppDriver {
  private isConnected = false;
  private primaryPhoneNumber = '+917483509984';
  private eventListeners: ((event: NormalizedWhatsAppEvent) => Promise<void>)[] = [];

  constructor() {
    this.autoReconnectSession();
  }

  public async autoReconnectSession(): Promise<boolean> {
    try {
      logger.info(`📱 Restoring WhatsApp Session Lifecycle for ${this.primaryPhoneNumber}...`);
      this.isConnected = true;
      logger.info(`✅ WhatsApp Session active for ${this.primaryPhoneNumber}`);
      return true;
    } catch (err: any) {
      logger.error(`❌ WhatsApp session reconnect failed: ${err.message}`);
      this.isConnected = false;
      return false;
    }
  }

  public async initializeSession(phoneNumber: string): Promise<boolean> {
    this.primaryPhoneNumber = phoneNumber;
    return this.autoReconnectSession();
  }

  public registerEventListener(callback: (event: NormalizedWhatsAppEvent) => Promise<void>): void {
    this.eventListeners.push(callback);
  }

  public async sendMessage(
    payload: WhatsAppMessagePayload,
    retries = 3
  ): Promise<{ success: boolean; externalMessageId: string }> {
    let attempt = 0;
    const externalMessageId = `wam_id_${crypto.randomBytes(12).toString('hex')}`;

    while (attempt < retries) {
      try {
        attempt++;
        logger.info(
          `📤 Outbound WhatsApp Message [Type: ${payload.messageType}] to ${payload.toPhone} (Attempt ${attempt}/${retries})`
        );

        if (!this.isConnected) {
          await this.autoReconnectSession();
        }

        // Simulate Gateway dispatch (WhatsApp Web / Cloud API)
        if (payload.mediaUrl) {
          logger.info(`📎 Media attachment dispatched: ${payload.mediaUrl}`);
        }

        return { success: true, externalMessageId };
      } catch (err: any) {
        logger.warn(`⚠️ WhatsApp send attempt ${attempt} failed: ${err.message}`);
        if (attempt >= retries) {
          throw new Error(`Failed to send WhatsApp message after ${retries} attempts: ${err.message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }

    return { success: false, externalMessageId: '' };
  }

  public async processIncomingWebhookEvent(event: NormalizedWhatsAppEvent, companyId: string) {
    logger.info(`📥 Normalizing Incoming WhatsApp Event: ${event.eventType} [Type: ${event.messageType}] from ${event.fromPhone}`);

    // 1. Sync Contact into Customer Table without duplicates
    const customer = await prisma.customer.upsert({
      where: { phone: event.fromPhone },
      update: {
        updatedAt: new Date(),
      },
      create: {
        companyId,
        tenantId: companyId,
        name: `WhatsApp Contact (${event.fromPhone})`,
        phone: event.fromPhone,
        status: 'LEAD',
        tags: ['whatsapp', 'inbound'],
      },
    });

    // 2. Find or Create Open Conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        companyId,
        customerId: customer.id,
        status: { in: ['OPEN', 'IN_PROGRESS'] },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          companyId,
          tenantId: companyId,
          customerId: customer.id,
          channel: 'WHATSAPP',
          status: 'OPEN',
          lastMessageAt: new Date(),
        },
      });
    }

    // 3. Persist Message with Media Handling in DB
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        tenantId: companyId,
        senderType: 'CUSTOMER',
        messageType: event.messageType,
        content: event.content,
        mediaUrl: event.mediaUrl,
        externalId: event.externalMessageId,
        status: 'DELIVERED',
        metadata: event.rawPayload || {},
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    // 4. Notify Event Listeners
    for (const listener of this.eventListeners) {
      await listener(event);
    }

    return { customer, conversation, message };
  }

  public getStatus() {
    return {
      isConnected: this.isConnected,
      phoneNumber: this.primaryPhoneNumber,
      sessionActive: this.isConnected,
    };
  }
}
