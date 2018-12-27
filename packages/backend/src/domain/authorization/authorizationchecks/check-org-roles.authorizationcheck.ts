import { AuthorizationCheck } from './authorizationcheck.abstract';
import { hasOrganizationRole, isSystemAdmin } from './authorizationcheck.utils';
import { IAuthorizationCheckData } from './authorizationcheckData.interface';

export class CheckOrgRoles extends AuthorizationCheck {
  constructor(private readonly qualifyingRoles: string[]) {
    super();
  }

  public async isAuthorized(data: IAuthorizationCheckData): Promise<boolean> {
    if (!data.requestingEntity) throw Error('No authenticated User found');
    if (!data.orgIdForTargetResource) throw Error('orgIdForTargetResource can not be null');

    if (isSystemAdmin(data.requestingEntity)) return true;
    return hasOrganizationRole(data.requestingEntity, data.orgIdForTargetResource, this.qualifyingRoles);
  }
}
