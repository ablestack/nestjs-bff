import { AccessPermissionsContract } from '../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { AuthCheckContract } from './authcheck.contract';

export class AlwaysTrueAuthCheck extends AuthCheckContract<any> {
  private static _singleton: AuthCheckContract<any> = new AlwaysTrueAuthCheck();
  public static get singleton(): AuthCheckContract<any> {
    return AlwaysTrueAuthCheck._singleton;
  }

  public async isAuthorized(accessPermissions: AccessPermissionsContract | undefined | null): Promise<boolean> {
    return true;
  }
}
