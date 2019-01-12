import { AccessPermissionsContract } from '@nestjs-bff/global/lib/interfaces/access-permissions.contract';
import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { AppError } from '../exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { AuthorizationCheckParams } from './authorization-params';
import { CrudOperations } from './crud-operations.enum';
import { OrgAuthCheck } from './org.authcheck';
import { ScopedData } from './scoped-data';
import { UserAuthCheck } from './user.authcheck';

//
// checks permissions against orgId and userId if these attributes exist on an entity
//
export class ScopedEntityAuthCheck extends AuthCheckContract<IEntity, CrudOperations> {
  private orgAuthCheck = new OrgAuthCheck();
  private userAuthCheck = new UserAuthCheck();

  public async isAuthorized(params: AuthorizationCheckParams<IEntity, CrudOperations>): Promise<boolean> {
    if (!params.targetResource || !params.targetResource) throw new AppError('target.resource can not be null');

    const scopedParams = {
      accessPermissions: params.accessPermissions,
      origin: params.origin,
      operation: params.operation,
      targetResource: new ScopedData(),
      data: params.data,
    };

    scopedParams.targetResource.userIdForTargetResource = params.targetResource['userId'];
    scopedParams.targetResource.orgIdForTargetResource = params.targetResource['orgId'];

    // if entity has an orgId, and the accessPermissions don't allow access to this org, then deny authorization (return false)
    if (scopedParams.targetResource.orgIdForTargetResource) {
      if (!(await this.orgAuthCheck.isAuthorized(scopedParams))) {
        return false;
      }
    }

    // if entity has a userId, and the accessPermissions don't allow access to this user, then deny authorization (return false)
    if (scopedParams.targetResource.userIdForTargetResource) {
      if (!(await this.userAuthCheck.isAuthorized(scopedParams))) {
        return false;
      }
    }

    // if authorization not denied for either org or user access, then allow access (return true)
    return true;
  }
}
