import { IUserCredentials } from '@nestjs-bff/global/lib/interfaces/credentials.interface';
import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { AuthCheckContract } from './authcheck.contract';
import { OrgAuthCheck } from './org.authcheck';
import { ScopedData } from './scoped-authcheck.contract';
import { UserAuthCheck } from './user.authcheck';

//
// checks permissions against orgId and userId if these attributes exist on an entity
//
export class ScopedEntityAuthCheck implements AuthCheckContract {
  private orgAuthCheck = new OrgAuthCheck();
  private userAuthCheck = new UserAuthCheck();

  public async isAuthorized(credentials: IUserCredentials, entity: IEntity): Promise<boolean> {
    const scopedData = new ScopedData();

    scopedData.userIdForTargetResource = entity['userId'];
    scopedData.orgIdForTargetResource = entity['orgId'];

    return (
      (scopedData.userIdForTargetResource ? this.orgAuthCheck.isAuthorized(credentials, scopedData) : true) &&
      (scopedData.orgIdForTargetResource ? this.userAuthCheck.isAuthorized(credentials, scopedData) : true)
    );
  }
}
