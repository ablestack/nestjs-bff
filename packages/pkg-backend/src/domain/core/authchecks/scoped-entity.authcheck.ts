import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { AccessPermissionsContract } from '../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { AuthCheckContract } from './authcheck.contract';
import { OrgAuthCheck } from './org.authcheck';
import { ScopedData } from './scoped-data';
import { UserAuthCheck } from './user.authcheck';

//
// checks permissions against orgId and userId if these attributes exist on an entity
//
export class ScopedEntityAuthCheck extends AuthCheckContract<IEntity> {
  private orgAuthCheck = new OrgAuthCheck();
  private userAuthCheck = new UserAuthCheck();

  public async isAuthorized(accessPermissions: AccessPermissionsContract | undefined | null, entity: IEntity): Promise<boolean> {
    const scopedData = new ScopedData();

    scopedData.userIdForTargetResource = entity['userId'];
    scopedData.orgIdForTargetResource = entity['orgId'];

    // if entity has an orgId, and the accessPermissions don't allow access to this org, then deny authorization (return false)
    if (scopedData.orgIdForTargetResource) {
      if (!(await this.orgAuthCheck.isAuthorized(accessPermissions, scopedData))) {
        return false;
      }
    }

    // if entity has a userId, and the accessPermissions don't allow access to this user, then deny authorization (return false)
    if (scopedData.userIdForTargetResource) {
      if (!(await this.userAuthCheck.isAuthorized(accessPermissions, scopedData))) {
        return false;
      }
    }

    // if authorization not denied for either org or user access, then allow access (return true)
    return true;
  }
}
