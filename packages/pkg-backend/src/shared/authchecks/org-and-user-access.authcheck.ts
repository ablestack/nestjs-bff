import { AuthCheckContract } from './authcheck.contract';
import { AuthorizationCheckParams } from './authorization-params';
import { OrgAccessAuthCheck } from './org-access.authcheck';
import { ScopedData } from './scoped-data';
import { UserAccessAuthCheck } from './user-access.authcheck';

export class OrgAndUserAccessAuthCheck extends AuthCheckContract<ScopedData, any> {
  private orgAuthCheck = new OrgAccessAuthCheck();
  private userAuthCheck = new UserAccessAuthCheck();

  public async isAuthorized(params: AuthorizationCheckParams<any, any>): Promise<boolean> {
    return this.orgAuthCheck.isAuthorized(params) && this.userAuthCheck.isAuthorized(params);
  }
}
