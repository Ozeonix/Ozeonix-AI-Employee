import { prisma } from '../backend/src/config/database.js';

export interface ChatHistoryMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
}

export class ConversationMemory {
  public async getConversationContext(
    conversationId: string,
    limit = 10
  ): Promise<ChatHistoryMessage[]> {
    const messages = await prisma.message.findMany({
      where: { conversationId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Reverse to chronological order (oldest first)
    return messages.reverse().map((msg) => ({
      role: msg.senderType === 'CUSTOMER' ? 'user' : 'model',
      content: msg.content,
      timestamp: msg.createdAt,
    }));
  }

  public async recordMessage(
    conversationId: string,
    tenantId: string,
    senderType: 'CUSTOMER' | 'USER' | 'AI_EMPLOYEE' | 'SYSTEM',
    content: string,
    metadata = {}
  ) {
    return prisma.message.create({
      data: {
        conversationId,
        tenantId,
        senderType,
        messageType: 'TEXT',
        content,
        status: 'DELIVERED',
        metadata,
      },
    });
  }
}
