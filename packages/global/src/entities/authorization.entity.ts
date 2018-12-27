import { Roles } from '../constants/roles.constants';
import { IEntity } from '../interfaces/entity.interface';

export class AuthorizationEntity implements IEntity {
  id?: any;
  userId?: string;
  roles: string[] = [Roles.user];
  organizations: OrganizationAuthorization[] = [];
}

export class OrganizationAuthorization {
  primary: boolean = false;
  orgId: string = '';
  organizationRoles: string[] = [];
}
