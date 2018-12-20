import { IAuthorizationTestData } from './authorizationTestData.interface';

export abstract class AuthorizationTest {
  abstract isAuthorized(data: IAuthorizationTestData): Promise<boolean>;
}
