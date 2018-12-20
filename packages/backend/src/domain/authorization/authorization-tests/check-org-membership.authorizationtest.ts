import { AuthorizationTest } from './authorization-test.abstract';
import { hasOrganization, isSystemAdmin } from './authorization-test.utils';
import { IAuthorizationTestData } from './authorizationTestData.interface';

export class CheckOrgMembership extends AuthorizationTest {
  constructor() {
    super();
  }

  public async isAuthorized(data: IAuthorizationTestData): Promise<boolean> {
    if (!data.requestingEntity) throw Error('No authenticated User found');
    if (!data.organizationIdForTargetResource) throw Error('organizationSlugForRequestedResource can not be null');

    if (isSystemAdmin(data.requestingEntity)) return true;
    return hasOrganization(data.requestingEntity, data.organizationIdForTargetResource);
  }
}
