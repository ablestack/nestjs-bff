import { AuthorizationCheck } from './authorizationcheck.abstract';
import { IAuthorizationCheckData } from './authorizationcheckData.interface';

export class AlwaysTrue extends AuthorizationCheck {
  private static _singleton: AuthorizationCheck = new AlwaysTrue();
  public static get singleton(): AuthorizationCheck {
    return AlwaysTrue._singleton;
  }

  public async isAuthorized(data: IAuthorizationCheckData): Promise<boolean> {
    return true;
  }
}
