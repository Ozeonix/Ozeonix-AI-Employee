import { Request, Response, NextFunction } from 'express';
import { WhatsAppService } from '../../../integrations/whatsapp/WhatsAppService.js';
import { sendMessageSchema, webhookEventSchema } from './dto/whatsapp.dto.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { prisma } from '../../config/database.js';

export class WhatsAppController {
  private whatsappService: WhatsAppService;

  constructor(whatsappService = new WhatsAppService()) {
    this.whatsappService = whatsappService;
  }

  public getSessionStatus = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const status = this.whatsappService.getStatus();
      res.status(200).json({
        success: true,
        message: 'WhatsApp Session Status',
        data: status,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public sendMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = sendMessageSchema.parse(req.body);
      const companyId = req.tenantId!;

      // 1. Dispatch WhatsApp Message with retry architecture
      const result = await this.whatsappService.sendMessage({
        toPhone: validated.toPhone,
        messageType: validated.messageType,
        content: validated.content,
        mediaUrl: validated.mediaUrl,
      });

      // 2. Synchronize Contact
      const customer = await prisma.customer.upsert({
        where: { phone: validated.toPhone },
        update: {},
        create: {
          companyId,
          tenantId: companyId,
          name: `Customer (${validated.toPhone})`,
          phone: validated.toPhone,
          status: 'LEAD',
        },
      });

      // 3. Find or Create Conversation
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
            assignedUserId: req.user.id,
            channel: 'WHATSAPP',
            status: 'OPEN',
            lastMessageAt: new Date(),
          },
        });
      }

      // 4. Store Outgoing Message in PostgreSQL
      const message = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          tenantId: companyId,
          senderType: 'USER',
          senderId: req.user.id,
          messageType: validated.messageType,
          content: validated.content,
          mediaUrl: validated.mediaUrl,
          externalId: result.externalMessageId,
          status: 'SENT',
        },
      });

      res.status(200).json({
        success: true,
        message: 'WhatsApp message sent successfully',
        data: {
          externalId: result.externalMessageId,
          messageId: message.id,
          conversationId: conversation.id,
          customerPhone: validated.toPhone,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public handleIncomingWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = webhookEventSchema.parse(req.body);
      const defaultCompany = await prisma.company.findFirst();
      const companyId = defaultCompany?.id || 'demo-tenant-id';

      const result = await this.whatsappService.processIncomingWebhookEvent(
        {
          eventId: `evt_${Date.now()}`,
          eventType: 'MESSAGE_RECEIVED',
          fromPhone: validated.fromPhone,
          toPhone: '+917483509984',
          timestamp: new Date(),
          messageType: validated.messageType,
          content: validated.content,
          mediaUrl: validated.mediaUrl,
          externalMessageId: validated.externalMessageId || `wam_in_${Date.now()}`,
          rawPayload: req.body,
        },
        companyId
      );

      res.status(200).json({
        success: true,
        message: 'Incoming WhatsApp event processed & stored',
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };
}
