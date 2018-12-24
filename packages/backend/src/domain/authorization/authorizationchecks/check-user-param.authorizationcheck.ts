import { OrganizationRoles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AuthorizationCheck } from './authorizationcheck.abstract';
import { hasOrganizationRole, isSystemAdmin } from './authorizationcheck.utils';
import { IAuthorizationCheckData } from './authorizationcheckData.interface';

export class CheckUserParam extends AuthorizationCheck {
  constructor() {
    super();
  }

  public async isAuthorized(data: IAuthorizationCheckData): Promise<boolean> {
    if (!data.requestingEntity) throw Error('No authenticated User found');
    if (!data.userIdForTargetResource) throw Error('userIdForTargetResource can not be null');

    console.log({
      'data.requestingEntity.userId': data.requestingEntity.userId,
      'data.userIdForTargetResource': data.userIdForTargetResource,
    });

    // if self, then true
    // tslint:disable-next-line:triple-equals - necessary because requestingEntity.userId is actually an mongoId that evaluates to a string
    if (data.requestingEntity.userId == data.userIdForTargetResource) return true;

    // if system admin, then true
    if (isSystemAdmin(data.requestingEntity)) return true;

    // if org admin, then true
    return hasOrganizationRole(data.requestingEntity, data.userIdForTargetResource, [OrganizationRoles.admin]);
  }
}
