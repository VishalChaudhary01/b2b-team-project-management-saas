import API from './axios-client';
import {
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '@/types/user.type';
import {
  AllMembersInWorkspaceResponse,
  AllWorkspaceResponse,
  AnalyticsResponse,
  ChangeWorkspaceMemberRoleRequest,
  ChangeWorkspaceMemberRoleResponse,
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  DeleteWorkspaceResponse,
  EditWorkspaceRequest,
  EditWorkspaceResponse,
  InvitedUserJoinWorkspaceResponse,
  WorkspaceByIdResponse,
} from '@/types/workspace.type';
import {
  AllProjectRequest,
  AllProjectResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  DeleteProjectResponse,
  EditProjectRequest,
  EditProjectResponse,
  ProjectByIdRequest,
  ProjectByIdResponse,
} from '@/types/project.type';
import {
  AllTaskRequest,
  AllTaskResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  DeleteTaskRequest,
  DeleteTaskResponse,
} from '@/types/task.type';

/************ AUTH API ************/
export const loginMutationFn = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await API.post('/auth/login', data);
  return response.data;
};

export const registerMutationFn = async (data: RegisterRequest) =>
  await API.post('/auth/register', data);

export const logoutMutationFn = async () => await API.post('/auth/logout');

/************ USER API ************/
export const getCurrentUserQueryFn = async (): Promise<CurrentUserResponse> => {
  const response = await API.get('/user/current');
  return response.data;
};

/************ WORKSPACE API ************/
export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceRequest
): Promise<CreateWorkspaceResponse> => {
  const response = await API.post('/workspace/create/new', data);
  return response.data;
};

export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: EditWorkspaceRequest): Promise<EditWorkspaceResponse> => {
  const response = await API.put(`/workspace/update/${workspaceId}`, data);
  return response.data;
};

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponse> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };

export const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<WorkspaceByIdResponse> => {
  const response = await API.get(`/workspace/${workspaceId}`);
  return response.data;
};

export const getMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponse> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};

export const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponse> => {
  const response = await API.get(`/workspace/analytics/${workspaceId}`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: ChangeWorkspaceMemberRoleRequest): Promise<ChangeWorkspaceMemberRoleResponse> => {
  const response = await API.put(
    `/workspace/change/member/role/${workspaceId}`,
    data
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<DeleteWorkspaceResponse> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`);
  return response.data;
};

/************ MEMBER API ************/
export const invitedUserJoinWorkspaceMutationFn = async (
  iniviteCode: string
): Promise<InvitedUserJoinWorkspaceResponse> => {
  const response = await API.post(`/member/workspace/${iniviteCode}/join`);
  return response.data;
};

/************ PROJECT API ************/
export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: CreateProjectRequest): Promise<CreateProjectResponse> => {
  const response = await API.post(
    `/project/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const editProjectMutationFn = async ({
  projectId,
  workspaceId,
  data,
}: EditProjectRequest): Promise<EditProjectResponse> => {
  const response = await API.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageSize = 10,
  pageNumber = 1,
}: AllProjectRequest): Promise<AllProjectResponse> => {
  const response = await API.get(
    `/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdRequest): Promise<ProjectByIdResponse> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}`
  );
  return response.data;
};

export const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdRequest): Promise<AnalyticsResponse> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}/analytics`
  );
  return response.data;
};

export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdRequest): Promise<DeleteProjectResponse> => {
  const response = await API.delete(
    `/project/${projectId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

/************ TASKS API ************/
export const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: CreateTaskRequest): Promise<CreateTaskResponse> => {
  const response = await API.post(
    `/task/project/${projectId}/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const getAllTasksQueryFn = async ({
  workspaceId,
  keyword,
  projectId,
  assignedTo,
  priority,
  status,
  dueDate,
  pageNumber,
  pageSize,
}: AllTaskRequest): Promise<AllTaskResponse> => {
  const baseUrl = `/task/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append('keyword', keyword);
  if (projectId) queryParams.append('projectId', projectId);
  if (assignedTo) queryParams.append('assignedTo', assignedTo);
  if (priority) queryParams.append('priority', priority);
  if (status) queryParams.append('status', status);
  if (dueDate) queryParams.append('dueDate', dueDate);
  if (pageNumber) queryParams.append('pageNumber', pageNumber?.toString());
  if (pageSize) queryParams.append('pageSize', pageSize?.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await API.get(url);
  return response.data;
};

export const deleteTaskMutationFn = async ({
  workspaceId,
  taskId,
}: DeleteTaskRequest): Promise<DeleteTaskResponse> => {
  const response = await API.delete(
    `task/${taskId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};
