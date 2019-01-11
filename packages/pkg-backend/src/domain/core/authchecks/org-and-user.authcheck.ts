import { AuthorizationScopeContract } from '@nestjs-bff/global/lib/interfaces/authorization-scope.contract';
import { AuthCheckContract } from './authcheck.contract';
import { OrgAuthCheck } from './org.authcheck';
import { ScopedData } from './scoped-data';
import { UserAuthCheck } from './user.authcheck';

export class OrgAndUserAuthCheck extends AuthCheckContract<ScopedData> {
  private orgAuthCheck = new OrgAuthCheck();
  private userAuthCheck = new UserAuthCheck();

  public async isAuthorized(authorizationScope: AuthorizationScopeContract | undefined | null, scopedData: ScopedData): Promise<boolean> {
    return this.orgAuthCheck.isAuthorized(authorizationScope, scopedData) && this.userAuthCheck.isAuthorized(authorizationScope, scopedData);
  }
}
