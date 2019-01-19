import { AuthCheckContract } from './authcheck.contract';
import { AuthorizationCheckParams } from './authorization-params';
import { OrgAccessAuthCheck } from './org-access.authcheck';
import { ScopedData } from './scoped-data';
import { UserAccessAuthCheck } from './user-access.authcheck';

export class ScopedAccessAuthCheck extends AuthCheckContract<ScopedData, any> {
  private orgAuthCheck = new OrgAccessAuthCheck();
  private userAuthCheck = new UserAccessAuthCheck();

  public async isAuthorized(params: AuthorizationCheckParams<any, any>): Promise<boolean> {
    // if entity has an orgId, and the accessPermissions don't allow access to this org, then deny authorization (return false)
    if (params.targetResource.orgId) {
      if (!(await this.orgAuthCheck.isAuthorized(params))) {
        return false;
      }
    }

    // if entity has a userId, and the accessPermissions don't allow access to this user, then deny authorization (return false)
    if (params.targetResource.userId) {
      if (!(await this.userAuthCheck.isAuthorized(params))) {
        return false;
      }
    }

    // if authorization not denied for either org or user access, then allow access (return true)
    return true;
  }
}
// Scoped Params Auth Check
