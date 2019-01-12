import { AuthCheckContract } from './authcheck.contract';
import { AuthorizationCheckParams } from './authorization-params';
import { OrgAuthCheck } from './org.authcheck';
import { ScopedData } from './scoped-data';
import { UserAuthCheck } from './user.authcheck';

export class OrgAndUserAuthCheck extends AuthCheckContract<ScopedData, any> {
  private orgAuthCheck = new OrgAuthCheck();
  private userAuthCheck = new UserAuthCheck();

  public async isAuthorized(params: AuthorizationCheckParams<any, any>): Promise<boolean> {
    return this.orgAuthCheck.isAuthorized(params) && this.userAuthCheck.isAuthorized(params);
  }
}
