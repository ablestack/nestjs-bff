import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';
import { AuthorizationCheck } from './authorizationcheck';

export class AlwaysFalse extends AuthorizationCheck {
  // tslint:disable-next-line:variable-name
  private static _singleton: AuthorizationCheck = new AlwaysFalse();
  public static get singleton(): AuthorizationCheck {
    return AlwaysFalse._singleton;
  }
  public async isAuthorized(data: IUserCredentials): Promise<boolean> {
    return false;
  }
}
