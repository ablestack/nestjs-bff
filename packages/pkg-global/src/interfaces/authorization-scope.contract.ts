export abstract class AuthorizationScopeContract {
  userId?: string;
  roles: string[] = [];
  organizations?: UserOrgCredentialsContract[];
}

export abstract class UserOrgCredentialsContract {
  primary?: boolean;
  orgId?: string;
  organizationRoles: string[] = [];
}
