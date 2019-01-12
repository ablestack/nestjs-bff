import { AccessPermissionsContract } from '../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { AppError } from '../../../shared/exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { hasOrganization, isStaffAdmin } from './authcheck.utils';
import { AuthorizationTarget } from './authorization-target';
import { ScopedData } from './scoped-data';

export class OrgAuthCheck extends AuthCheckContract<ScopedData> {
  public async isAuthorized(accessPermissions: AccessPermissionsContract | undefined | null, target: AuthorizationTarget<ScopedData>): Promise<boolean> {
    if (!target || !target.resource || !target.resource.orgIdForTargetResource) throw new AppError('organizationSlugForRequestedResource can not be null');

    if (!accessPermissions) return false;
    if (isStaffAdmin(accessPermissions)) return true;
    return hasOrganization(accessPermissions, target.resource.orgIdForTargetResource);
  }
}
