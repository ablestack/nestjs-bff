import { AuthCheckContract } from './authcheck.contract';
import { AuthorizationCheckParams } from './authorization-params';

export class AlwaysFalseAuthCheck extends AuthCheckContract<any, any> {
  // tslint:disable-next-line:variable-name
  private static _singleton: AuthCheckContract<any, any> = new AlwaysFalseAuthCheck();
  public static get singleton(): AuthCheckContract<any, any> {
    return AlwaysFalseAuthCheck._singleton;
  }
  public async isAuthorized(params: AuthorizationCheckParams<any, any>): Promise<boolean> {
    return false;
  }
}
