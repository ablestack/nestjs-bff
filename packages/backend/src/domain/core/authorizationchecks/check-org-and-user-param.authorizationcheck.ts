import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';
import { CheckOrgParam } from './check-org-param.authorizationcheck';
import { CheckUserParam } from './check-user-param.authorizationcheck';
import { ScopedAuthorizationCheck, ScopedData } from './scoped-authorizationcheck.interface';

export class CheckOrgAndUserParam implements ScopedAuthorizationCheck {
  private checkOrgParam = new CheckOrgParam();
  private checkUserParam = new CheckUserParam();

  public async isAuthorized(credentials: IUserCredentials, scopedData: ScopedData): Promise<boolean> {
    return this.checkOrgParam.isAuthorized(credentials, scopedData) && this.checkUserParam.isAuthorized(credentials, scopedData);
  }
}
