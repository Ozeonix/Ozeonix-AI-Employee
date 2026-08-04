import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional(),
  phone: z.string().min(10, 'Valid phone number is required'),
  status: z.enum(['LEAD', 'PROSPECT', 'CUSTOMER', 'ARCHIVED']).default('LEAD'),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).default({}),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const addNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
});

export const searchCustomerSchema = z.object({
  query: z.string().optional(),
  status: z.enum(['LEAD', 'PROSPECT', 'CUSTOMER', 'ARCHIVED']).optional(),
  tag: z.string().optional(),
  page: z.string().transform((val) => parseInt(val, 10)).default('1'),
  limit: z.string().transform((val) => parseInt(val, 10)).default('20'),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type AddNoteInput = z.infer<typeof addNoteSchema>;
