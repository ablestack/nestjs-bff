import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';

function hasRole(requestingEntity: AuthorizationEntity, qualifyingRole: string): boolean {
  return !!requestingEntity.roles && requestingEntity.roles.includes(qualifyingRole);
}

function isSystemAdmin(authorization: AuthorizationEntity): boolean {
  return authorization.roles.includes(Roles.systemAdmin);
}

function hasOrganization(authorization: AuthorizationEntity, organizationIDForResource: string): boolean {
  return !!authorization.organizations.find(organizationAuth => {
    return organizationAuth.organizationId === organizationIDForResource;
  });
}

function hasOrganizationRole(authorization: AuthorizationEntity, organizationIDForResource: string, qualifyingRoles: string[]): boolean {
  return !!authorization.organizations.find(organizationAuth => {
    return (
      // tslint:disable-next-line:triple-equals
      organizationAuth.organizationId == organizationIDForResource &&
      qualifyingRoles.some(role => organizationAuth.organizationRoles.includes(role))
    );
  });
}

export { hasRole, isSystemAdmin, hasOrganization, hasOrganizationRole };
