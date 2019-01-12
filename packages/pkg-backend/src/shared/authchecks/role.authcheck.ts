import { Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AuthCheckContract } from './authcheck.contract';
import { hasRole } from './authcheck.utils';
import { AuthorizationCheckParams } from './authorization-params';

export class RoleAuthCheck extends AuthCheckContract<any, any> {
  constructor(private readonly qualifyingRole: string) {
    super();
    // validation
    if (!Object.keys(Roles).includes(qualifyingRole)) {
      throw new Error(`Role ${qualifyingRole} not a valid role`);
    }
  }

  public async isAuthorized(params: AuthorizationCheckParams<any, any>): Promise<boolean> {
    if (!params.accessPermissions) return false;

    return hasRole(params.accessPermissionsaccessPermissions, this.qualifyingRole);
  }
}
