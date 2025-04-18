import { z } from 'zod';
import { descriptionSchema, nameSchema } from './common.validator';

export const createWorkspaceSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();
