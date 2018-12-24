import { AuthorizationCheck } from './authorizationcheck.abstract';
import { IAuthorizationCheckData } from './authorizationcheckData.interface';

export class AlwaysFalse extends AuthorizationCheck {
  // tslint:disable-next-line:variable-name
  private static _singleton: AuthorizationCheck = new AlwaysFalse();
  public static get singleton(): AuthorizationCheck {
    return AlwaysFalse._singleton;
  }
  public async isAuthorized(data: IAuthorizationCheckData): Promise<boolean> {
    return false;
  }
}
