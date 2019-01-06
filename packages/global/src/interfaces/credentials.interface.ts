export interface IUserCredentials {
  userId?: string;
  roles: string[];
  organizations?: IUserOrgCredentials[];
}

export interface IUserOrgCredentials {
  primary?: boolean;
  orgId?: string;
  organizationRoles: string[];
}
