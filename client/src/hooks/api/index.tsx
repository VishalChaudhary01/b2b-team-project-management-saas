/* eslint-disable @typescript-eslint/no-explicit-any */
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { CustomError } from '@/types/custom-error.type';
import { AllProjectRequest } from '@/types/project.type';
import {
  getAllTasksQueryFn,
  getAllWorkspacesUserIsMemberQueryFn,
  getCurrentUserQueryFn,
  getMembersInWorkspaceQueryFn,
  getProjectAnalyticsQueryFn,
  getProjectByIdQueryFn,
  getProjectsInWorkspaceQueryFn,
  getWorkspaceByIdQueryFn,
} from '@/lib/api';
import { Filters } from '@/components/workspace/project/task/TaskTable';

export const useAuth = () => {
  const query = useQuery({
    queryKey: ['auth-user'],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: 2,
  });

  return query;
};

export const useGetWorkspace = (workspaceId: string) => {
  const query = useQuery<any, CustomError>({
    queryKey: ['workspace', workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
    staleTime: 0,
    retry: 2,
    enabled: !!workspaceId,
  });

  return query;
};

export const useGetWorkspaceMembers = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ['members', workspaceId],
    queryFn: () => getMembersInWorkspaceQueryFn(workspaceId),
    staleTime: Infinity,
  });

  return query;
};

export const useGetUserWorkspaces = () => {
  const query = useQuery({
    queryKey: ['user-workspaces'],
    queryFn: () => getAllWorkspacesUserIsMemberQueryFn(),
    staleTime: Infinity,
  });

  return query;
};

export const useGetProjectsInWorkspace = ({
  workspaceId,
  pageSize,
  pageNumber,
  skip = false,
}: AllProjectRequest) => {
  const query = useQuery({
    queryKey: ['all-projects', workspaceId, pageNumber, pageSize],
    queryFn: () =>
      getProjectsInWorkspaceQueryFn({
        workspaceId,
        pageNumber,
        pageSize,
      }),
    staleTime: Infinity,
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  });

  return query;
};

export const useGetProjectAnalytics = (
  workspaceId: string,
  projectId: string
) => {
  const query = useQuery({
    queryKey: ['project-analytics', projectId],
    queryFn: () => getProjectAnalyticsQueryFn({ workspaceId, projectId }),
    staleTime: 0,
    enabled: !!projectId,
  });

  return query;
};

export const useGetProjectById = (workspaceId: string, projectId: string) => {
  const query = useQuery({
    queryKey: ['project', projectId],
    queryFn: () =>
      getProjectByIdQueryFn({
        workspaceId,
        projectId,
      }),
    staleTime: Infinity,
    enabled: !!projectId,
    placeholderData: keepPreviousData,
  });
  return query;
};

interface UseGetAllTasksType {
  workspaceId: string;
  pageSize?: number;
  pageNumber?: number;
  filters?: Filters;
  projectId?: string;
}

export const useGetAllTasks = ({
  workspaceId,
  projectId,
  pageSize,
  pageNumber,
  filters,
}: UseGetAllTasksType) => {
  const query = useQuery({
    queryKey: [
      'all-tasks',
      workspaceId,
      pageSize,
      pageNumber,
      filters,
      projectId,
    ],
    queryFn: () =>
      getAllTasksQueryFn({
        workspaceId,
        keyword: filters?.keyword,
        priority: filters?.priority,
        status: filters?.status,
        projectId: projectId || filters?.projectId,
        assignedTo: filters?.assigneeId,
        pageNumber,
        pageSize,
      }),
    staleTime: 0,
    enabled: !!workspaceId,
  });
  return query;
};
