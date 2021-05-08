import { useAuth } from './useAuth';
import { PermissionsOptions } from '../types';
import { validateUserPermissions } from '../utils/validateUserPermissions';

export const usePermissions = ({ permissions, roles }: PermissionsOptions) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  });

  return userHasValidPermissions;
};
