import { AuthorizationCheckError } from '../exceptions/authorization-check.exception';
import { AuthCheckContract } from './authcheck.contract';
import { hasOrganizationRole, isStaffAdmin } from './authcheck.utils';
import { AuthorizationCheckParams } from './authorization-params';
import { ScopedData } from './scoped-data';

export class OrgRolesAuthCheck extends AuthCheckContract<ScopedData, any> {
  constructor(private readonly qualifyingRoles: string[]) {
    super();
  }

  public async isAuthorized(params: AuthorizationCheckParams<any, any>): Promise<boolean> {
    if (!params.targetResource || !params.targetResource.orgId) throw new AuthorizationCheckError(params, 'AuthorizationCheckParams - orgId can not be null');

    if (!params.accessPermissions) return false;

    if (isStaffAdmin(params.accessPermissions)) return true;
    return hasOrganizationRole(params.accessPermissions, params.targetResource.orgId, this.qualifyingRoles);
  }
}
