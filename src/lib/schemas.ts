import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const todoSchema = z.object({
  item: z.string().min(1, 'Item is required')
});

export const todoFiltersSchema = z.object({
  status: z.enum(['all', 'completed', 'pending']).optional(),
  search: z.string().optional(),
  userId: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type TodoInput = z.infer<typeof todoSchema>;
export type TodoFiltersInput = z.infer<typeof todoFiltersSchema>;