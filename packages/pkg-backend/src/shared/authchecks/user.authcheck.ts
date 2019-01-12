import { OrganizationRoles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AppError } from '../exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { hasOrganizationRole, isStaffAdmin } from './authcheck.utils';
import { AuthorizationCheckParams } from './authorization-params';
import { ScopedData } from './scoped-data';

export class UserAuthCheck extends AuthCheckContract<ScopedData, any> {
  constructor() {
    super();
  }

  public async isAuthorized(params: AuthorizationCheckParams<ScopedData, any>): Promise<boolean> {
    if (!params || !params.targetResource || !params.targetResource.userIdForTargetResource) throw new AppError('userIdForTargetResource can not be null');

    if (!params.accessPermissions) return false;

    // if self, then true
    // tslint:disable-next-line:triple-equals - necessary because requestingEntity.userId is actually an mongoId that evaluates to a string
    if (params.accessPermissions.userId == params.targetResource.userIdForTargetResource) return true;

    // if system admin, then true
    if (isStaffAdmin(params.accessPermissions)) return true;

    // if doesn't have orgId, can't verify access through org scope.  Return false
    if (!params.targetResource.orgIdForTargetResource) return false;

    // if org admin, then true
    return hasOrganizationRole(params.accessPermissions, params.targetResource.orgIdForTargetResource, [OrganizationRoles.facilitator, OrganizationRoles.admin]);
  }
}
