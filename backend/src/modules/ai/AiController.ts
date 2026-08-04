import { Request, Response, NextFunction } from 'express';
import { GeminiProvider } from '../../../ai/GeminiProvider.js';
import { PromptManager } from '../../../ai/PromptManager.js';
import { ConversationMemory } from '../../../ai/ConversationMemory.js';
import { generateAiResponseSchema } from './dto/ai.dto.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { prisma } from '../../config/database.js';

export class AiController {
  private aiProvider: GeminiProvider;
  private promptManager: PromptManager;
  private memory: ConversationMemory;

  constructor() {
    this.aiProvider = new GeminiProvider();
    this.promptManager = new PromptManager();
    this.memory = new ConversationMemory();
  }

  public generateResponse = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = generateAiResponseSchema.parse(req.body);
      const companyId = req.tenantId!;

      // 1. Retrieve Conversation Context History (Prompt 33 & 34)
      const history = await this.memory.getConversationContext(validated.conversationId, 10);

      // 2. Resolve System & User Prompt via PromptManager (Prompt 32)
      let systemInstruction;
      let finalPrompt = validated.userPrompt;

      if (validated.templateId) {
        const compiled = this.promptManager.compilePrompt(
          validated.templateId,
          validated.templateVariables || { userQuery: validated.userPrompt }
        );
        systemInstruction = compiled.systemPrompt;
        finalPrompt = compiled.userPrompt;
      }

      // 3. Generate AI Response (Prompt 31, 35, 36, 37)
      const aiResult = await this.aiProvider.generateResponse(finalPrompt, history, {
        modelName: validated.modelName,
        systemInstruction,
      });

      // 4. Record AI Message into PostgreSQL (Prompt 33 & 38)
      const aiMessage = await this.memory.recordMessage(
        validated.conversationId,
        companyId,
        'AI_EMPLOYEE',
        aiResult.text,
        {
          modelUsed: aiResult.modelUsed,
          tokenUsage: aiResult.tokenUsage,
          fallbackTriggered: aiResult.fallbackTriggered,
        }
      );

      // 5. Store Audit Log for AI Usage (Prompt 38)
      await prisma.auditLog.create({
        data: {
          companyId,
          tenantId: companyId,
          userId: req.user?.id || null,
          action: 'AI_RESPONSE_GENERATED',
          entity: 'Message',
          entityId: aiMessage.id,
          newValues: {
            tokenUsage: aiResult.tokenUsage,
            modelUsed: aiResult.modelUsed,
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'AI Employee response generated',
        data: {
          messageId: aiMessage.id,
          response: aiResult.text,
          modelUsed: aiResult.modelUsed,
          tokenUsage: aiResult.tokenUsage,
          fallbackTriggered: aiResult.fallbackTriggered,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public listTemplates = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const templates = this.promptManager.listTemplates();
      res.status(200).json({
        success: true,
        message: 'Prompt templates retrieved',
        data: templates,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };
}
