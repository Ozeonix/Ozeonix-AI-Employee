import { WhatsAppService } from '../../../integrations/whatsapp/WhatsAppService.js';
import { GeminiProvider } from '../../../ai/GeminiProvider.js';
import { PromptManager } from '../../../ai/PromptManager.js';
import { ConversationMemory } from '../../../ai/ConversationMemory.js';
import { logger } from '../../config/logger.js';

export class WhatsAppAutoResponderService {
  private whatsappService: WhatsAppService;
  private aiProvider: GeminiProvider;
  private promptManager: PromptManager;
  private memory: ConversationMemory;

  constructor() {
    this.whatsappService = new WhatsAppService();
    this.aiProvider = new GeminiProvider();
    this.promptManager = new PromptManager();
    this.memory = new ConversationMemory();
  }

  public async handleInboundAndAutoReply(fromPhone: string, textContent: string, companyId: string) {
    logger.info(`🤖 Auto-Responder triggered for incoming message from ${fromPhone}`);

    // 1. Process and save incoming WhatsApp message
    const { conversation } = await this.whatsappService.processIncomingWebhookEvent(
      {
        eventId: `evt_${Date.now()}`,
        eventType: 'MESSAGE_RECEIVED',
        fromPhone,
        toPhone: '+917483509984',
        timestamp: new Date(),
        messageType: 'TEXT',
        content: textContent,
        externalMessageId: `wam_in_${Date.now()}`,
      },
      companyId
    );

    // 2. Fetch past conversation context (Memory)
    const history = await this.memory.getConversationContext(conversation.id, 10);

    // 3. Compile prompt template (e.g. Sales / Customer Support AI Employee)
    const compiled = this.promptManager.compilePrompt('ai-sales-employee-v1', {
      customerName: `Customer (${fromPhone})`,
      productName: 'Ozeonix Platform',
      userQuery: textContent,
    });

    // 4. Generate Human-Like AI Response using Gemini API
    const aiResult = await this.aiProvider.generateResponse(compiled.userPrompt, history, {
      systemInstruction: compiled.systemPrompt,
    });

    // 5. Automatically send AI response back to customer via WhatsApp
    const sendResult = await this.whatsappService.sendMessage({
      toPhone: fromPhone,
      messageType: 'TEXT',
      content: aiResult.text,
    });

    // 6. Record Outgoing AI Message in Database Memory
    await this.memory.recordMessage(
      conversation.id,
      companyId,
      'AI_EMPLOYEE',
      aiResult.text,
      {
        externalId: sendResult.externalMessageId,
        modelUsed: aiResult.modelUsed,
        tokenUsage: aiResult.tokenUsage,
        autoReplied: true,
      }
    );

    logger.info(`✅ Auto-replied to ${fromPhone} via WhatsApp: "${aiResult.text.substring(0, 50)}..."`);
    return { conversationId: conversation.id, aiResponse: aiResult.text };
  }
}
