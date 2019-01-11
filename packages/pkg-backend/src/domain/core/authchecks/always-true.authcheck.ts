import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { AuthCheckContract } from './authcheck.contract';

export class AlwaysTrueAuthCheck extends AuthCheckContract<any> {
  private static _singleton: AuthCheckContract<any> = new AlwaysTrueAuthCheck();
  public static get singleton(): AuthCheckContract<any> {
    return AlwaysTrueAuthCheck._singleton;
  }

  public async isAuthorized(credentials: UserCredentialsContract | undefined | null): Promise<boolean> {
    return true;
  }
}
