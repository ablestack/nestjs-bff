import { AuthorizationTest } from './authorization-test.abstract';
import { hasOrganizationRole, isSystemAdmin } from './authorization-test.utils';
import { IAuthorizationTestData } from './authorizationTestData.interface';

export class CheckOrgRoles extends AuthorizationTest {
  constructor(private readonly qualifyingRoles: string[]) {
    super();
  }

  public async isAuthorized(data: IAuthorizationTestData): Promise<boolean> {
    if (!data.requestingEntity) throw Error('No authenticated User found');
    if (!data.organizationIdForTargetResource) throw Error('organizationIdForTargetResource can not be null');

    if (isSystemAdmin(data.requestingEntity)) return true;
    return hasOrganizationRole(data.requestingEntity, data.organizationIdForTargetResource, this.qualifyingRoles);
  }
}
