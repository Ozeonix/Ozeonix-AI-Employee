import { z } from 'zod';

export const createEmployeeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(8),
  department: z.string().min(1),
  designation: z.string().min(1),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).default('EMPLOYEE'),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const logActivitySchema = z.object({
  action: z.string().min(1),
  details: z.record(z.any()).optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type LogActivityInput = z.infer<typeof logActivitySchema>;
