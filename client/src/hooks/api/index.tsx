/* eslint-disable @typescript-eslint/no-explicit-any */
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { CustomError } from '@/types/custom-error.type';
import { AllProjectRequest } from '@/types/project.type';
import {
  getAllWorkspacesUserIsMemberQueryFn,
  getCurrentUserQueryFn,
  getMembersInWorkspaceQueryFn,
  getProjectAnalyticsQueryFn,
  getProjectsInWorkspaceQueryFn,
  getWorkspaceByIdQueryFn,
} from '@/lib/api';

export const useAuth = () => {
  const query = useQuery({
    queryKey: ['authUser'],
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
    queryKey: ['userWorkspaces'],
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
    queryKey: ['allProjects', workspaceId, pageNumber, pageSize],
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
