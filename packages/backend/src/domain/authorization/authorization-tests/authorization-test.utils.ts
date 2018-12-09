import { Roles } from '@nestjs-bff/global/lib/lib/constants/roles.constants';
import { AuthorizationEntity } from '@nestjs-bff/global/lib/lib/entities/authorization.entity';

function hasRole(
  requestingEntity: AuthorizationEntity,
  qualifyingRole: string,
): boolean {
  return (
    !!requestingEntity.roles && requestingEntity.roles.includes(qualifyingRole)
  );
}

function isSystemAdmin(authorization: AuthorizationEntity): boolean {
  return authorization.roles.includes(Roles.systemAdmin);
}

export { hasRole, isSystemAdmin };
