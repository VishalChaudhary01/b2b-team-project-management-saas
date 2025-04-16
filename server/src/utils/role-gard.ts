import { PermissionType } from '@enums/role.enum';
import { RolePermissions } from './role-permission';
import { UnauthorizedException } from './appError';

export const roleGuard = (
  role: keyof typeof RolePermissions,
  requiredPermissions: PermissionType[]
) => {
  const permissions = RolePermissions[role];
  const hasPermission = requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );
  if (!hasPermission) {
    throw new UnauthorizedException(
      'You do not have the necessary permissions to perform this action'
    );
  }
};
