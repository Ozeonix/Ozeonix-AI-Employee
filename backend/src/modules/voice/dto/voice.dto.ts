import { z } from 'zod';

export const initiateVoiceCallSchema = z.object({
  toPhone: z.string().min(10, 'Valid phone number is required'),
  agentRole: z.enum(['RECEPTIONIST', 'SALES_AGENT', 'SUPPORT_SPECIALIST']).default('RECEPTIONIST'),
  initialGreeting: z.string().optional(),
});

export type InitiateVoiceCallInput = z.infer<typeof initiateVoiceCallSchema>;
