import { z } from 'zod';

// Email schema
export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .trim()
  .min(1, { message: 'Email cannot be empty' })
  .email('Please enter a valid email address');

// Password schema
export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .trim()
  .min(8, { message: 'Password must be at least 8 characters' })
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[@$!%*?&#]/, 'Password must contain at least one special character');

// Name schema
const nameSchema = z
  .string({ required_error: 'Name is required' })
  .trim()
  .min(2, { message: 'Name must be at least 2 characters' })
  .max(50, { message: 'Name must be under 50 characters' });

// Register schema
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(1, { message: 'Password cannot be empty' }),
});
