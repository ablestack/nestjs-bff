import { AuthorizationScopeContract } from '@nestjs-bff/global/lib/interfaces/authorization-scope.contract';
import { AppError } from '../../../shared/exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { hasOrganization, isStaffAdmin } from './authcheck.utils';
import { ScopedData } from './scoped-data';

export class OrgAuthCheck extends AuthCheckContract<ScopedData> {
  public async isAuthorized(authorizationScope: AuthorizationScopeContract | undefined | null, scopedData: ScopedData): Promise<boolean> {
    if (!scopedData.orgIdForTargetResource) throw new AppError('organizationSlugForRequestedResource can not be null');

    if (!authorizationScope) return false;
    if (isStaffAdmin(authorizationScope)) return true;
    return hasOrganization(authorizationScope, scopedData.orgIdForTargetResource);
  }
}
