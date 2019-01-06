import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';
import { OrgAuthCheck } from './org.authcheck';
import { ScopedAuthCheckContract, ScopedData } from './scoped-authcheck.contract';
import { UserAuthCheck } from './user.authcheck';

export class OrgAndUserAuthCheck implements ScopedAuthCheckContract {
  private orgAuthCheck = new OrgAuthCheck();
  private userAuthCheck = new UserAuthCheck();

  public async isAuthorized(credentials: IUserCredentials, scopedData: ScopedData): Promise<boolean> {
    return this.orgAuthCheck.isAuthorized(credentials, scopedData) && this.userAuthCheck.isAuthorized(credentials, scopedData);
  }
}
