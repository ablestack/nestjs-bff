import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { UserPermissionsEntity } from '../../authorization/model/user-permissions.entity';

function hasRole(requestingEntity: UserPermissionsEntity, qualifyingRole: string): boolean {
  return !!requestingEntity.roles && requestingEntity.roles.includes(qualifyingRole);
}

function isSystemAdmin(authorization: UserPermissionsEntity): boolean {
  return authorization.roles.includes(Roles.staffAdmin);
}

function isStaffAdmin(authorization: UserPermissionsEntity): boolean {
  return authorization.roles.includes(Roles.staffAdmin) || authorization.roles.includes(Roles.systemAdmin);
}

function hasOrganization(authorization: UserPermissionsEntity, organizationIDForResource: string): boolean {
  return (
    !!authorization.organizations &&
    !!authorization.organizations.find(organizationAuth => {
      return organizationAuth.orgId === organizationIDForResource;
    })
  );
}

function hasOrganizationRole(authorizationScope: UserPermissionsEntity, organizationIDForResource: string, qualifyingRoles: string[]): boolean {
  return (
    !!authorizationScope.organizations &&
    !!authorizationScope.organizations.find(organizationAuth => {
      return (
        // tslint:disable-next-line:triple-equals
        organizationAuth.orgId == organizationIDForResource && qualifyingRoles.some(role => organizationAuth.organizationRoles.includes(role))
      );
    })
  );
}

export { hasRole, isStaffAdmin, isSystemAdmin, hasOrganization, hasOrganizationRole };
