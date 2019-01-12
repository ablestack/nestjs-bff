import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AccessPermissionsContract } from '../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { AppError } from '../../../shared/exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { hasRole } from './authcheck.utils';

export class RoleAuthCheck extends AuthCheckContract<any> {
  constructor(private readonly qualifyingRole: string) {
    super();
    // validation
    if (!Object.keys(Roles).includes(qualifyingRole)) {
      throw new Error(`Role ${qualifyingRole} not a valid role`);
    }
  }

  public async isAuthorized(accessPermissions: AccessPermissionsContract | undefined | null, dataToCheck: any): Promise<boolean> {
    if (!accessPermissions) throw new AppError('No authentication accessPermissions found');

    return hasRole(accessPermissions, this.qualifyingRole);
  }
}
