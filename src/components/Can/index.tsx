import { ReactNode } from 'react';

import { usePermissions } from '../../hooks';

type CarProps = {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
};

export const Can = ({ children, permissions, roles }: CarProps) => {
  const userCanSeeComponent = usePermissions({
    permissions,
    roles,
  });

  if (!userCanSeeComponent) {
    return null;
  }

  return <>{children}</>;
};
