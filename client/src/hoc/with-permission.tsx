import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PermissionType } from '@/constants';
import { useAuthContext } from '@/context/auth-provider';
import useWorkspaceId from '@/hooks/use-workspace-id';

export const withPermission = (
  WrappedComponent: React.ComponentType,
  requiredPermission: PermissionType
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const WithPermission = (props: any) => {
    const { user, hasPermission, isLoading } = useAuthContext();
    const navigate = useNavigate();
    const workspaceId = useWorkspaceId();

    useEffect(() => {
      if (!user || !hasPermission(requiredPermission)) {
        navigate(`/workspace/${workspaceId}`);
      }
    }, [user, hasPermission, navigate, workspaceId]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    // Check if user has the required permission
    if (!user || !hasPermission(requiredPermission)) {
      return;
    }
    // If the user has permission, render the wrapped component
    return <WrappedComponent {...props} />;
  };
  return WithPermission;
};
