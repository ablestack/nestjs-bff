export abstract class AccessPermissionsContract {
  userId?: string;
  roles: string[] = [];
  organizations?: UserOrgPermissionsContract[];
}

export abstract class UserOrgPermissionsContract {
  primary?: boolean;
  orgId?: string;
  organizationRoles: string[] = [];
}
