import { AuthCheckContract } from './authcheck.contract';

export class AlwaysTrueAuthCheck extends AuthCheckContract<any, any> {
  private static _singleton: AuthCheckContract<any, any> = new AlwaysTrueAuthCheck();
  public static get singleton(): AuthCheckContract<any, any> {
    return AlwaysTrueAuthCheck._singleton;
  }

  public async isAuthorized(params: AuthorizationCheckParams<any, any>): Promise<boolean> {
    return true;
  }
}
