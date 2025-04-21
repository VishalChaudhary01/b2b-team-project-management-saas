import { BaseEntity, BaseResponse, BaseUser, ZodInfer } from './common.type';
import {
  createWorkspaceSchema,
  editWorkspaceSchema,
} from '@/validators/workspace.validator';
import { Role } from './user.type';

export interface WorkspaceBasic extends BaseEntity {
  name: string;
  owner: string;
  inviteCode: string;
}

export interface Workspace extends WorkspaceBasic {
  description?: string;
}

export interface WorkspaceWithMembers extends Workspace {
  members: Member[];
}

export interface Member extends BaseEntity {
  userId: BaseUser;
  workspaceId: string;
  role: Role;
  joinedAt: string;
}

export interface WorkspaceAnalytics {
  totalTasks: number;
  overdueTasks: number;
  completedTasks: number;
}

export type CreateWorkspaceInput = ZodInfer<typeof createWorkspaceSchema>;
export type EditWorkspaceInput = ZodInfer<typeof editWorkspaceSchema>;

// Request Types

export type CreateWorkspaceRequest = CreateWorkspaceInput;

export interface EditWorkspaceRequest {
  workspaceId: string;
  data: EditWorkspaceInput;
}

export interface ChangeWorkspaceMemberRoleRequest {
  workspaceId: string;
  data: {
    roleId: string;
    memberId: string;
  };
}

// Response Types

export type CreateWorkspaceResponse = BaseResponse & {
  workspace: Workspace;
};

export type EditWorkspaceResponse = CreateWorkspaceResponse;

export type AllWorkspaceResponse = BaseResponse & {
  workspaces: Workspace[];
};

export type WorkspaceByIdResponse = BaseResponse & {
  workspace: WorkspaceWithMembers;
};

export type ChangeWorkspaceMemberRoleResponse = BaseResponse & {
  member: Member;
};

export type DeleteWorkspaceResponse = BaseResponse & {
  currentWorkspace: string;
};

export type InvitedUserJoinWorkspaceResponse = BaseResponse & {
  workspaceId: string;
};

export type AllMembersInWorkspaceResponse = BaseResponse & {
  members: Member[];
  roles: Role[];
};

export type AnalyticsResponse = BaseResponse & {
  analytics: WorkspaceAnalytics;
};
