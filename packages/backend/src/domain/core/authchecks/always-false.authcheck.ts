import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';
import { AuthCheckContract } from './authcheck.contract';

export class AlwaysFalseAuthCheck extends AuthCheckContract {
  // tslint:disable-next-line:variable-name
  private static _singleton: AuthCheckContract = new AlwaysFalseAuthCheck();
  public static get singleton(): AuthCheckContract {
    return AlwaysFalseAuthCheck._singleton;
  }
  public async isAuthorized(data: IUserCredentials): Promise<boolean> {
    return false;
  }
}
