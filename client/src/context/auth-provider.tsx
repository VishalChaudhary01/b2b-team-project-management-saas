import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PermissionType } from '@/constants';
import { useAuth } from '@/hooks/api';
import usePermissions from '@/hooks/use-permissions';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { useGetWorkspace } from '@/hooks/api';
import { User } from '@/types/user.type';
import { Workspace } from '@/types/workspace.type';

type AuthContextType = {
  user?: User;
  workspace?: Workspace;
  hasPermission: (permission: PermissionType) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  workspaceLoading: boolean;
  refetchAuth: () => void;
  refetchWorkspace: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();

  const {
    data: authData,
    error: authError,
    isLoading,
    isFetching,
    refetch: refetchAuth,
  } = useAuth();

  const user = authData?.user;

  const {
    data: workspaceData,
    isLoading: workspaceLoading,
    error: workspaceError,
    refetch: refetchWorkspace,
  } = useGetWorkspace(workspaceId);

  const workspace = workspaceData?.workspace;

  useEffect(() => {
    if (workspaceError) {
      if (workspaceError.errorCode === 'ACCESS_UNAUTHORIZED') {
        navigate('/');
      }
    }
  }, [navigate, workspaceError]);

  const permissions = usePermissions(user, workspace);

  const hasPermission = (permission: PermissionType): boolean => {
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        hasPermission,
        error: authError || workspaceError,
        isLoading,
        isFetching,
        workspaceLoading,
        refetchAuth,
        refetchWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useCurrentUserContext must be used within a AuthProvider');
  }
  return context;
};
