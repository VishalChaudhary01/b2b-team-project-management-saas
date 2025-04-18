import {
  BaseEntity,
  BaseResponse,
  BaseUser,
  PaginatedResponse,
} from './common.type';

export interface Project extends BaseEntity {
  name: string;
  emoji: string;
  description: string;
  workspace: string;
  createdBy: BaseUser;
}

// Request Types
export interface CreateProjectRequest {
  workspaceId: string;
  data: Pick<Project, 'emoji' | 'name' | 'description'>;
}

export interface EditProjectRequest extends CreateProjectRequest {
  projectId: string;
}

export interface AllProjectRequest {
  workspaceId: string;
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  skip?: boolean;
}

export interface ProjectByIdRequest {
  workspaceId: string;
  projectId: string;
}

// Response Types
export type CreateProjectResponse = BaseResponse<{ project: Project }>;
export type EditProjectResponse = CreateProjectResponse;
export type DeleteProjectResponse = BaseResponse<void>;
export type AllProjectResponse = PaginatedResponse<Project[]>;
export type ProjectByIdResponse = CreateProjectResponse;
