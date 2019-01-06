import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';
import { AuthCheckContract } from './authcheck.contract';

export class OrgAuthCheckAuthCheck implements AuthCheckContract {
  private static _singleton: AuthCheckContract = new OrgAuthCheckAuthCheck();
  public static get singleton(): AuthCheckContract {
    return OrgAuthCheckAuthCheck._singleton;
  }

  public async isAuthorized(data: IUserCredentials): Promise<boolean> {
    return true;
  }
}
