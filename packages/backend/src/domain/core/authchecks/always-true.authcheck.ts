import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { AuthCheckContract } from './authcheck.contract';

export class OrgAuthCheckAuthCheck implements AuthCheckContract {
  private static _singleton: AuthCheckContract = new OrgAuthCheckAuthCheck();
  public static get singleton(): AuthCheckContract {
    return OrgAuthCheckAuthCheck._singleton;
  }

  public async isAuthorized(credentials: UserCredentialsContract | undefined | null): Promise<boolean> {
    return true;
  }
}
