import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { AppError } from '../exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { AuthorizationCheckParams } from './authorization-params';
import { CrudOperations } from './crud-operations.enum';
import { OrgAccessAuthCheck } from './org-access.authcheck';
import { ScopedData } from './scoped-data';
import { UserAccessAuthCheck } from './user-access.authcheck';

//
// checks permissions against orgId and userId if these attributes exist on an entity
//
export class ScopedEntityAuthCheck extends AuthCheckContract<IEntity, CrudOperations> {
  private orgAuthCheck = new OrgAccessAuthCheck();
  private userAuthCheck = new UserAccessAuthCheck();

  public async isAuthorized(params: AuthorizationCheckParams<IEntity, CrudOperations>): Promise<boolean> {
    if (!params.targetResource || !params.targetResource) throw new AppError('target.resource can not be null');

    const scopedParams = {
      accessPermissions: params.accessPermissions,
      origin: params.origin,
      operation: params.operation,
      targetResource: new ScopedData(),
      data: params.data,
    };

    scopedParams.targetResource.userId = params.targetResource['userId'];
    scopedParams.targetResource.orgId = params.targetResource['orgId'];

    // if entity has an orgId, and the accessPermissions don't allow access to this org, then deny authorization (return false)
    if (scopedParams.targetResource.orgId) {
      if (!(await this.orgAuthCheck.isAuthorized(scopedParams))) {
        return false;
      }
    }

    // if entity has a userId, and the accessPermissions don't allow access to this user, then deny authorization (return false)
    if (scopedParams.targetResource.userId) {
      if (!(await this.userAuthCheck.isAuthorized(scopedParams))) {
        return false;
      }
    }

    // if authorization not denied for either org or user access, then allow access (return true)
    return true;
  }
}
