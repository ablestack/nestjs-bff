import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { AuthorizationTest } from './authorization-test.abstract';
import { hasOrganization, isSystemAdmin } from './authorization-test.utils';

export class CheckOrgMembership extends AuthorizationTest {
  constructor() {
    super();
  }

  public async isAuthorized(requestingEntity?: AuthorizationEntity, organizationIdForTargetResource?: string): Promise<boolean> {
    if (!requestingEntity) throw Error('No authenticated User found');
    if (!organizationIdForTargetResource) throw Error('organizationSlugForRequestedResource can not be null');

    if (isSystemAdmin(requestingEntity)) return true;
    return hasOrganization(requestingEntity, organizationIdForTargetResource);
  }
}
