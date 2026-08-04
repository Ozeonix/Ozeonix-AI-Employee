import { z } from 'zod';

export const sendMessageSchema = z.object({
  toPhone: z.string().min(10, 'Valid phone number is required'),
  messageType: z.enum(['TEXT', 'IMAGE', 'DOCUMENT', 'AUDIO', 'VIDEO']).default('TEXT'),
  content: z.string().min(1, 'Message content is required'),
  mediaUrl: z.string().url().optional(),
});

export const webhookEventSchema = z.object({
  fromPhone: z.string().min(10),
  messageType: z.enum(['TEXT', 'IMAGE', 'DOCUMENT', 'AUDIO', 'VIDEO']).default('TEXT'),
  content: z.string().min(1),
  mediaUrl: z.string().optional(),
  externalMessageId: z.string().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type WebhookEventInput = z.infer<typeof webhookEventSchema>;
