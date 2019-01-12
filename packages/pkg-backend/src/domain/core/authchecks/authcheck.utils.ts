import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AccessPermissionsEntity } from '../../access-permissions/model/access-permissions.entity';

function hasRole(requestingEntity: AccessPermissionsEntity, qualifyingRole: string): boolean {
  return !!requestingEntity.roles && requestingEntity.roles.includes(qualifyingRole);
}

function isSystemAdmin(authorization: AccessPermissionsEntity): boolean {
  return authorization.roles.includes(Roles.staffAdmin);
}

function isStaffAdmin(authorization: AccessPermissionsEntity): boolean {
  return authorization.roles.includes(Roles.staffAdmin) || authorization.roles.includes(Roles.systemAdmin);
}

function hasOrganization(authorization: AccessPermissionsEntity, organizationIDForResource: string): boolean {
  return (
    !!authorization.organizations &&
    !!authorization.organizations.find(organizationAuth => {
      return organizationAuth.orgId === organizationIDForResource;
    })
  );
}

function hasOrganizationRole(accessPermissions: AccessPermissionsEntity, organizationIDForResource: string, qualifyingRoles: string[]): boolean {
  return (
    !!accessPermissions.organizations &&
    !!accessPermissions.organizations.find(organizationAuth => {
      return (
        // tslint:disable-next-line:triple-equals
        organizationAuth.orgId == organizationIDForResource && qualifyingRoles.some(role => organizationAuth.organizationRoles.includes(role))
      );
    })
  );
}

export { hasRole, isStaffAdmin, isSystemAdmin, hasOrganization, hasOrganizationRole };
