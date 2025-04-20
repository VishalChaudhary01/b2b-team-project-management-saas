import { getAllWorkspacesUserIsMemberQueryFn } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const useGetUserWorkspaces = () => {
  const query = useQuery({
    queryKey: ['userWorkspaces'],
    queryFn: () => getAllWorkspacesUserIsMemberQueryFn(),
    staleTime: Infinity,
  });
  return query;
};

export default useGetUserWorkspaces;
