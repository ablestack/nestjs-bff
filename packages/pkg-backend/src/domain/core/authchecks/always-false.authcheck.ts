import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { AuthCheckContract } from './authcheck.contract';

export class AlwaysFalseAuthCheck extends AuthCheckContract {
  // tslint:disable-next-line:variable-name
  private static _singleton: AuthCheckContract = new AlwaysFalseAuthCheck();
  public static get singleton(): AuthCheckContract {
    return AlwaysFalseAuthCheck._singleton;
  }
  public async isAuthorized(credentials: UserCredentialsContract | undefined | null): Promise<boolean> {
    return false;
  }
}
