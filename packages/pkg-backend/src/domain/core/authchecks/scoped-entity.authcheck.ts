import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
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

  public async isAuthorized(credentials: UserCredentialsContract | undefined | null, entity: IEntity): Promise<boolean> {
    const scopedData = new ScopedData();

    scopedData.userIdForTargetResource = entity['userId'];
    scopedData.orgIdForTargetResource = entity['orgId'];

    // if entity has an orgId, and the credentials don't allow access to this org, then deny authorization (return false)
    if (scopedData.orgIdForTargetResource) {
      if (!(await this.orgAuthCheck.isAuthorized(credentials, scopedData))) {
        return false;
      }
    }

    // if entity has a userId, and the credentials don't allow access to this user, then deny authorization (return false)
    if (scopedData.userIdForTargetResource) {
      if (!(await this.userAuthCheck.isAuthorized(credentials, scopedData))) {
        return false;
      }
    }

    // if authorization not denied for either org or user access, then allow access (return true)
    return true;
  }
}
