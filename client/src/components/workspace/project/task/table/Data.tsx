import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  HelpCircle,
  Timer,
  View,
} from 'lucide-react';
import { TaskPriorityEnum, TaskStatusEnum } from '@/constants';
import { transformOptions } from '@/lib/utils';

const statusIcons = {
  [TaskStatusEnum.BACKLOG]: HelpCircle,
  [TaskStatusEnum.TODO]: Circle,
  [TaskStatusEnum.IN_PROGRESS]: Timer,
  [TaskStatusEnum.IN_REVIEW]: View,
  [TaskStatusEnum.DONE]: CheckCircle,
};

const priorityIcons = {
  [TaskPriorityEnum.LOW]: ArrowDown,
  [TaskPriorityEnum.MEDIUM]: ArrowRight,
  [TaskPriorityEnum.HIGH]: ArrowUp,
};

export const statuses = transformOptions(
  Object.values(TaskStatusEnum),
  statusIcons
);

export const priorities = transformOptions(
  Object.values(TaskPriorityEnum),
  priorityIcons
);
