import { BaseEntity, BaseResponse, ZodInfer } from './common.type';
import { loginSchema, registerSchema } from '@/validators/auth.validator';
import { WorkspaceBasic } from './workspace.type';
import { PermissionType } from '@/constants';

export interface User extends BaseEntity {
  name: string;
  email: string;
  profilePicture: string | null;
  isActive: boolean;
  lastLogin: string | null;
  currentWorkspace: WorkspaceBasic;
}

export interface Role extends BaseEntity {
  name: string;
  permissions?: PermissionType[];
}

export type RegisterInput = ZodInfer<typeof registerSchema>;
export type LoginInput = ZodInfer<typeof loginSchema>;

// Request Type
export type RegisterRequest = RegisterInput;
export type LoginRequest = LoginInput;

// Response Type
export type LoginResponse = BaseResponse & {
  user: Pick<User, '_id' | 'currentWorkspace'>;
};

export type CurrentUserResponse = BaseResponse & {
  user: User;
};
