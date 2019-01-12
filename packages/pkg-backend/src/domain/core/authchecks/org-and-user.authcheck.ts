import { AccessPermissionsContract } from '../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { AuthCheckContract } from './authcheck.contract';
import { OrgAuthCheck } from './org.authcheck';
import { ScopedData } from './scoped-data';
import { UserAuthCheck } from './user.authcheck';

export class OrgAndUserAuthCheck extends AuthCheckContract<ScopedData> {
  private orgAuthCheck = new OrgAuthCheck();
  private userAuthCheck = new UserAuthCheck();

  public async isAuthorized(accessPermissions: AccessPermissionsContract | undefined | null, scopedData: ScopedData): Promise<boolean> {
    return this.orgAuthCheck.isAuthorized(accessPermissions, scopedData) && this.userAuthCheck.isAuthorized(accessPermissions, scopedData);
  }
}
