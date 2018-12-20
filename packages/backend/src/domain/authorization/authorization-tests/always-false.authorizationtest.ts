import { AuthorizationTest } from './authorization-test.abstract';
import { IAuthorizationTestData } from './authorizationTestData.interface';

export class AlwaysFalse extends AuthorizationTest {
  // tslint:disable-next-line:variable-name
  private static _singleton: AuthorizationTest = new AlwaysFalse();
  public static get singleton(): AuthorizationTest {
    return AlwaysFalse._singleton;
  }
  public async isAuthorized(data: IAuthorizationTestData): Promise<boolean> {
    return false;
  }
}
