import { AccessPermissionsContract } from '../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { AppError } from '../../../shared/exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { hasOrganizationRole, isStaffAdmin } from './authcheck.utils';
import { AuthorizationTarget } from './authorization-target';
import { ScopedData } from './scoped-data';

export class CheckOrgRoles extends AuthCheckContract<ScopedData> {
  constructor(private readonly qualifyingRoles: string[]) {
    super();
  }

  public async isAuthorized(accessPermissions: AccessPermissionsContract | undefined | null, target: AuthorizationTarget<ScopedData>): Promise<boolean> {
    if (!accessPermissions) throw new AppError('No authentication accessPermissions found');
    if (!target || !target.resource || !target.resource.orgIdForTargetResource) throw new AppError('orgIdForTargetResource can not be null');

    if (isStaffAdmin(accessPermissions)) return true;
    return hasOrganizationRole(accessPermissions, target.resource.orgIdForTargetResource, this.qualifyingRoles);
  }
}
