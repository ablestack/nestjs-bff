import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { AuthorizationTest } from './authorization-test.abstract';
import { hasOrganizationRole, isSystemAdmin } from './authorization-test.utils';

export class CheckOrgRoles extends AuthorizationTest {
  constructor(private readonly qualifyingRoles: string[]) {
    super();
  }

  public async isAuthorized(requestingEntity?: AuthorizationEntity, organizationIdForTargetResource?: string): Promise<boolean> {
    if (!requestingEntity) throw Error('No authenticated User found');
    if (!organizationIdForTargetResource) throw Error('organizationIdForTargetResource can not be null');

    if (isSystemAdmin(requestingEntity)) return true;
    return hasOrganizationRole(requestingEntity, organizationIdForTargetResource, this.qualifyingRoles);
  }
}
