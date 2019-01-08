import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { OrgAuthCheck } from './org.authcheck';
import { ScopedAuthCheckContract, ScopedData } from './scoped-authcheck.contract';
import { UserAuthCheck } from './user.authcheck';

export class OrgAndUserAuthCheck implements ScopedAuthCheckContract {
  private orgAuthCheck = new OrgAuthCheck();
  private userAuthCheck = new UserAuthCheck();

  public async isAuthorized(credentials: UserCredentialsContract | undefined | null, scopedData: ScopedData): Promise<boolean> {
    return this.orgAuthCheck.isAuthorized(credentials, scopedData) && this.userAuthCheck.isAuthorized(credentials, scopedData);
  }
}
