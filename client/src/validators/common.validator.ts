import { TaskPriorityEnum, TaskStatusEnum } from '@/constants';
import { z } from 'zod';

export const nameSchema = z
  .string({ required_error: 'Name is Required' })
  .trim()
  .min(2, 'Name should be at least 2 characters long')
  .max(50, 'Name should be less than 50 characters');

export const emailSchema = z
  .string({ required_error: 'Please enter your email address' })
  .trim()
  .min(1, 'Email address is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string({ required_error: 'Please enter your password' })
  .trim()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Include at least one uppercase letter (A-Z)')
  .regex(/[a-z]/, 'Include at least one lowercase letter (a-z)')
  .regex(/[0-9]/, 'Include at least one number (0-9)')
  .regex(/[@$!%*?&#]/, 'Include at least one special character (@$!%*?&#)');

export const titleSchema = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .max(50, 'Title should be less then 50 characters');

export const descriptionSchema = z
  .string()
  .trim()
  .max(500, 'Description should be less then 500 characters')
  .optional();

export const assignedToSchema = z
  .string()
  .trim()
  .min(1, 'Assigned To is required')
  .optional()
  .nullable();

export const prioritySchema = z.enum(
  Object.values(TaskPriorityEnum) as [string, ...string[]],
  { required_error: 'Priority is required' }
);

export const statusSchema = z.enum(
  Object.values(TaskStatusEnum) as [string, ...string[]],
  { required_error: 'Status is required' }
);

export const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || !isNaN(Date.parse(val)), {
    message: 'Due date must be a valid date string (e.g., YYYY-MM-DD)',
  });

export const emojiSchema = z.string().trim().optional();
