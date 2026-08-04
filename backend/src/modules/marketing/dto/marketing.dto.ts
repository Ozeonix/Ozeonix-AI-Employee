import { z } from 'zod';

export const createCampaignSchema = z.object({
  title: z.string().min(1, 'Campaign title is required'),
  targetTag: z.string().optional(),
  templateId: z.string().optional(),
  messageContent: z.string().min(1, 'Message content is required'),
  scheduledAt: z.string().optional(), // ISO date string for scheduled broadcast
});

export const createTemplateSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['MARKETING', 'UTILITY', 'AUTHENTICATION']).default('MARKETING'),
  bodyText: z.string().min(1),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
