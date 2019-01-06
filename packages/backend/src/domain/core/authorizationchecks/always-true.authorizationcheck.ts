import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';
import { AuthorizationCheck } from './authorizationcheck';

export class AlwaysTrue implements AuthorizationCheck {
  private static _singleton: AuthorizationCheck = new AlwaysTrue();
  public static get singleton(): AuthorizationCheck {
    return AlwaysTrue._singleton;
  }

  public async isAuthorized(data: IUserCredentials): Promise<boolean> {
    return true;
  }
}
