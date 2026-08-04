import { z } from 'zod';

export const generateAiResponseSchema = z.object({
  conversationId: z.string().uuid('Valid conversationId UUID is required'),
  userPrompt: z.string().min(1, 'User prompt is required'),
  templateId: z.string().optional(),
  templateVariables: z.record(z.string()).optional(),
  modelName: z.string().optional(),
});

export type GenerateAiResponseInput = z.infer<typeof generateAiResponseSchema>;
