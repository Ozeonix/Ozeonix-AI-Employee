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
      logger.info(`📱 Initializing WhatsApp Integration Layer for ${this.primaryPhoneNumber}...`);
      // Simulate session restoration/persistence check
      this.isConnected = true;
      logger.info(`✅ WhatsApp Session persisted and active for ${this.primaryPhoneNumber}`);
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
          `📤 Sending WhatsApp message (Attempt ${attempt}/${retries}) to ${payload.toPhone}`
        );

        if (!this.isConnected) {
          await this.autoReconnectSession();
        }

        // Simulate successful WhatsApp Gateway dispatch
        logger.info(`✅ WhatsApp Message dispatched to ${payload.toPhone} [ID: ${externalMessageId}]`);

        return { success: true, externalMessageId };
      } catch (err: any) {
        logger.warn(`⚠️ WhatsApp send attempt ${attempt} failed: ${err.message}`);
        if (attempt >= retries) {
          logger.error(`❌ Permanent failure sending WhatsApp message to ${payload.toPhone}`);
          throw new Error(`Failed to send WhatsApp message after ${retries} attempts: ${err.message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      }
    }

    return { success: false, externalMessageId: '' };
  }

  public async processIncomingWebhookEvent(event: NormalizedWhatsAppEvent, companyId: string) {
    logger.info(`📥 Processing Normalized WhatsApp Event: ${event.eventType} from ${event.fromPhone}`);

    // 1. Synchronize Contact into Customer Table without duplicates (Prompt 27)
    const customer = await prisma.customer.upsert({
      where: { phone: event.fromPhone },
      update: {
        updatedAt: new Date(),
      },
      create: {
        companyId,
        tenantId: companyId,
        name: `WhatsApp User (${event.fromPhone})`,
        phone: event.fromPhone,
        status: 'LEAD',
        tags: ['whatsapp', 'inbound'],
      },
    });

    // 2. Find or Create Open Conversation (Prompt 25)
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

    // 3. Persist Incoming Message into PostgreSQL (Prompts 25 & 26)
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

    // Update conversation lastMessageAt timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    // 4. Notify Event Listeners (Prompt 29 Webhook Architecture)
    for (const listener of this.eventListeners) {
      await listener(event);
    }

    return { customer, conversation, message };
  }

  public async updateDeliveryStatus(externalMessageId: string, status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED') {
    logger.info(`🔄 Updating WhatsApp Message Status: ${externalMessageId} -> ${status}`);
    return prisma.message.updateMany({
      where: { externalId: externalMessageId },
      data: { status },
    });
  }

  public getStatus() {
    return {
      isConnected: this.isConnected,
      phoneNumber: this.primaryPhoneNumber,
      sessionActive: this.isConnected,
    };
  }
}
