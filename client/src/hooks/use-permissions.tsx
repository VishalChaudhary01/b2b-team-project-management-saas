import { useEffect, useMemo, useState } from 'react';
import { PermissionType } from '@/constants';
import { User } from '@/types/user.type';
import { WorkspaceWithMembers } from '@/types/workspace.type';

const usePermissions = (
  user: User | undefined,
  workspace: WorkspaceWithMembers
) => {
  const [permissions, setPermissions] = useState<PermissionType[]>([]);
  useEffect(() => {
    if (user && workspace) {
      const member = workspace.members.find(
        (member) => member.userId.toString() === user._id.toString()
      );
      if (member) {
        setPermissions(member.role.permissions || []);
      }
    }
  }, [user, workspace]);

  return useMemo(() => permissions, [permissions]);
};

export default usePermissions;
