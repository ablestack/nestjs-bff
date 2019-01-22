import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AccessPermissionsContract } from '@nestjs-bff/global/lib/interfaces/access-permissions.contract';

function hasRole(requestingEntity: AccessPermissionsContract, qualifyingRole: string): boolean {
  return !!requestingEntity.roles && requestingEntity.roles.includes(qualifyingRole);
}

function isSystemAdmin(authorization: AccessPermissionsContract): boolean {
  return authorization.roles.includes(Roles.staffAdmin);
}

function isStaffAdmin(authorization: AccessPermissionsContract): boolean {
  return authorization.roles.includes(Roles.staffAdmin) || authorization.roles.includes(Roles.systemAdmin);
}

function hasOrganization(authorization: AccessPermissionsContract, organizationIDForResource: string): boolean {
  return (
    !!authorization.organizations &&
    !!authorization.organizations.find(organizationAuth => {
      return !!organizationAuth.orgId && organizationAuth.orgId.toString() === organizationIDForResource.toString();
    })
  );
}

function hasOrganizationRole(accessPermissions: AccessPermissionsContract, organizationIDForResource: string, qualifyingRoles: string[]): boolean {
  return (
    !!accessPermissions.organizations &&
    !!accessPermissions.organizations.find(organizationAuth => {
      return (
        // tslint:disable-next-line:triple-equals
        !!organizationAuth.orgId &&
        organizationAuth.orgId.toString() === organizationIDForResource.toString() &&
        qualifyingRoles.some(role => organizationAuth.organizationRoles.includes(role))
      );
    })
  );
}

export { hasRole, isStaffAdmin, isSystemAdmin, hasOrganization, hasOrganizationRole };
