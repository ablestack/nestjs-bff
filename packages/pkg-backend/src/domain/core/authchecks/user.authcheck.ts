import { OrganizationRoles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { AppError } from '../../../shared/exceptions/app.exception';
import { hasOrganizationRole, isStaffAdmin } from './authcheck.utils';
import { ScopedAuthCheckContract, ScopedData } from './scoped-authcheck.contract';

export class UserAuthCheck extends ScopedAuthCheckContract {
  constructor() {
    super();
  }

  public async isAuthorized(credentials: UserCredentialsContract | undefined | null, scopedData: ScopedData): Promise<boolean> {
    if (!scopedData.userIdForTargetResource) throw new AppError('userIdForTargetResource can not be null');

    if (!credentials) return false;

    // if self, then true
    // tslint:disable-next-line:triple-equals - necessary because requestingEntity.userId is actually an mongoId that evaluates to a string
    if (credentials.userId == scopedData.userIdForTargetResource) return true;

    // if system admin, then true
    if (isStaffAdmin(credentials)) return true;

    // if doesn't have orgId, can't verify access through org scope.  Return false
    if (!scopedData.orgIdForTargetResource) return false;

    // if org admin, then true
    return hasOrganizationRole(credentials, scopedData.orgIdForTargetResource, [OrganizationRoles.facilitator, OrganizationRoles.admin]);
  }
}
