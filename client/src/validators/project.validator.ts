import { z } from 'zod';
import { descriptionSchema, emojiSchema, nameSchema } from './common.validator';

export const createProjectSchema = z.object({
  emoji: emojiSchema,
  name: nameSchema,
  description: descriptionSchema,
});

export const editProjectSchema = createProjectSchema.partial();
