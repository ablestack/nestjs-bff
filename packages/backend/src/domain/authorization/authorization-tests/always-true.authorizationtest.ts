import { AuthorizationTest } from './authorization-test.abstract';
import { IAuthorizationTestData } from './authorizationTestData.interface';

export class AlwaysTrue extends AuthorizationTest {
  private static _singleton: AuthorizationTest = new AlwaysTrue();
  public static get singleton(): AuthorizationTest {
    return AlwaysTrue._singleton;
  }

  public async isAuthorized(data: IAuthorizationTestData): Promise<boolean> {
    return true;
  }
}
