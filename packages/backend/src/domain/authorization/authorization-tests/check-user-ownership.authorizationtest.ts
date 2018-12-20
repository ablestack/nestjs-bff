import { OrganizationRoles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AuthorizationTest } from './authorization-test.abstract';
import { hasOrganizationRole, isSystemAdmin } from './authorization-test.utils';
import { IAuthorizationTestData } from './authorizationTestData.interface';

export class CheckUserOwnership extends AuthorizationTest {
  constructor() {
    super();
  }

  public async isAuthorized(data: IAuthorizationTestData): Promise<boolean> {
    if (!data.requestingEntity) throw Error('No authenticated User found');
    if (!data.userIdForTargetResource) throw Error('userIdForTargetResource can not be null');

    console.log({
      'data.requestingEntity.userId': data.requestingEntity.userId,
      'data.userIdForTargetResource': data.userIdForTargetResource,
    });

    // if self, then true
    // tslint:disable-next-line:triple-equals
    if (data.requestingEntity.userId == data.userIdForTargetResource) return true;

    // if system admin, then true
    if (isSystemAdmin(data.requestingEntity)) return true;

    // if org admin, then true
    return hasOrganizationRole(data.requestingEntity, data.userIdForTargetResource, [OrganizationRoles.admin]);
  }
}
