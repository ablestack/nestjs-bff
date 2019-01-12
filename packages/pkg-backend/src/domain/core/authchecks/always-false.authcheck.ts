import { AccessPermissionsContract } from '../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { AuthCheckContract } from './authcheck.contract';

export class AlwaysFalseAuthCheck extends AuthCheckContract<any> {
  // tslint:disable-next-line:variable-name
  private static _singleton: AuthCheckContract<any> = new AlwaysFalseAuthCheck();
  public static get singleton(): AuthCheckContract<any> {
    return AlwaysFalseAuthCheck._singleton;
  }
  public async isAuthorized(accessPermissions: AccessPermissionsContract | undefined | null): Promise<boolean> {
    return false;
  }
}
