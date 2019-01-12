import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { AccessPermissionsContract } from '../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { AppError } from '../../../shared/exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { AuthorizationTarget } from './authorization-target';
import { OrgAuthCheck } from './org.authcheck';
import { ScopedData } from './scoped-data';
import { UserAuthCheck } from './user.authcheck';

//
// checks permissions against orgId and userId if these attributes exist on an entity
//
export class ScopedEntityAuthCheck extends AuthCheckContract<IEntity> {
  private orgAuthCheck = new OrgAuthCheck();
  private userAuthCheck = new UserAuthCheck();

  public async isAuthorized(accessPermissions: AccessPermissionsContract | undefined | null, target: AuthorizationTarget<IEntity>): Promise<boolean> {
    if (!target || !target.resource) throw new AppError('target.resource can not be null');

    const scopedDataTarget = {
      operation: target.operation,
      resource: new ScopedData(),
    };

    scopedDataTarget.resource.userIdForTargetResource = target.resource['userId'];
    scopedDataTarget.resource.orgIdForTargetResource = target.resource['orgId'];

    // if entity has an orgId, and the accessPermissions don't allow access to this org, then deny authorization (return false)
    if (scopedDataTarget.resource.orgIdForTargetResource) {
      if (!(await this.orgAuthCheck.isAuthorized(accessPermissions, scopedDataTarget))) {
        return false;
      }
    }

    // if entity has a userId, and the accessPermissions don't allow access to this user, then deny authorization (return false)
    if (scopedDataTarget.resource.userIdForTargetResource) {
      if (!(await this.userAuthCheck.isAuthorized(accessPermissions, scopedDataTarget))) {
        return false;
      }
    }

    // if authorization not denied for either org or user access, then allow access (return true)
    return true;
  }
}
