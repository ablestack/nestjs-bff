import { AuthorizationCheck } from './authorizationcheck.abstract';
import { IAuthorizationCheckData } from './authorizationcheckData.interface';
import { CheckOrgParam } from './check-org-param.authorizationcheck';
import { CheckUserParam } from './check-user-param.authorizationcheck';

export class CheckOrgAndUserParam extends AuthorizationCheck {
  private checkOrgParam = new CheckOrgParam();
  private checkUserParam = new CheckUserParam();

  constructor() {
    super();
  }

  public async isAuthorized(data: IAuthorizationCheckData): Promise<boolean> {
    return this.checkOrgParam.isAuthorized(data) && this.checkUserParam.isAuthorized(data);
  }
}
