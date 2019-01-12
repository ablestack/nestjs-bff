import { OrganizationRoles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AppError } from '../exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { hasOrganizationRole, isStaffAdmin } from './authcheck.utils';
import { AuthorizationCheckParams } from './authorization-params';
import { ScopedData } from './scoped-data';

export class UserAccessAuthCheck extends AuthCheckContract<ScopedData, any> {
  constructor() {
    super();
  }

  public async isAuthorized(params: AuthorizationCheckParams<ScopedData, any>): Promise<boolean> {
    if (!params || !params.targetResource || !params.targetResource.userId) throw new AppError('userId can not be null');

    if (!params.accessPermissions) return false;

    // if self, then true
    // tslint:disable-next-line:triple-equals - necessary because requestingEntity.userId is actually an mongoId that evaluates to a string
    if (params.accessPermissions.userId == params.targetResource.userId) return true;

    // if system admin, then true
    if (isStaffAdmin(params.accessPermissions)) return true;

    // if doesn't have orgId, can't verify access through org scope.  Return false
    if (!params.targetResource.orgId) return false;

    // if org admin, then true
    return hasOrganizationRole(params.accessPermissions, params.targetResource.orgId, [OrganizationRoles.facilitator, OrganizationRoles.admin]);
  }
}
