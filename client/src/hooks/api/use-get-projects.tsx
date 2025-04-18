import { getProjectsInWorkspaceQueryFn } from '@/lib/api';
import { AllProjectRequest } from '@/types/project.type';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const useGetProjectsInWorkspaceQuery = ({
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

export default useGetProjectsInWorkspaceQuery;
