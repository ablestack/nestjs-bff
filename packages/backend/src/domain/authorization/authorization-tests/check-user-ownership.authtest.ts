import { OrganizationRoles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { AuthorizationTest } from './authorization-test.abstract';
import { hasOrganizationRole, isSystemAdmin } from './authorization-test.utils';

export class CheckUserOwnership extends AuthorizationTest {
  constructor() {
    super();
  }

  public async isAuthorized(requestingEntity?: AuthorizationEntity, userIdForTargetResource?: string): Promise<boolean> {
    if (!requestingEntity) throw Error('No authenticated User found');
    if (!userIdForTargetResource) throw Error('userIdForTargetResource can not be null');

    // if self, then true
    if (requestingEntity.userId === userIdForTargetResource) return true;

    // if system admin, then true
    if (isSystemAdmin(requestingEntity)) return true;

    // if org admin, then true
    return hasOrganizationRole(requestingEntity, userIdForTargetResource, [OrganizationRoles.admin]);
  }
}
