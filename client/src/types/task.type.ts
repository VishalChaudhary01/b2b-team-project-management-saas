import {
  BaseEntity,
  BaseResponse,
  BaseUser,
  PaginatedResponse,
  ZodInfer,
} from './common.type';
import {
  createTaskSchema,
  updateTaskSchema,
} from '@/validators/task.validator';
import { TaskPriorityEnumType, TaskStatusEnumType } from '@/constants/index';

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  project?: {
    _id: string;
    emoji: string;
    name: string;
  };
  priority: TaskPriorityEnumType;
  status: TaskStatusEnumType;
  assignedTo: BaseUser | null;
  createdBy?: string;
  dueDate: string;
  taskCode: string;
}

export type CreateTaskInput = ZodInfer<typeof createTaskSchema>;
export type UpdateTaskInput = ZodInfer<typeof updateTaskSchema>;

// Request Types
export interface CreateTaskRequest {
  workspaceId: string;
  projectId: string;
  data: CreateTaskInput;
}

export interface UpdateTaskRequest {
  workspaceId: string;
  projectId: string;
  data: UpdateTaskInput;
}

export interface AllTaskRequest {
  workspaceId: string;
  projectId?: string | null;
  keyword?: string | null;
  priority?: TaskPriorityEnumType | null;
  status?: TaskStatusEnumType | null;
  assignedTo?: string | null;
  dueDate?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
}

export interface DeleteTaskRequest {
  workspaceId: string;
  taskId: string;
}

// Response Types
export type CreateTaskResponse = BaseResponse<{ task: Task }>;
export type UpdateTaskResponse = CreateTaskResponse;
export type DeleteTaskResponse = BaseResponse<void>;
export type AllTaskResponse = PaginatedResponse<Task[]>;
