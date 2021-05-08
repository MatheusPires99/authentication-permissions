export type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

export type PermissionsOptions = {
  permissions?: string[];
  roles?: string[];
};
