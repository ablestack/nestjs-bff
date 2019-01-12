export class AccessPermissionsContract {
  userId?: string;
  roles: string[] = [];
  organizations?: UserOrgPermissionsContract[];
}
export class UserOrgPermissionsContract {
  primary?: boolean;
  orgId?: string;
  organizationRoles: string[] = [];
}
