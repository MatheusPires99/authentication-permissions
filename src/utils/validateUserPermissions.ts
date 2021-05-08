import { PermissionsOptions, User } from '../types';

type ValidateUserPermissionsParams = PermissionsOptions & {
  user: Pick<User, 'permissions' | 'roles'>;
};

export const validateUserPermissions = ({
  user,
  permissions,
  roles,
}: ValidateUserPermissionsParams) => {
  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.every(permission => {
      return user.permissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length > 0) {
    const hasAllRoles = roles.some(role => {
      return user.roles.includes(role);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
};
