import { z } from 'zod';
import {
  assignedToSchema,
  descriptionSchema,
  dueDateSchema,
  prioritySchema,
  statusSchema,
  titleSchema,
} from './common.validator';

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});

export const updateTaskSchema = createTaskSchema.partial();
