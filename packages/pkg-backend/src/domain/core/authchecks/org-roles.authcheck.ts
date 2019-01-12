import { AccessPermissionsContract } from '../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { AppError } from '../../../shared/exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { hasOrganizationRole, isStaffAdmin } from './authcheck.utils';
import { ScopedData } from './scoped-data';

export class CheckOrgRoles extends AuthCheckContract<ScopedData> {
  constructor(private readonly qualifyingRoles: string[]) {
    super();
  }

  public async isAuthorized(accessPermissions: AccessPermissionsContract | undefined | null, scopedData: ScopedData): Promise<boolean> {
    if (!accessPermissions) throw new AppError('No authentication accessPermissions found');
    if (!scopedData.orgIdForTargetResource) throw new AppError('orgIdForTargetResource can not be null');

    if (isStaffAdmin(accessPermissions)) return true;
    return hasOrganizationRole(accessPermissions, scopedData.orgIdForTargetResource, this.qualifyingRoles);
  }
}
